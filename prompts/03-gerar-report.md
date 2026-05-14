# Prompts para Gerar Reports 2026

Prompts completos para gerar reports HTML profissionais usando os templates inclusos.

---

## Report Mensal Completo (template profissional)

```
Quero gerar um report mensal de performance. Faz o seguinte:

1. Le o .env e coleta dados do MES ANTERIOR de todas as APIs:
   - Meta Ads: spend, clicks, impressions, cpc, ctr por campanha + dados diarios
   - Google Ads: spend, clicks, impressions, cpc, ctr, conversions por campanha + dados diarios
   - GA4: sessions, users por canal + dados diarios

2. Le o template em templates/report-mensal.html

3. Gera uma COPIA do template com os dados reais preenchidos no const D.
   Salva como: report-YYYY-MM.html

4. Me avisa quando terminar para eu abrir no navegador.
```

---

## Report Simples (template minimalista)

```
Gera um report simples de performance do mes anterior:

1. Coleta dados basicos: spend total por canal (Meta + Google), sessoes totais (GA4)
2. Le o template em templates/report-simples.html
3. Preenche o const D com os dados reais
4. Salva como: report-simples-YYYY-MM.html
```

---

## Report Personalizado (sem template)

```
Gera um report HTML standalone de performance do mes anterior para o cliente [NOME].
Inclua:
- Header com nome do cliente e periodo
- 5 KPI cards: Investimento, Sessoes, Clicks, CPC medio, CTR medio
- Grafico de barras: investimento por canal
- Grafico de linha: evolucao diaria de sessoes
- Tabela de campanhas com spend, clicks, impressions
- Tema escuro profissional
- Responsivo (funciona no celular)

Salva como: report-[CLIENTE]-YYYY-MM.html
```

---

## Report Comparativo (2 meses)

```
Gera um report comparando os ultimos 2 meses:

1. Coleta dados de [MES_ATUAL] e [MES_ANTERIOR] das 3 APIs
2. Gera um HTML com:
   - KPIs de ambos os meses lado a lado com % de variacao
   - Grafico de barras comparando investimento por canal (2 meses)
   - Grafico de linha com sessoes diarias dos 2 meses sobrepostos
   - Tabela com top campanhas e variacao de spend/performance

Salva como: report-comparativo-YYYY-MM.html
```

---

## Report para Cliente (formatacao executiva)

```
Gera um report executivo para enviar ao cliente. Deve ser:
- Visual e limpo (poucos numeros, mais graficos)
- Highlights do que foi bem (verde) e pontos de atencao (amarelo)
- 3 insights/recomendacoes em linguagem de negocios (nao tecnica)
- Logo placeholder no header
- Tom profissional e confiante

Coleta dados do mes anterior e gera o HTML.
```
