# Guia 03: Google Ads API

Conectar a API do Google Ads permite que o Claude Code consulte campanhas, metricas de performance, keywords e muito mais usando GAQL (Google Ads Query Language) — uma linguagem de consulta parecida com SQL.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Gratis |
| Tempo de setup | ~30-45 minutos |
| Token expira? | Nao (refresh token permanente) |
| O que voce precisa | Acesso a uma conta Google Ads (MCC ou conta individual) |

## Conceitos importantes

- **MCC (My Client Center):** conta gerenciadora que da acesso a varias contas de anuncios. Se voce gerencia clientes, provavelmente ja tem uma.
- **Developer Token:** chave que autoriza chamadas a API. Obtida no Google Ads.
- **OAuth2:** mecanismo de autenticacao do Google. Voce gera um "refresh token" uma vez e ele nao expira. O Google Ads **exige** OAuth2 — nao aceita Service Account (diferente do Sheets e GA4). Veja mais em [Guia 09: Autenticacao](09-autenticacao-google.md).
- **GAQL:** linguagem de consulta propria do Google Ads (parecida com SQL). O Claude Code gera as queries para voce!
- **google-ads-api:** biblioteca Node.js dedicada para o Google Ads. Diferente dos outros servicos Google (Sheets, GA4, Drive) que usam a biblioteca `googleapis`, o Google Ads tem uma biblioteca propria por causa da sua complexidade (GAQL, estrutura de campanhas, mutacoes, etc). Ja esta instalada no projeto — voce nao precisa fazer nada.

## Passo a passo

### 1. Criar projeto no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto (ex: "Marketing API")
3. Va em **APIs & Services > Library**
4. Busque **"Google Ads API"** e clique **"Enable"**

### 2. Configurar tela de consentimento OAuth

1. Va em **Google Auth Platform > Branding**
2. Preencha: nome do app, email de suporte, email de contato
3. Va em **Google Auth Platform > Audience**
4. Selecione **"External"**
5. Adicione seu email como **Test User**

### 3. Criar credenciais OAuth2

1. Va em **Google Auth Platform > Clients**
2. Clique **"Create Client"**
3. Tipo: **"Web application"**
4. Nomeie (ex: "Marketing CLI")
5. Em **Authorized redirect URIs**, adicione: `http://localhost:8080`
6. Anote o **Client ID** e **Client Secret** gerados

### 4. Obter Developer Token

1. Acesse: https://ads.google.com
2. Va na sua conta MCC (conta gerenciadora)
3. **Tools & Settings > Setup > API Center**
4. Copie o **Developer Token**
5. O nivel sera "Explorer Access" (suficiente — 2.880 operacoes/dia, leitura e escrita)

### 5. Gerar Refresh Token

Esta e a parte mais tecnica, mas so precisa fazer uma vez:

**Passo 5a: Gerar URL de autorizacao**

**Opcao A: Usar o prompt pronto (recomendado)**

Copie e cole o prompt do arquivo [prompts/google-ads-auth.md](../prompts/google-ads-auth.md) no Claude Code. Ele faz tudo automaticamente: gera a URL, troca o code pelo refresh token e salva no `.env`.

**Opcao B: Fazer manualmente**

Monte a URL substituindo `SEU_CLIENT_ID`:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=SEU_CLIENT_ID&redirect_uri=http://localhost:8080&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
```

**Passo 5b: Autorizar**
1. Abra a URL no navegador
2. Faca login com a conta que tem acesso ao Google Ads
3. Se aparecer "App nao verificado", clique **Avancado > Acessar**
4. Autorize as permissoes
5. A pagina vai redirecionar para `http://localhost:8080?code=XXXXX` — a pagina vai dar erro (normal, nao tem servidor rodando)
6. Copie o valor do parametro `code=` da barra de endereco do navegador

> **IMPORTANTE:** O `code` que aparece na URL e o **authorization code** — ele NAO e o refresh token! Voce precisa troca-lo no proximo passo.

**Passo 5c: Trocar codigo por refresh token**

Voce pode pedir ao Claude Code para fazer isso! Com o .env parcialmente preenchido, diga:

```
Usa o codigo de autorizacao "COLE_O_CODIGO_AQUI" para trocar por um refresh token do Google Ads OAuth2. Usa as credenciais GOOGLE_ADS_CLIENT_ID e GOOGLE_ADS_CLIENT_SECRET do .env. A redirect_uri e http://localhost:8080. Salva o refresh_token no .env.
```

Ou faca manualmente via POST para `https://oauth2.googleapis.com/token` com:
- `code`: o codigo de autorizacao
- `client_id`: seu Client ID
- `client_secret`: seu Client Secret
- `redirect_uri`: `http://localhost:8080`
- `grant_type`: `authorization_code`

A resposta contera o `refresh_token`. Salve-o no `.env` — ele nao expira!

### 6. Encontrar o Customer ID

- Acesse https://ads.google.com
- O ID da conta aparece no topo (formato: XXX-XXX-XXXX)
- Para a API, use sem hifens (ex: `6963158446`)
- Se usa MCC, anote tambem o MCC ID (formato: XXX-XXX-XXXX)

### 7. Salvar no .env

```
GOOGLE_ADS_DEVELOPER_TOKEN="seu_developer_token"
GOOGLE_ADS_MCC_CUSTOMER_ID="XXX-XXX-XXXX"
GOOGLE_ADS_CLIENT_ID="seu_client_id.apps.googleusercontent.com"
GOOGLE_ADS_CLIENT_SECRET="GOCSPX-seu_client_secret"
GOOGLE_ADS_REFRESH_TOKEN="seu_refresh_token"
GOOGLE_ADS_CUSTOMER_ID="XXXXXXXXXX"
```

## O que e GAQL? (Google Ads Query Language)

Diferente do Meta (que usa parametros REST), o Google Ads usa uma linguagem propria de consulta. Parece SQL:

```sql
SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros
FROM campaign
WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'
ORDER BY metrics.cost_micros DESC
```

A boa noticia: **o Claude Code gera as queries GAQL para voce**. Basta pedir em linguagem natural:
- "Quais campanhas gastaram mais nos ultimos 7 dias?"
- "Me mostra os keywords com mais impressoes esse mes"

## Teste rapido no Claude Code

```
Le o .env e usa as credenciais do Google Ads para listar minhas campanhas ativas com spend dos ultimos 7 dias. Converte cost_micros para reais.
```

## Por que Google Ads tem biblioteca propria?

Os outros servicos Google (Sheets, GA4, Drive, Calendar, YouTube) usam todos a mesma biblioteca `googleapis`. Mas o Google Ads e diferente:

| Aspecto | googleapis (outros servicos) | google-ads-api (Google Ads) |
|---|---|---|
| Linguagem de query | REST simples | GAQL (linguagem propria) |
| Autenticacao | Service Account ou OAuth2 | **So OAuth2** |
| Estrutura | Recursos simples | Hierarquia complexa (MCC > conta > campanha > grupo > anuncio) |
| Operacoes | Leitura e escrita simples | Mutacoes com validacao, budgets, bidding strategies |

Por isso o Google criou uma biblioteca dedicada. Na pratica, voce nao precisa se preocupar com isso — o Claude Code sabe usar as duas. So precisa ter as credenciais no `.env`.

## O que da pra fazer com a Google Ads API?

**Leitura (reports):**
- Performance de campanhas, grupos de anuncios e keywords
- Metricas: impressoes, cliques, CTR, CPC, conversoes, custo, ROAS
- Segmentacao por dispositivo, hora, dia, localizacao
- Quality Score e Ad Rank de keywords
- Historico de alteracoes na conta

**Escrita (gestao):**
- Criar e pausar campanhas
- Ajustar orcamentos e lances
- Adicionar/remover keywords
- Criar e editar anuncios
- Gerenciar audiences e listas de remarketing
- Aplicar regras automatizadas

> **Nota sobre permissao:** Com "Explorer Access" (nivel inicial do Developer Token), voce tem leitura e escrita com limite de 2.880 operacoes/dia. Para a maioria dos gestores de trafego, e mais que suficiente.

## Notas importantes

- Valores monetarios em **MICROS**: 1.000.000 = R$ 1,00. Dividir por 1.000.000.
- CTR vem como decimal: 0.05 = 5%. Multiplicar por 100.
- `login-customer-id` no header e o MCC ID **sem hifens**
- O access token expira em 1h, mas o Claude renova automaticamente usando o refresh token
- Explorer Access: 2.880 operacoes/dia (mais que suficiente)
- **Versao da API muda!** Se der 404 ou 500, pode ser versao descontinuada

## Links oficiais

- Google Cloud Console: https://console.cloud.google.com
- Google Ads API Center: ads.google.com > Tools > API Center
- GAQL Reference: https://developers.google.com/google-ads/api/docs/query/overview
- Resource Metrics: https://developers.google.com/google-ads/api/fields/v23/metrics
- Release Notes: https://developers.google.com/google-ads/api/docs/release-notes

## Checklist de validacao

- [ ] Projeto criado no Google Cloud com Google Ads API habilitada
- [ ] OAuth2 configurado (Client ID + Client Secret)
- [ ] Developer Token obtido (Explorer Access)
- [ ] Refresh Token gerado (nao expira)
- [ ] Customer ID e MCC ID anotados
- [ ] .env preenchido com todas as 6 variaveis GOOGLE_ADS_*
- [ ] Teste no Claude Code funcionou (listou campanhas com spend)

Proximo passo: [GA4 API](04-ga4-api.md) ou [Windsor MCP](05-windsor-mcp.md)
