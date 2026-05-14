# Guia 04: GA4 Data API (Google Analytics 4)

Conectar a API do GA4 permite que o Claude Code puxe dados de sessoes, usuarios, canais de trafego, landing pages, dispositivos e muito mais. O grande diferencial: **configura uma vez e nunca mais precisa renovar**.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Gratis |
| Tempo de setup | ~15-20 minutos |
| Token expira? | **Nao!** Service Account = configura 1 vez, para sempre |
| O que voce precisa | Acesso admin ao GA4 da propriedade |

## Por que GA4 e diferente?

Enquanto Meta e Google Ads usam tokens de usuario (que podem expirar), o GA4 usa **Service Account** — uma "conta de servico" que gera tokens automaticamente via assinatura JWT. Zero manutencao.

## Passo a passo

### 1. Ativar a API no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Use o mesmo projeto do Google Ads (ou crie um novo)
3. Va em **APIs & Services > Library**
4. Busque **"Google Analytics Data API"** e clique **"Enable"**

### 2. Criar Service Account

1. Va em **IAM & Admin > Service Accounts**
2. Clique **"Create Service Account"**
3. Nome: `ga4-reader` (ou qualquer nome descritivo)
4. Clique "Create and Continue"
5. Role (permissao): pode pular (nao precisa de role no projeto, so no GA4)
6. Clique "Done"

### 3. Gerar chave JSON

1. Clique na service account que voce acabou de criar
2. Va na aba **"Keys"**
3. Clique **"Add Key" > "Create new key"**
4. Selecione **JSON** e clique "Create"
5. Um arquivo `.json` sera baixado — este e seu "certificado"
6. **Mova o arquivo para a raiz do projeto** e renomeie para `ga4-service-account.json`

> IMPORTANTE: Este arquivo contem sua chave privada. Ele ja esta no .gitignore para nao ser commitado acidentalmente.

### 4. Dar acesso no GA4

1. Acesse: https://analytics.google.com
2. Va em **Admin > Property > Property Access Management**
3. Clique **"+"** (adicionar usuario)
4. Cole o email da service account (ex: `ga4-reader@seu-projeto.iam.gserviceaccount.com`)
5. Role: **Viewer** (somente leitura — suficiente)
6. Clique "Add"

> Se der erro "organization's user policy": peca ao admin do Google Workspace para liberar o dominio `gserviceaccount.com` na politica de compartilhamento.

### 5. Anotar o Property ID

1. No Google Analytics, va em **Admin > Property Settings**
2. Anote o **Property ID** (numero, ex: `291663599`)

### 6. Salvar no .env

```
GA4_SERVICE_ACCOUNT_JSON="ga4-service-account.json"
GA4_PROPERTY_ID="SEU_PROPERTY_ID"
```

## Teste rapido no Claude Code

```
Le o .env e o arquivo de service account do GA4. Puxa as sessoes dos ultimos 7 dias por canal de trafego (sessionDefaultChannelGroup).
```

Se funcionar, voce vera algo como:
```
Organic Search: 1,234 sessoes
Paid Search: 567 sessoes
Direct: 890 sessoes
Social: 123 sessoes
```

## O que da pra puxar do GA4?

**Metricas (numeros):**
- sessions, totalUsers, newUsers
- screenPageViews, bounceRate, engagementRate
- conversions, ecommercePurchases, purchaseRevenue
- averageSessionDuration

**Dimensoes (agrupamentos):**
- date, sessionSource, sessionMedium
- sessionDefaultChannelGroup (Organic Search, Paid Search, Social, etc)
- deviceCategory (desktop, mobile, tablet)
- landingPage, pagePath, city, country

## Notas importantes

- Datas nas dimensoes vem como YYYYMMDD (ex: "20260311") — o Claude formata pra voce
- Metricas vem como string (ex: "1805") — o Claude converte
- bounceRate e engagementRate sao decimais (0.45 = 45%)
- Ate 9 dimensoes e 10 metricas por query
- Ate 4 periodos de comparacao simultaneos (ex: este mes vs mes anterior)
- Service Account **nao precisa de renovacao** — configure uma vez e esqueca

## Links oficiais

- Google Analytics: https://analytics.google.com
- Data API Overview: https://developers.google.com/analytics/devguides/reporting/data/v1
- Dimensoes e Metricas: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
- Quotas: https://developers.google.com/analytics/devguides/reporting/data/v1/quotas

## Checklist de validacao

- [ ] Google Analytics Data API habilitada no Google Cloud
- [ ] Service Account criada (ga4-reader)
- [ ] Arquivo JSON baixado e salvo como `ga4-service-account.json` na raiz
- [ ] Email da service account adicionado como Viewer no GA4
- [ ] Property ID anotado
- [ ] .env preenchido com GA4_SERVICE_ACCOUNT_JSON e GA4_PROPERTY_ID
- [ ] Teste no Claude Code funcionou (mostrou sessoes por canal)

Proximo passo: [Windsor MCP](05-windsor-mcp.md) (opcional) ou volte para o [README](../README.md)
