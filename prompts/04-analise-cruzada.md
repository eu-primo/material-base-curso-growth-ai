# Prompts de Analise Cruzada

Prompts para analises profundas cruzando dados de diferentes fontes.

---

## Comparacao de Canais

```
Puxa dados dos ultimos 30 dias do Meta Ads e Google Ads.
Compara:
- CPC medio de cada canal
- CTR medio
- Custo por conversao
- Volume de impressoes vs clicks

Me diz: qual canal esta mais eficiente? Onde esta a melhor oportunidade
de realocar investimento? Justifica com os numeros.
```

---

## Analise de Eficiencia por Campanha

```
Puxa todas as campanhas ativas do Google Ads e Meta Ads dos ultimos 30 dias.
Para cada campanha, calcula:
- CPC, CTR, CPA (se tiver conversoes)
- Classificacao: Alta performance / Media / Baixa performance

Me mostra uma tabela ranqueada por eficiencia e identifica:
1. Top 3 campanhas para aumentar budget
2. Top 3 campanhas candidatas a pausar ou otimizar
3. Campanhas com CTR alto mas conversao baixa (oportunidade de LP)
```

---

## Correlacao Trafego x Investimento

```
Puxa dados DIARIOS dos ultimos 30 dias:
- GA4: sessoes por dia
- Google Ads: spend por dia
- Meta Ads: spend por dia

Analisa a correlacao entre investimento diario e sessoes.
- Em quais dias o investimento subiu mas as sessoes nao acompanharam?
- Em quais dias houve pico de sessoes com investimento normal (possivel viralidade ou organico)?
- Qual o "custo por sessao incremental" de cada canal?
```

---

## Analise de Landing Pages

```
Puxa do GA4 as top 20 landing pages dos ultimos 30 dias com:
- Sessions, bounceRate, averageSessionDuration, conversions

Identifica:
1. Paginas com mais trafego mas alta rejeicao (melhorar a pagina)
2. Paginas com alta conversao (investir mais trafego nelas)
3. Paginas com tempo alto de sessao (conteudo engajante)

Me da recomendacoes praticas para cada grupo.
```

---

## Benchmark de Performance

```
Analisa os dados dos ultimos 3 meses e me mostra:
- Tendencia de CPC (subindo ou caindo?)
- Tendencia de CTR (melhorando ou piorando?)
- Tendencia de sessoes organicas (crescendo?)
- Tendencia de conversoes (mais ou menos eficiente?)

Me da um "diagnostico de saude" da operacao de marketing e
3 recomendacoes priorizadas por impacto.
```

---

## Analise de Dispositivos

```
Puxa do GA4 as sessoes dos ultimos 30 dias por deviceCategory
(desktop, mobile, tablet) com:
- sessions, bounceRate, conversions, averageSessionDuration

Compara: o mobile converte tao bem quanto desktop?
Se nao, qual a diferenca em % e o que isso sugere sobre a experiencia mobile?
```

---

## Report de Oportunidades

```
Faz uma analise completa usando Meta Ads + Google Ads + GA4 dos ultimos 30 dias.
Identifica as TOP 5 oportunidades de crescimento, considerando:
- Campanhas com margem para escalar (bom CPA + baixo budget)
- Canais organicos crescendo (pode investir mais em conteudo)
- Keywords/campanhas com CTR alto e CPC baixo (goldmine)
- Landing pages com alta conversao recebendo pouco trafego

Para cada oportunidade, me da:
1. O que e (dados)
2. Por que e uma oportunidade (analise)
3. O que fazer (acao concreta)
```
