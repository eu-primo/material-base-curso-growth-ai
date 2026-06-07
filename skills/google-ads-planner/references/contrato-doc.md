# Contrato do documento de saída

O documento gerado em `Google Ads Output/<cliente>-<aaaa-mm>.md` tem **duas camadas**:

1. **Legível** — para humano revisar e aprovar (resumo, tabelas, textos dos anúncios).
2. **Bloco JSON canônico** — a **fonte de verdade** que a skill `google-ads-deploy` lê para subir a campanha.

O JSON fica **entre marcadores** para o parser localizá-lo sem ambiguidade:

```
<!-- json-campanha:inicio -->
` ` `json
{ ... }
` ` `
<!-- json-campanha:fim -->
```

> Tudo que for subido na campanha precisa estar **dentro do JSON**. A parte legível é documentação; o deploy ignora ela e lê só o bloco entre os marcadores.

## Esquema do JSON

```jsonc
{
  "cliente": "Studio Planejados XYZ",
  "data": "2026-06",
  "conta": {
    "customer_id": "",          // conta do cliente, só dígitos, sem hífen. Vazio = usa GOOGLE_ADS_CUSTOMER_ID do .env
    "login_customer_id": ""     // MCC, só dígitos, sem hífen.       Vazio = usa GOOGLE_ADS_MCC_CUSTOMER_ID do .env
  },
  "campanha": {
    "nome": "Search | Planejados | SP Capital",
    "status": "PAUSED",                          // SEMPRE PAUSED ao criar (revisar antes de ativar)
    "orcamento_diario_brl": 50,                  // R$/dia (o deploy converte para micros)
    "estrategia_lance": "MAXIMIZE_CONVERSIONS",  // MAXIMIZE_CONVERSIONS | TARGET_CPA | MANUAL_CPC | MAXIMIZE_CONVERSION_VALUE
    "cpa_alvo_brl": null,                        // obrigatório só se TARGET_CPA
    "rede": { "google_search": true, "search_partners": false, "display": false },  // parceiros e Display OFF por padrão
    "localizacoes": [
      { "criteria_id": 1001773, "nome": "São Paulo, SP" }   // geo target constant (ver tabela abaixo)
    ],
    "idiomas": ["pt"],                           // "pt" = constante 1014
    "negativas_campanha": ["emprego", "salário", "reclame aqui", "grátis", "curso"]
  },
  "grupos": [
    {
      "nome": "Cozinha Planejada",
      "lance_padrao_brl": 3.00,                  // usado em MANUAL_CPC; ignorado nas estratégias automáticas
      "keywords": [
        { "texto": "cozinha planejada sob medida", "match": "PHRASE" },  // PHRASE | EXACT  (NUNCA BROAD)
        { "texto": "cozinha planejada preço", "match": "EXACT" }
      ],
      "negativas": ["closet", "guarda-roupa"],   // negativas do grupo (anti-canibalização)
      "anuncios": [
        {
          "final_url": "https://cliente.com.br/cozinhas",
          "path1": "cozinha",                    // ≤15
          "path2": "planejada",                  // ≤15
          "headlines": [                          // 3–15 itens, cada um ≤30
            "Cozinha Planejada SP", "Cozinha Sob Medida", "Projeto 3D Grátis", "..."
          ],
          "descriptions": [                       // 2–4 itens, cada um ≤90
            "Cozinha planejada sob medida com projeto 3D grátis. Peça seu orçamento.", "..."
          ]
        }
      ]
    }
  ],
  "extensoes": {
    "callouts": ["Projeto 3D Grátis", "Fábrica Própria", "Garantia de 5 Anos"],  // cada ≤25
    "sitelinks": [
      { "texto": "Cozinhas", "final_url": "https://cliente.com.br/cozinhas", "desc1": "Sob medida", "desc2": "Projeto 3D grátis" }
    ]
  },
  "ativos_externos_pendentes": ["business_logo", "imagens"]
}
```

## Valores aceitos

- **`match`**: `PHRASE` ou `EXACT`. Nunca `BROAD`.
- **`estrategia_lance`**: `MAXIMIZE_CONVERSIONS` (padrão para começar), `TARGET_CPA` (exige `cpa_alvo_brl`), `MANUAL_CPC` (usa `lance_padrao_brl`), `MAXIMIZE_CONVERSION_VALUE`.
- **`status`**: sempre `PAUSED` na criação.
- **`rede`**: `search_partners` e `display` **sempre `false`** (Rede de Pesquisa pura).

## Geo target constants (Brasil) — principais

A segmentação usa o ID numérico do "geo target constant" do Google. Alguns comuns:

| Local | criteria_id |
|---|---|
| Brasil (país) | 2076 |
| São Paulo (estado) | 20106 |
| Rio de Janeiro (estado) | 20102 |
| Minas Gerais (estado) | 20104 |
| Cidade de São Paulo | 1001773 |
| Cidade do Rio de Janeiro | 1001782 |

Para outras cidades/regiões, o deploy resolve pelo `nome` se o `criteria_id` não for informado, ou consulte a lista oficial: https://developers.google.com/google-ads/api/data/geotargets — sempre confira o ID, pois é o que de fato delimita onde o anúncio aparece.

## Regra de ouro

Antes de fechar o JSON, **valide os limites de caracteres** ([limites-e-ativos.md](limites-e-ativos.md)) e garanta que cada grupo tem keywords, ao menos 1 anúncio com ≥3 headlines e ≥2 descriptions, e `final_url` válida. O documento legível e o JSON devem bater — o JSON é o que sobe.
