#!/usr/bin/env node
/**
 * subir_campanha.js — sobe uma campanha de Rede de Pesquisa no Google Ads via API.
 *
 * Lê o documento gerado pela skill google-ads-planner (Markdown com bloco JSON entre
 * os marcadores <!-- json-campanha:inicio --> e <!-- json-campanha:fim -->, ou um .json),
 * valida, e cria: orçamento → campanha (PAUSADA, Rede de Pesquisa pura) → região/idioma e
 * negativas de campanha → grupos → keywords e negativas dos grupos → anúncios RSA → extensões.
 *
 * Uso:
 *   node subir_campanha.js "Google Ads Output/cliente-2026-06.md" --validate-only
 *   node subir_campanha.js "Google Ads Output/cliente-2026-06.md"
 *
 * Flags:
 *   --validate-only   Valida o documento e testa o acesso à conta, SEM criar nada (dry-run).
 *   --customer <id>   Sobrescreve o customer_id (conta do cliente).
 *   --login <id>      Sobrescreve o login_customer_id (MCC).
 *
 * SEGURANÇA: a campanha é sempre criada PAUSADA, com parceiros de pesquisa e Display
 * desligados. Nada veicula até revisão e ativação manual no painel.
 */

const fs = require('fs');
const path = require('path');

// ---------- .env (sobe diretórios a partir deste arquivo até achar) ----------
function carregarEnv() {
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    const candidato = path.join(dir, '.env');
    if (fs.existsSync(candidato)) {
      try { require('dotenv').config({ path: candidato }); } catch (_) { /* dotenv ausente: usa env já setado */ }
      return candidato;
    }
    const pai = path.dirname(dir);
    if (pai === dir) break;
    dir = pai;
  }
  return null;
}

// ---------- utilitários ----------
const soDigitos = (s) => String(s || '').replace(/\D/g, '');
const brlParaMicros = (brl) => Math.round(Number(brl) * 1e6 / 1e4) * 1e4; // múltiplo de 10.000
const IDIOMAS = { pt: 1014, en: 1000, es: 1003 };

function parseArgs(argv) {
  const args = { file: null, validateOnly: false, listAccounts: false, customer: null, login: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--validate-only' || a === '--dry-run') args.validateOnly = true;
    else if (a === '--list-accounts') args.listAccounts = true;
    else if (a === '--customer') args.customer = argv[++i];
    else if (a === '--login') args.login = argv[++i];
    else if (!a.startsWith('--') && !args.file) args.file = a;
  }
  return args;
}

function extrairJson(conteudo, arquivo) {
  if (arquivo.toLowerCase().endsWith('.json')) return JSON.parse(conteudo);
  const m = conteudo.match(/<!--\s*json-campanha:inicio\s*-->([\s\S]*?)<!--\s*json-campanha:fim\s*-->/);
  let bloco = m ? m[1] : null;
  if (!bloco) {
    // fallback: primeiro bloco ```json
    const f = conteudo.match(/```json\s*([\s\S]*?)```/);
    if (f) bloco = f[1];
  }
  if (!bloco) throw new Error('Bloco JSON não encontrado. Esperado entre <!-- json-campanha:inicio --> e <!-- json-campanha:fim -->.');
  bloco = bloco.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(bloco);
}

// ---------- validação local ----------
function validar(plano) {
  const erros = [];
  const avisos = [];
  const lim = (txt, n) => (txt || '').length > n;

  const c = plano.campanha || {};
  if (!c.nome) erros.push('campanha.nome ausente.');
  if (!(Number(c.orcamento_diario_brl) > 0)) erros.push('campanha.orcamento_diario_brl deve ser > 0.');
  const estrategias = ['MAXIMIZE_CONVERSIONS', 'TARGET_CPA', 'MANUAL_CPC', 'MAXIMIZE_CONVERSION_VALUE'];
  if (!estrategias.includes(c.estrategia_lance)) erros.push(`campanha.estrategia_lance inválida (${c.estrategia_lance}). Use: ${estrategias.join(', ')}.`);
  if (c.estrategia_lance === 'TARGET_CPA' && !(Number(c.cpa_alvo_brl) > 0)) erros.push('TARGET_CPA exige cpa_alvo_brl > 0.');
  if (!Array.isArray(c.localizacoes) || c.localizacoes.length === 0) avisos.push('Sem localizações: a campanha alcançará todas as regiões (verifique se é o desejado).');

  const grupos = plano.grupos || [];
  if (grupos.length === 0) erros.push('Nenhum grupo de anúncios.');
  grupos.forEach((g, gi) => {
    const tag = `grupo[${gi}] "${g.nome || ''}"`;
    if (!g.nome) erros.push(`${tag}: nome ausente.`);
    if (!Array.isArray(g.keywords) || g.keywords.length === 0) erros.push(`${tag}: sem keywords.`);
    (g.keywords || []).forEach((k) => {
      if (!k.texto) erros.push(`${tag}: keyword sem texto.`);
      if (!['PHRASE', 'EXACT'].includes(k.match)) erros.push(`${tag}: keyword "${k.texto}" com match inválido (${k.match}). Use PHRASE ou EXACT.`);
    });
    const anuncios = g.anuncios || [];
    if (anuncios.length === 0) erros.push(`${tag}: sem anúncios.`);
    anuncios.forEach((a, ai) => {
      const at = `${tag} anúncio[${ai}]`;
      if (!a.final_url || !/^https?:\/\//i.test(a.final_url)) erros.push(`${at}: final_url ausente ou inválida.`);
      const hs = a.headlines || [], ds = a.descriptions || [];
      if (hs.length < 3) erros.push(`${at}: precisa de ao menos 3 headlines (tem ${hs.length}).`);
      if (hs.length > 15) erros.push(`${at}: máximo 15 headlines (tem ${hs.length}).`);
      if (ds.length < 2) erros.push(`${at}: precisa de ao menos 2 descriptions (tem ${ds.length}).`);
      if (ds.length > 4) erros.push(`${at}: máximo 4 descriptions (tem ${ds.length}).`);
      hs.forEach((h) => lim(h, 30) && erros.push(`${at}: headline > 30 chars: "${h}" (${h.length}).`));
      ds.forEach((d) => lim(d, 90) && erros.push(`${at}: description > 90 chars: "${d}" (${d.length}).`));
      if (lim(a.path1, 15)) erros.push(`${at}: path1 > 15 chars.`);
      if (lim(a.path2, 15)) erros.push(`${at}: path2 > 15 chars.`);
    });
  });

  const ext = plano.extensoes || {};
  (ext.callouts || []).forEach((t) => lim(t, 25) && erros.push(`callout > 25 chars: "${t}" (${t.length}).`));
  (ext.sitelinks || []).forEach((s, i) => {
    if (lim(s.texto, 25)) erros.push(`sitelink[${i}] texto > 25 chars.`);
    if (lim(s.desc1, 35)) erros.push(`sitelink[${i}] desc1 > 35 chars.`);
    if (lim(s.desc2, 35)) erros.push(`sitelink[${i}] desc2 > 35 chars.`);
    if (s.final_url && !/^https?:\/\//i.test(s.final_url)) erros.push(`sitelink[${i}] final_url inválida.`);
  });

  return { erros, avisos };
}

function resumo(plano) {
  const c = plano.campanha || {};
  const grupos = plano.grupos || [];
  const totalKw = grupos.reduce((s, g) => s + (g.keywords || []).length, 0);
  const totalAds = grupos.reduce((s, g) => s + (g.anuncios || []).length, 0);
  const ext = plano.extensoes || {};
  const linhas = [
    `Cliente:      ${plano.cliente || '(não informado)'}`,
    `Campanha:     ${c.nome}`,
    `Status:       PAUSED (forçado)`,
    `Orçamento:    R$ ${Number(c.orcamento_diario_brl).toFixed(2)}/dia`,
    `Lance:        ${c.estrategia_lance}${c.estrategia_lance === 'TARGET_CPA' ? ` (CPA alvo R$ ${c.cpa_alvo_brl})` : ''}`,
    `Rede:         Pesquisa Google = on | Parceiros = OFF | Display = OFF`,
    `Regiões:      ${(c.localizacoes || []).map((l) => l.nome || l.criteria_id).join(', ') || '(todas)'}`,
    `Idiomas:      ${(c.idiomas || ['pt']).join(', ')}`,
    `Neg. campanha:${(c.negativas_campanha || []).length}`,
    `Grupos:       ${grupos.length}  |  Keywords: ${totalKw}  |  Anúncios: ${totalAds}`,
    `Extensões:    ${(ext.callouts || []).length} callouts, ${(ext.sitelinks || []).length} sitelinks`,
    `Pendências:   ${(plano.ativos_externos_pendentes || []).join(', ') || 'nenhuma'}`,
  ];
  grupos.forEach((g) => {
    linhas.push(`   • ${g.nome}: ${(g.keywords || []).length} kw, ${(g.anuncios || []).length} anúncio(s)`);
  });
  return linhas.join('\n');
}

// ---------- criação na API ----------
function camposLance(c) {
  switch (c.estrategia_lance) {
    case 'TARGET_CPA':
      // tCPA é representado como Maximize Conversions com target_cpa_micros (forma atual da API).
      return { maximize_conversions: { target_cpa_micros: brlParaMicros(c.cpa_alvo_brl) } };
    case 'MANUAL_CPC':
      return { manual_cpc: { enhanced_cpc_enabled: false } };
    case 'MAXIMIZE_CONVERSION_VALUE':
      return { maximize_conversion_value: {} };
    case 'MAXIMIZE_CONVERSIONS':
    default: {
      const mc = {};
      if (Number(c.cpa_alvo_brl) > 0) mc.target_cpa_micros = brlParaMicros(c.cpa_alvo_brl);
      return { maximize_conversions: mc };
    }
  }
}

async function executar(plano, customer, enums, manual) {
  const c = plano.campanha;
  const idCurto = (rn) => String(rn).split('/').pop();
  const criados = { campanha: null, campanhaId: null, grupos: [], avisosExt: [] };

  // 1) Orçamento
  const orc = await customer.campaignBudgets.create([{
    name: `${c.nome} — orçamento`,
    amount_micros: brlParaMicros(c.orcamento_diario_brl),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    explicitly_shared: false,
  }]);
  const budgetRn = orc.results[0].resource_name;

  // 2) Campanha (PAUSED, Rede de Pesquisa pura)
  const camp = await customer.campaigns.create([{
    name: c.nome,
    advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
    status: enums.CampaignStatus.PAUSED,
    campaign_budget: budgetRn,
    network_settings: {
      target_google_search: c.rede?.google_search !== false,
      target_search_network: false,
      target_content_network: false,
      target_partner_search_network: false,
    },
    ...camposLance(c),
  }]);
  const campRn = camp.results[0].resource_name;
  criados.campanha = campRn;
  criados.campanhaId = idCurto(campRn);

  // 3) Critérios da campanha: região, idioma, negativas
  const critOps = [];
  (c.localizacoes || []).forEach((l) => {
    if (l.criteria_id) critOps.push({ campaign: campRn, location: { geo_target_constant: `geoTargetConstants/${l.criteria_id}` } });
  });
  (c.idiomas || ['pt']).forEach((lng) => {
    const id = IDIOMAS[String(lng).toLowerCase()] || IDIOMAS.pt;
    critOps.push({ campaign: campRn, language: { language_constant: `languageConstants/${id}` } });
  });
  (c.negativas_campanha || []).forEach((t) => {
    critOps.push({ campaign: campRn, negative: true, keyword: { text: t, match_type: enums.KeywordMatchType.BROAD } });
  });
  if (critOps.length) await customer.campaignCriteria.create(critOps);

  // 4..6) Grupos, keywords/negativas, anúncios
  for (const g of plano.grupos) {
    const ag = await customer.adGroups.create([{
      name: g.nome,
      campaign: campRn,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      ...(manual && Number(g.lance_padrao_brl) > 0 ? { cpc_bid_micros: brlParaMicros(g.lance_padrao_brl) } : {}),
    }]);
    const agRn = ag.results[0].resource_name;

    const critGrupo = [];
    (g.keywords || []).forEach((k) => critGrupo.push({
      ad_group: agRn,
      status: enums.AdGroupCriterionStatus.ENABLED,
      keyword: { text: k.texto, match_type: enums.KeywordMatchType[k.match] },
    }));
    (g.negativas || []).forEach((t) => critGrupo.push({
      ad_group: agRn, negative: true, keyword: { text: t, match_type: enums.KeywordMatchType.BROAD },
    }));
    if (critGrupo.length) await customer.adGroupCriteria.create(critGrupo);

    await customer.adGroupAds.create((g.anuncios || []).map((a) => ({
      ad_group: agRn,
      status: enums.AdGroupAdStatus.ENABLED,
      ad: {
        final_urls: [a.final_url],
        responsive_search_ad: {
          headlines: (a.headlines || []).map((t) => ({ text: t })),
          descriptions: (a.descriptions || []).map((t) => ({ text: t })),
          ...(a.path1 ? { path1: a.path1 } : {}),
          ...(a.path2 ? { path2: a.path2 } : {}),
        },
      },
    })));

    criados.grupos.push({ nome: g.nome, id: idCurto(agRn) });
  }

  // 7) Extensões (não abortam a campanha se falharem)
  const ext = plano.extensoes || {};
  try {
    if ((ext.callouts || []).length) {
      const as = await customer.assets.create(ext.callouts.map((t) => ({ callout_asset: { callout_text: t } })));
      await customer.campaignAssets.create(as.results.map((r) => ({ campaign: campRn, asset: r.resource_name, field_type: enums.AssetFieldType.CALLOUT })));
    }
  } catch (e) { criados.avisosExt.push(`Callouts falharam: ${e.message}`); }
  try {
    if ((ext.sitelinks || []).length) {
      const as = await customer.assets.create(ext.sitelinks.map((s) => ({
        final_urls: [s.final_url],
        sitelink_asset: { link_text: s.texto, ...(s.desc1 ? { description1: s.desc1 } : {}), ...(s.desc2 ? { description2: s.desc2 } : {}) },
      })));
      await customer.campaignAssets.create(as.results.map((r) => ({ campaign: campRn, asset: r.resource_name, field_type: enums.AssetFieldType.SITELINK })));
    }
  } catch (e) { criados.avisosExt.push(`Sitelinks falharam: ${e.message}`); }

  return criados;
}

// ---------- main ----------
(async () => {
  const args = parseArgs(process.argv.slice(2));
  const envPath = carregarEnv();

  // Client a partir do .env (usado tanto por --list-accounts quanto pelo deploy)
  let GoogleAdsApi, enums;
  try { ({ GoogleAdsApi, enums } = require('google-ads-api')); }
  catch (e) { console.error('❌ Dependência google-ads-api ausente. Rode `npm install` na raiz do projeto.'); process.exit(1); }
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });

  // --list-accounts: lista as contas vinculadas ao MCC e sai (ajuda qualquer aluno a achar o customer_id certo)
  if (args.listAccounts) {
    const mcc = soDigitos(args.login || process.env.GOOGLE_ADS_MCC_CUSTOMER_ID);
    if (!mcc) { console.error('❌ Sem MCC (defina GOOGLE_ADS_MCC_CUSTOMER_ID no .env ou use --login).'); process.exit(1); }
    try {
      const mng = client.Customer({ customer_id: mcc, login_customer_id: mcc, refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN });
      const rows = await mng.query(`SELECT customer_client.id, customer_client.descriptive_name, customer_client.manager, customer_client.currency_code FROM customer_client WHERE customer_client.status = 'ENABLED' ORDER BY customer_client.descriptive_name`);
      console.log(`Contas vinculadas ao MCC ${mcc}:\n`);
      rows.forEach((r) => { const c = r.customer_client; console.log(`  ${c.id}  ${c.descriptive_name || '(sem nome)'} ${c.manager ? '[MCC]' : ''} (${c.currency_code || ''})`); });
      console.log(`\n👉 Use o ID desejado em "conta.customer_id" no documento, ou passe --customer <ID> no deploy.`);
    } catch (e) { console.error(`❌ Falha ao listar contas: ${e.message || e}`); process.exit(1); }
    return;
  }

  if (!args.file) {
    console.error('Uso: node subir_campanha.js "<doc.md|doc.json>" [--validate-only] [--list-accounts] [--customer ID] [--login MCC]');
    process.exit(2);
  }
  console.log(`📄 Documento: ${args.file}`);
  console.log(`🔐 .env: ${envPath || '(não encontrado — usando variáveis de ambiente atuais)'}`);
  console.log(args.validateOnly ? '🧪 Modo: VALIDATE-ONLY (não cria nada)\n' : '🚀 Modo: EXECUÇÃO (cria de verdade, PAUSADA)\n');

  // Ler e parsear
  let plano;
  try {
    const conteudo = fs.readFileSync(args.file, 'utf8');
    plano = extrairJson(conteudo, args.file);
  } catch (e) {
    console.error(`❌ Erro ao ler/parsear o documento: ${e.message}`);
    process.exit(1);
  }

  // Forçar salvaguardas + avisar se o doc tentou o contrário
  plano.campanha = plano.campanha || {};
  if (plano.campanha.status && plano.campanha.status !== 'PAUSED') console.log(`⚠️  status "${plano.campanha.status}" ignorado — forçando PAUSED.`);
  plano.campanha.status = 'PAUSED';
  plano.campanha.rede = plano.campanha.rede || {};
  if (plano.campanha.rede.search_partners || plano.campanha.rede.display) console.log('⚠️  Parceiros/Display vieram ligados no doc — forçando OFF (Rede de Pesquisa pura).');
  plano.campanha.rede.search_partners = false;
  plano.campanha.rede.display = false;

  // Validar
  const { erros, avisos } = validar(plano);
  avisos.forEach((a) => console.log(`⚠️  ${a}`));
  if (erros.length) {
    console.error(`\n❌ ${erros.length} erro(s) de validação — corrija o documento antes de subir:`);
    erros.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }
  console.log('✅ Validação local OK.\n');
  console.log('— PLANO —');
  console.log(resumo(plano));
  console.log('');

  // Conexão (client já criado acima)
  const customerId = soDigitos(args.customer || plano.conta?.customer_id || process.env.GOOGLE_ADS_CUSTOMER_ID);
  const loginId = soDigitos(args.login || plano.conta?.login_customer_id || process.env.GOOGLE_ADS_MCC_CUSTOMER_ID);
  if (!customerId) { console.error('❌ Sem customer_id (nem no doc, nem no .env GOOGLE_ADS_CUSTOMER_ID).'); process.exit(1); }

  const customer = client.Customer({
    customer_id: customerId,
    login_customer_id: loginId || undefined,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  try {
    const r = await customer.query('SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1');
    const info = r[0]?.customer || {};
    console.log(`🔗 Conta: ${info.descriptive_name || '(sem nome)'} (ID ${info.id}, moeda ${info.currency_code}). Login/MCC: ${loginId || '(não usado)'}\n`);
  } catch (e) {
    console.error(`❌ Falha ao conectar na conta ${customerId}: ${e.message || e}`);
    process.exit(1);
  }

  if (args.validateOnly) {
    console.log('🧪 VALIDATE-ONLY concluído. Documento válido e conta acessível. Nada foi criado.');
    console.log('   Para subir de verdade, rode o mesmo comando SEM --validate-only.');
    return;
  }

  // Executar
  try {
    const criados = await executar(plano, customer, enums, plano.campanha.estrategia_lance === 'MANUAL_CPC');
    console.log('✅ CAMPANHA CRIADA (PAUSADA).');
    console.log(`   Campanha ID: ${criados.campanhaId}`);
    criados.grupos.forEach((g) => console.log(`   Grupo "${g.nome}" → ID ${g.id}`));
    criados.avisosExt.forEach((a) => console.log(`   ⚠️  ${a}`));
    console.log(`\n👉 Revise em https://ads.google.com (conta ${customerId}) e ATIVE manualmente quando aprovar.`);
    const pend = plano.ativos_externos_pendentes || [];
    if (pend.length) console.log(`📌 Pendências (ativos externos): ${pend.join(', ')} — adicionar no painel ou via deploy quando tiver os arquivos.`);
  } catch (e) {
    console.error('❌ Erro ao criar a campanha:');
    if (Array.isArray(e.errors)) e.errors.forEach((er) => console.error(`   - ${er.message} ${er.error_code ? JSON.stringify(er.error_code) : ''}`));
    else console.error(`   ${e.message || e}`);
    console.error('\n⚠️  Pode ter havido criação parcial (ex.: orçamento/campanha). Verifique no painel antes de rodar de novo para não duplicar.');
    process.exit(1);
  }
})();
