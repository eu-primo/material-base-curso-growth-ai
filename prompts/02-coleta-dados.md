# Prompts de Coleta de Dados

Prompts prontos para puxar dados das APIs. Substitua os periodos conforme necessario.

---

## Coleta Diaria (dados de ontem)

### Meta Ads
```
Le o .env e puxa os dados de ontem do Meta Ads:
- Metricas: spend, impressions, clicks, cpc, ctr, conversions, reach
- Agrupado por campanha
Mostra em formato de tabela ordenada por spend (maior primeiro).
```

### Google Ads
```
Le o .env e puxa os dados de ontem do Google Ads:
- Metricas: spend (cost_micros convertido para reais), impressions, clicks, ctr, cpc, conversions
- Campanhas ativas apenas
Mostra em formato de tabela ordenada por spend (maior primeiro).
```

### GA4
```
Le o .env e o service account do GA4. Puxa os dados de ontem:
- Metricas: sessions, totalUsers, newUsers, bounceRate, conversions
- Agrupado por sessionDefaultChannelGroup
Mostra em formato de tabela ordenada por sessoes (maior primeiro).
```

---

## Coleta Semanal (ultimos 7 dias)

```
Le o .env e coleta dados dos ULTIMOS 7 DIAS de todas as APIs configuradas:

1. Meta Ads: spend, clicks, impressions, conversions por campanha
2. Google Ads: spend, clicks, impressions, conversions por campanha
3. GA4: sessions e users por canal

Consolida tudo num resumo:
- Investimento total (Google + Meta)
- Sessoes totais
- Top 5 campanhas por spend
- Canal com mais sessoes
```

---

## Coleta Mensal (mes completo)

```
Le o .env e coleta dados do MES ANTERIOR COMPLETO de todas as APIs:

1. Meta Ads: spend, clicks, impressions, cpc, ctr, conversions por campanha
   Tambem puxa dados DIARIOS (spend por dia)
2. Google Ads: spend, clicks, impressions, cpc, ctr, conversions por campanha
   Tambem puxa dados DIARIOS (spend por dia)
3. GA4: sessions, users, newUsers, bounceRate, conversions
   Agrupado por canal E por dia

Salva os dados num arquivo JSON (dados-coleta-YYYY-MM.json) neste projeto.
```

---

## Coleta com Windsor MCP

```
Usa o Windsor MCP para puxar dados dos ultimos 30 dias:

1. Google Ads: spend, clicks, impressions, conversions agrupado por campanha
2. Meta Ads: spend, clicks, impressions, conversions agrupado por campanha

Mostra lado a lado para comparar os dois canais.
```
