# Formato de entrada (o que o script lê)

O script consome o **bloco JSON** do documento gerado pela skill `google-ads-planner`. O contrato canônico (esquema completo, comentado) está em [../../google-ads-planner/references/contrato-doc.md](../../google-ads-planner/references/contrato-doc.md). Este arquivo resume **como o script interpreta cada campo**.

## De onde vem o JSON

- `.md` → o script extrai o conteúdo entre `<!-- json-campanha:inicio -->` e `<!-- json-campanha:fim -->` (com fallback para o primeiro bloco ```` ```json ````).
- `.json` → lido direto.

## Mapeamento JSON → API

| Campo no JSON | Vira na API |
|---|---|
| `conta.customer_id` / `conta.login_customer_id` | conta operada / MCC (fallback no `.env`) |
| `campanha.orcamento_diario_brl` | `campaign_budget.amount_micros` (BRL × 1.000.000) |
| `campanha.estrategia_lance` | estratégia de lance (ver abaixo) |
| `campanha.cpa_alvo_brl` | `target_cpa_micros` (quando aplicável) |
| `campanha.rede` | `network_settings` — **parceiros e Display sempre `false`** |
| `campanha.localizacoes[].criteria_id` | `campaignCriterion.location` → `geoTargetConstants/<id>` |
| `campanha.idiomas[]` | `campaignCriterion.language` → `languageConstants/<id>` (pt=1014) |
| `campanha.negativas_campanha[]` | negativas de campanha (match BROAD) |
| `grupos[].keywords[]` `{texto, match}` | `adGroupCriterion.keyword` — `match` ∈ {PHRASE, EXACT} |
| `grupos[].negativas[]` | negativas do grupo (match BROAD) |
| `grupos[].anuncios[]` | `responsive_search_ad` (headlines, descriptions, path1/2) |
| `extensoes.callouts[]` | `CalloutAsset` + `CampaignAsset` (CALLOUT) |
| `extensoes.sitelinks[]` | `SitelinkAsset` + `CampaignAsset` (SITELINK) |

## Estratégias de lance aceitas

| `estrategia_lance` | Como é criada |
|---|---|
| `MAXIMIZE_CONVERSIONS` | Maximizar conversões (opcionalmente com `cpa_alvo_brl` como target CPA) |
| `TARGET_CPA` | Maximizar conversões com `target_cpa_micros` (forma atual do tCPA na API) |
| `MANUAL_CPC` | CPC manual; usa `grupos[].lance_padrao_brl` como `cpc_bid_micros` |
| `MAXIMIZE_CONVERSION_VALUE` | Maximizar valor de conversão |

## Forçados por segurança (independentemente do JSON)

- `status` → **PAUSED**
- `rede.search_partners` → **false**
- `rede.display` → **false**

## O que NÃO é subido por aqui

- **Business logo**, **imagens** e **vídeos** (ativos externos). Ficam listados em `ativos_externos_pendentes` e são adicionados depois — no painel ou via deploy quando houver os arquivos.
