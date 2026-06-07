#!/usr/bin/env node
/**
 * puxar_historico.js — lê o histórico de uma conta Google Ads para servir de insumo
 * ao planejamento (Caminho D do google-ads-planner). NÃO altera nada (somente leitura).
 *
 * Traz, no período pedido:
 *   1) Termos de pesquisa que CONVERTERAM        → candidatos a keyword exata / novos grupos
 *   2) Keywords por performance                  → o que manter/escalar (base dos grupos)
 *   3) Termos que GASTARAM e não converteram     → candidatos a negativa
 *
 * Uso (a partir da raiz do projeto):
 *   node ".claude/skills/google-ads-planner/scripts/puxar_historico.js" --customer <ID_DO_CLIENTE> [--days 90] [--login <MCC>]
 *
 * Requer as credenciais GOOGLE_ADS_* no .env (ver guia 03). Aponte --customer para a
 * conta do CLIENTE (não a conta padrão do .env).
 */

const fs = require('fs');
const path = require('path');

function carregarEnv() {
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    const candidato = path.join(dir, '.env');
    if (fs.existsSync(candidato)) {
      try { require('dotenv').config({ path: candidato }); } catch (_) {}
      return candidato;
    }
    const pai = path.dirname(dir);
    if (pai === dir) break;
    dir = pai;
  }
  return null;
}

const soDigitos = (s) => String(s || '').replace(/\D/g, '');
const brl = (micros) => (Number(micros || 0) / 1e6);

function parseArgs(argv) {
  const a = { customer: null, login: null, days: 90 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--customer') a.customer = argv[++i];
    else if (argv[i] === '--login') a.login = argv[++i];
    else if (argv[i] === '--days') a.days = parseInt(argv[++i], 10) || 90;
  }
  return a;
}

function dataISO(offsetDias) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDias);
  return d.toISOString().slice(0, 10);
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  carregarEnv();

  const customerId = soDigitos(args.customer || process.env.GOOGLE_ADS_CUSTOMER_ID);
  const loginId = soDigitos(args.login || process.env.GOOGLE_ADS_MCC_CUSTOMER_ID);
  if (!customerId) {
    console.error('❌ Informe a conta do cliente: --customer <ID> (sem hífen).');
    process.exit(2);
  }

  let GoogleAdsApi;
  try { ({ GoogleAdsApi } = require('google-ads-api')); }
  catch (_) { console.error('❌ Dependência google-ads-api ausente. Rode `npm install` na raiz.'); process.exit(1); }

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });
  const customer = client.Customer({
    customer_id: customerId,
    login_customer_id: loginId || undefined,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  const ini = dataISO(args.days);
  const fim = dataISO(0);
  const periodo = `segments.date BETWEEN '${ini}' AND '${fim}'`;
  console.error(`🔎 Conta ${customerId} | período ${ini} → ${fim}\n`);

  try {
    const termosConvertendo = await customer.query(`
      SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros,
             metrics.conversions, metrics.conversions_value
      FROM search_term_view
      WHERE ${periodo} AND metrics.conversions > 0
      ORDER BY metrics.conversions DESC LIMIT 100`);

    const keywords = await customer.query(`
      SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
             campaign.name, ad_group.name, metrics.clicks, metrics.cost_micros,
             metrics.conversions, metrics.average_cpc
      FROM keyword_view
      WHERE ${periodo} AND ad_group_criterion.status = 'ENABLED'
      ORDER BY metrics.conversions DESC LIMIT 200`);

    const gastoSemConv = await customer.query(`
      SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM search_term_view
      WHERE ${periodo} AND metrics.conversions = 0 AND metrics.cost_micros > 0
      ORDER BY metrics.cost_micros DESC LIMIT 50`);

    const out = {
      conta: customerId,
      periodo: { inicio: ini, fim },
      termos_que_converteram: termosConvertendo.map((r) => ({
        termo: r.search_term_view?.search_term,
        cliques: r.metrics?.clicks,
        custo_brl: +brl(r.metrics?.cost_micros).toFixed(2),
        conversoes: r.metrics?.conversions,
        valor_conv: r.metrics?.conversions_value,
      })),
      keywords_performance: keywords.map((r) => ({
        keyword: r.ad_group_criterion?.keyword?.text,
        match: r.ad_group_criterion?.keyword?.match_type,
        campanha: r.campaign?.name,
        grupo: r.ad_group?.name,
        cliques: r.metrics?.clicks,
        custo_brl: +brl(r.metrics?.cost_micros).toFixed(2),
        conversoes: r.metrics?.conversions,
        cpc_medio_brl: +brl(r.metrics?.average_cpc).toFixed(2),
      })),
      gasto_sem_conversao: gastoSemConv.map((r) => ({
        termo: r.search_term_view?.search_term,
        cliques: r.metrics?.clicks,
        custo_brl: +brl(r.metrics?.cost_micros).toFixed(2),
      })),
    };

    console.error(`✅ ${out.termos_que_converteram.length} termos convertendo | ${out.keywords_performance.length} keywords | ${out.gasto_sem_conversao.length} termos gastando sem converter\n`);
    // JSON no stdout (para a skill consumir); resumo/erros no stderr.
    console.log(JSON.stringify(out, null, 2));
  } catch (e) {
    console.error(`❌ Falha ao consultar a conta ${customerId}: ${e.message || e}`);
    if (Array.isArray(e.errors)) e.errors.forEach((er) => console.error(`   - ${er.message}`));
    console.error('   Verifique se a conta está vinculada ao MCC e acessível via API (teste: node scripts/test-google-ads.js).');
    process.exit(1);
  }
})();
