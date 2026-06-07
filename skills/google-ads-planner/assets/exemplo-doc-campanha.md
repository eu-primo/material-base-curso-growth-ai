# Plano de Campanha — Studio Planejados Exemplo (junho/2026)

> **Exemplo** de documento gerado pela skill `google-ads-planner`. Mostra as duas camadas: a parte legível (para revisão) e o bloco JSON canônico (que a `google-ads-deploy` consome). Dados fictícios.

- **Caminho de pesquisa:** C — Autônomo (estimativas da IA). *Para validar com dados reais, conectar DataForSEO ou exportar do Planejador.*
- **Região:** Cidade de São Paulo • **Verba:** R$ 50/dia • **Objetivo:** leads (formulário/WhatsApp)
- **Estratégia de lance:** Maximizar conversões

## Grupos de anúncios

### 1. Cozinha Planejada
Keywords (frase/exata): `"cozinha planejada"`, `"cozinha sob medida"`, `[cozinha planejada preço]`
Negativas do grupo: closet, guarda-roupa

### 2. Closet Planejado
Keywords (frase/exata): `"closet planejado"`, `[closet sob medida preço]`
Negativas do grupo: cozinha

## Ativos externos pendentes & otimização
- **Pendências:** business logo e imagens — adicionar no painel ou via deploy quando houver os arquivos.
- **Otimização:** após ativar, minerar termos de busca, ajustar lances e promover a EXATA os termos que converterem.

<!-- json-campanha:inicio -->
```json
{
  "cliente": "Studio Planejados Exemplo",
  "data": "2026-06",
  "conta": { "customer_id": "", "login_customer_id": "" },
  "campanha": {
    "nome": "Search | Planejados | SP Capital",
    "status": "PAUSED",
    "orcamento_diario_brl": 50,
    "estrategia_lance": "MAXIMIZE_CONVERSIONS",
    "cpa_alvo_brl": null,
    "rede": { "google_search": true, "search_partners": false, "display": false },
    "localizacoes": [ { "criteria_id": 1001773, "nome": "São Paulo, SP" } ],
    "idiomas": ["pt"],
    "negativas_campanha": ["grátis", "curso", "emprego", "salário", "reclame aqui", "diy"]
  },
  "grupos": [
    {
      "nome": "Cozinha Planejada",
      "lance_padrao_brl": 3.0,
      "keywords": [
        { "texto": "cozinha planejada", "match": "PHRASE" },
        { "texto": "cozinha sob medida", "match": "PHRASE" },
        { "texto": "cozinha planejada preço", "match": "EXACT" }
      ],
      "negativas": ["closet", "guarda-roupa"],
      "anuncios": [
        {
          "final_url": "https://studioplanejados.com.br/cozinhas",
          "path1": "cozinha",
          "path2": "planejada",
          "headlines": [
            "Cozinha Planejada em SP",
            "Cozinha Sob Medida",
            "Projeto 3D Grátis",
            "Cozinha Planejada Premium",
            "Fábrica Própria de Móveis",
            "Orçamento Rápido Online",
            "Garantia de 5 Anos",
            "Showroom em São Paulo",
            "Parcele em até 12x",
            "Fale com um Projetista"
          ],
          "descriptions": [
            "Cozinha planejada sob medida com projeto 3D grátis. Peça seu orçamento agora.",
            "Fábrica própria, garantia de 5 anos e showroom em SP. Fale com um projetista.",
            "Móveis planejados de alto padrão. Parcele em até 12x sem juros."
          ]
        }
      ]
    },
    {
      "nome": "Closet Planejado",
      "lance_padrao_brl": 3.0,
      "keywords": [
        { "texto": "closet planejado", "match": "PHRASE" },
        { "texto": "closet sob medida preço", "match": "EXACT" }
      ],
      "negativas": ["cozinha"],
      "anuncios": [
        {
          "final_url": "https://studioplanejados.com.br/closets",
          "path1": "closet",
          "path2": "planejado",
          "headlines": [
            "Closet Planejado Sob Medida",
            "Closet dos Sonhos",
            "Projeto 3D Grátis",
            "Closet Planejado em SP",
            "Fábrica Própria de Móveis",
            "Organize seu Quarto",
            "Garantia de 5 Anos",
            "Peça seu Orçamento"
          ],
          "descriptions": [
            "Closet planejado sob medida com projeto 3D grátis. Peça seu orçamento agora.",
            "Fábrica própria, garantia de 5 anos e showroom em SP. Fale com um projetista.",
            "Closet dos sonhos com acabamento premium. Parcele em até 12x sem juros."
          ]
        }
      ]
    }
  ],
  "extensoes": {
    "callouts": ["Projeto 3D Grátis", "Fábrica Própria", "Garantia de 5 Anos", "Showroom em São Paulo", "Parcele em até 12x"],
    "sitelinks": [
      { "texto": "Cozinhas Planejadas", "final_url": "https://studioplanejados.com.br/cozinhas", "desc1": "Sob medida", "desc2": "Projeto 3D grátis" },
      { "texto": "Closets", "final_url": "https://studioplanejados.com.br/closets", "desc1": "Organização total", "desc2": "Acabamento premium" },
      { "texto": "Home Office", "final_url": "https://studioplanejados.com.br/home-office", "desc1": "Para trabalhar bem", "desc2": "Sob medida" },
      { "texto": "Fale no WhatsApp", "final_url": "https://studioplanejados.com.br/whatsapp", "desc1": "Atendimento rápido", "desc2": "Orçamento na hora" }
    ]
  },
  "ativos_externos_pendentes": ["business_logo", "imagens"]
}
```
<!-- json-campanha:fim -->
