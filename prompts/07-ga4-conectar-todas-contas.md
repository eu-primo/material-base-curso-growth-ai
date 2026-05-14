# Prompt: Conectar Service Account em todas as contas GA4

Copie e cole o prompt abaixo no Claude Code. Ele vai habilitar a API Analytics Admin no seu projeto GCP, configurar OAuth, e adicionar sua Service Account em **todas as suas contas GA4 de uma vez** (contornando o bug da UI que rejeita o e-mail da SA). No fim, você sai com 3 scripts: adicionar acesso, listar propriedades e puxar dados.

Funciona em Windows, macOS e Linux — o Claude detecta o seu SO e adapta os comandos.

## Pré-requisitos

Você precisa ter concluído a aula anterior do GA4. A esta altura você já deve ter:

- Node.js instalado e um projeto Node iniciado (pasta com `package.json`)
- Uma Service Account criada no Google Cloud, com a key JSON salva como `google-services.json` na raiz do projeto
- A API **Analytics Data** já habilitada no projeto GCP
- Um `.env` com a variável `GOOGLE_SERVICE_ACCOUNT_JSON=google-services.json`

Se ainda não tem, volte na aula anterior do GA4 antes de seguir.

---

## Prompt (copie e cole no Claude Code)

```
Você vai me ajudar a conectar minha Service Account do GCP em todas as minhas contas GA4 de uma vez. Eu já tenho a SA criada (google-services.json na raiz do projeto), a API Analytics Data habilitada e o .env configurado. Falta habilitar a API Analytics Admin, configurar OAuth e rodar 3 scripts.

Siga as fases abaixo em ordem. Em cada fase, valide o resultado antes de avançar pra próxima. Se algo falhar, pare e me avise — não tente "consertar adivinhando".

## FASE 0 — Diagnóstico

1. Detecte meu sistema operacional (Windows / macOS / Linux). A partir daí, use sempre a sintaxe de shell correta nos comandos que rodar.

2. Confirme que estamos numa pasta de projeto Node válida:
   - existe package.json
   - existe google-services.json
   - existe .env contendo GOOGLE_SERVICE_ACCOUNT_JSON apontando pra google-services.json
   Se faltar qualquer um, pare e me diga exatamente o que falta.

3. Leia o google-services.json e extraia:
   - client_email
   - project_id
   Me mostre os dois valores e me pergunte: "É essa a Service Account e o projeto certos?". Espere minha confirmação antes de seguir.

4. Verifique se googleapis e dotenv estão instalados (procure em package.json e em node_modules). Se faltar algum, rode "npm install googleapis dotenv".

5. Reporte: "Diagnóstico OK, vamos pra Fase 1" — ou liste o que precisa ser corrigido antes.

## FASE 1 — Habilitar a Analytics Admin API

A API Analytics Data já está ligada (da aula anterior). Falta a Analytics Admin API, que é a que permite gerenciar usuários via código.

1. Monte a URL substituindo <PROJECT_ID> pelo project_id que você leu na Fase 0:
   https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=<PROJECT_ID>

2. Me passe essa URL e diga: "Abre essa URL, clica em ATIVAR, e me responde 'ativei' quando terminar."

3. Quando eu responder, faça um teste: use a SA pra chamar analyticsadmin.accountSummaries.list (v1alpha).
   - Se voltar 403 com "API not enabled" ou "SERVICE_DISABLED", a ativação ainda está propagando. Espere 30 segundos e tente de novo. Repita até 3 vezes.
   - Se voltar 200 (mesmo com lista vazia — é esperado, a SA ainda não tem acesso a nada), pode seguir pra Fase 2.
   - Qualquer outro erro: pare e me mostre.

## FASE 2 — Tela de consentimento OAuth

A UI do GA4 não aceita o e-mail da SA como usuário (esse é o bug). A solução é adicionar a SA via Admin API, mas pra isso o GCP exige OAuth com a MINHA conta Google (que é Administrator no GA4) — a SA não pode adicionar a si mesma.

1. Me passe a URL:
   https://console.cloud.google.com/auth/overview?project=<PROJECT_ID>

2. Me dite o passo a passo:
   - Em "Branding": nome do app "GA4 Access Manager", e-mail de suporte = meu e-mail
   - Em "Público-alvo": tipo Externo. Em "Usuários de teste", adicione o meu e-mail (o mesmo que administra meus GA4)
   - Em "Acesso a dados → Adicionar escopos", marque os 3:
     .../auth/userinfo.email
     .../auth/analytics.readonly
     .../auth/analytics.manage.users

3. Quando eu responder "configurei", siga pra Fase 3. Não tem como você validar isso via API — confie no que eu te disser.

## FASE 3 — Criar o OAuth Client ID

1. Me passe a URL:
   https://console.cloud.google.com/auth/clients?project=<PROJECT_ID>

2. Me dite:
   - Clique em "+ Criar cliente"
   - Tipo: "Aplicativo para computador"
   - Nome: "GA4 Local Script"
   - Criar → "Fazer download do JSON"
   - Salve o arquivo na raiz deste projeto com o nome exato: oauth-credentials.json

3. Quando eu responder "salvei", valide:
   - oauth-credentials.json existe na raiz
   - O JSON tem a estrutura { "installed": { "client_id": "...", "client_secret": "..." } }
   Se algo estiver fora, me explique e peça pra refazer.

4. Garanta que existe um .gitignore na raiz (crie se não existir) contendo no mínimo:
   node_modules/
   .env
   google-services.json
   oauth-credentials.json
   oauth-token.json

## FASE 4 — Criar e rodar o script que adiciona a SA em todas as contas

1. Crie o arquivo adicionar-ga4-em-todas.js com o conteúdo abaixo. IMPORTANTE: substitua a string EMAIL_DA_SA_AQUI pelo client_email exato que você leu na Fase 0 — não deixe placeholder.

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');

const SERVICE_ACCOUNT_EMAIL = 'EMAIL_DA_SA_AQUI';
const ROLE = 'predefinedRoles/viewer';

const TOKEN_PATH = path.join(__dirname, 'oauth-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'oauth-credentials.json');

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.manage.users',
];

function criarClient() {
  const { client_id, client_secret } = JSON.parse(fs.readFileSync(CREDENTIALS_PATH)).installed;
  return new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000');
}

function aguardarCodigo() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost:3000');
      const code = url.searchParams.get('code');
      const erro = url.searchParams.get('error');
      res.end('<h2>Pronto! Pode fechar esta aba.</h2>');
      server.close();
      if (erro) reject(new Error(erro));
      else resolve(code);
    });
    server.listen(3000);
  });
}

async function autorizar() {
  const oauth2 = criarClient();
  if (fs.existsSync(TOKEN_PATH)) {
    oauth2.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oauth2;
  }
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  console.log('\nAbra esta URL no navegador para autorizar:\n');
  console.log(authUrl);
  console.log('\nAguardando autorizacao...\n');
  const code = await aguardarCodigo();
  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Token salvo em oauth-token.json\n');
  return oauth2;
}

async function main() {
  const auth = await autorizar();
  const analyticsadmin = google.analyticsadmin({ version: 'v1alpha', auth });

  console.log('Buscando contas GA4 que voce administra...\n');
  const { data } = await analyticsadmin.accountSummaries.list();

  if (!data.accountSummaries || data.accountSummaries.length === 0) {
    console.log('Nenhuma conta encontrada.');
    return;
  }

  console.log(`Encontradas ${data.accountSummaries.length} conta(s).\n`);

  let sucessos = 0, jaTinham = 0, erros = 0;
  for (const conta of data.accountSummaries) {
    process.stdout.write(`-> ${conta.displayName} ... `);
    try {
      await analyticsadmin.accounts.accessBindings.create({
        parent: conta.account,
        requestBody: { user: SERVICE_ACCOUNT_EMAIL, roles: [ROLE] },
      });
      console.log('adicionado');
      sucessos++;
    } catch (err) {
      const msg = err.errors?.[0]?.message || err.message;
      if (msg.includes('already exists') || msg.includes('ALREADY_EXISTS')) {
        console.log('ja tinha acesso');
        jaTinham++;
      } else {
        console.log(`ERRO: ${msg}`);
        erros++;
      }
    }
  }

  console.log(`\nAdicionados: ${sucessos}  |  Ja tinham: ${jaTinham}  |  Erros: ${erros}`);
}

main().catch(err => console.error('Erro fatal:', err.message));
```

2. Rode o script: node adicionar-ga4-em-todas.js

3. Quando a URL OAuth aparecer no terminal, me passe a URL e diga:
   "Abre essa URL no navegador, faz login com a SUA conta Google que é Administrator nas contas GA4 (não use outra), e autoriza. Se aparecer 'Google nao verificou este app', clica em 'Avancado' -> 'Acessar GA4 Access Manager (nao seguro)' — é seguro, é o seu próprio app de teste. Quando aparecer a página 'Pronto! Pode fechar esta aba.', pode fechar e voltar pro terminal."

4. O script captura o callback em localhost:3000 automaticamente. Aguarde ele terminar e me mostre a contagem final (Adicionados / Ja tinham / Erros).

5. Se aparecer algum erro na lista, consulte a tabela de troubleshooting no fim deste prompt e me sugira a correção.

## FASE 5 — Listar todas as propriedades acessíveis

1. Crie listar-ga4.js com este conteúdo:

```javascript
require('dotenv').config();
const { google } = require('googleapis');

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const admin = google.analyticsadmin({ version: 'v1beta', auth });
  const { data } = await admin.accountSummaries.list();

  for (const conta of data.accountSummaries || []) {
    console.log(`\n${conta.displayName}`);
    for (const prop of conta.propertySummaries || []) {
      const id = prop.property.replace('properties/', '');
      console.log(`   - ${prop.displayName} | Property ID: ${id}`);
    }
  }
}

main().catch(err => console.error('Erro:', err.message));
```

2. Rode: node listar-ga4.js

3. Mostre a árvore de contas/propriedades pra mim. Me pergunte: "Aparecem todas as contas que você esperava?". Se faltar alguma, é porque a minha conta Google não é Administrator nela — me avise.

## FASE 6 — Puxar dados dos últimos 30 dias

1. Crie dados-ga4.js com este conteúdo:

```javascript
require('dotenv').config();
const { google } = require('googleapis');

const DIAS = 30;

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const admin = google.analyticsadmin({ version: 'v1alpha', auth });
  const data = google.analyticsdata({ version: 'v1beta', auth });

  console.log(`Dados dos ultimos ${DIAS} dias\n`);

  const { data: contas } = await admin.accountSummaries.list();
  const linhas = [];

  for (const conta of contas.accountSummaries || []) {
    for (const prop of conta.propertySummaries || []) {
      const propertyId = prop.property.replace('properties/', '');
      try {
        const { data: relatorio } = await data.properties.runReport({
          property: prop.property,
          requestBody: {
            dateRanges: [{ startDate: `${DIAS}daysAgo`, endDate: 'today' }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'conversions' },
            ],
          },
        });
        const row = relatorio.rows?.[0]?.metricValues || [];
        linhas.push({
          conta: conta.displayName,
          propertyId,
          usuarios: row[0]?.value || '0',
          sessoes: row[1]?.value || '0',
          views: row[2]?.value || '0',
          conversoes: row[3]?.value || '0',
        });
      } catch (err) {
        linhas.push({
          conta: conta.displayName,
          propertyId,
          erro: err.errors?.[0]?.message || err.message,
        });
      }
    }
  }

  console.table(linhas);
}

main().catch(err => console.error('Erro:', err.message));
```

2. Rode: node dados-ga4.js

3. Mostre a tabela final. Se alguma linha vier com erro na coluna "erro", me liste quais propriedades falharam e o motivo.

## FASE 7 — Encerramento

Me dê um resumo final em 3 linhas:
- Arquivos criados: adicionar-ga4-em-todas.js, listar-ga4.js, dados-ga4.js
- Contas que ganharam acesso à SA (número)
- Propriedades acessíveis agora (número)

E me lembre: "Sempre que ganhar acesso a uma conta GA4 nova no futuro, é só rodar 'node adicionar-ga4-em-todas.js' de novo — o script é idempotente, contas que já têm acesso aparecem como 'ja tinha acesso' e são puladas."

## Tabela de troubleshooting (consulte se aparecer erro)

- "Login Required" mesmo com oauth-token.json presente -> apague o oauth-token.json e rode o script de novo (token corrompido ou sem os escopos corretos).
- "Analytics Admin API has not been used in project X" -> a API não foi habilitada. Volte na Fase 1.
- "For at least one value of the 'roles' field, the value is invalid" -> o nome do papel é case-sensitive. Use exatamente predefinedRoles/viewer (não Viewer, não viewer puro).
- 403 PERMISSION_DENIED ao adicionar -> a conta Google logada no OAuth não é Administrator naquela conta GA4. Faça login com a conta correta (apague oauth-token.json pra forçar relogin).
- 403 com ACCESS_TOKEN_SCOPE_INSUFFICIENT -> faltou algum escopo na tela de consentimento (Fase 2). Reabra a tela, adicione os 3 escopos e apague oauth-token.json.
- 409 ALREADY_EXISTS -> a SA já estava cadastrada naquela conta. Tudo certo, ignore (o script já trata).
- "Request is missing required authentication credential" -> oauth-credentials.json não foi encontrado ou está com estrutura errada. Refaça a Fase 3.
- 400 reclamando do campo "user" -> erro de digitação no e-mail da SA. Confira o SERVICE_ACCOUNT_EMAIL no início do adicionar-ga4-em-todas.js — tem que ser idêntico ao client_email do google-services.json.
```

---

## O que vai acontecer

1. O Claude vai checar seu projeto, ler o `google-services.json` e te mostrar o e-mail da SA pra você confirmar.
2. Vai te passar uma URL pra habilitar a API Analytics Admin no GCP. Você habilita, ele testa.
3. Vai te guiar pela tela de consentimento OAuth e pela criação do OAuth Client ID. Você baixa o JSON e salva como `oauth-credentials.json` na raiz do projeto.
4. Vai criar e rodar o script que adiciona a SA em todas as suas contas GA4. Você só precisa abrir uma URL no navegador uma vez e autorizar com a sua conta Google que administra os GA4.
5. Vai criar e rodar mais dois scripts: um que lista todas as propriedades e outro que puxa os dados dos últimos 30 dias.
6. No fim, você sai com os 3 scripts prontos na pasta. Pra adicionar acesso a contas GA4 novas no futuro, é só rodar `node adicionar-ga4-em-todas.js` de novo.
