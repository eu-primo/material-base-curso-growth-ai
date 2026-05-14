# Prompts de Teste de Conexao

Use estes prompts no Claude Code para validar que suas APIs estao funcionando. Copie e cole diretamente.

---

## Meta Ads API

```
Le o arquivo .env deste projeto. Usa o META_ACCESS_TOKEN para fazer uma chamada
a API do Meta Marketing e listar minhas campanhas ativas com o spend dos ultimos
7 dias. Mostra: nome da campanha, status, spend, impressions e clicks.
```

**Resultado esperado:** Lista de campanhas com valores numericos. Se der erro 190, o token expirou — precisa renovar (ver guia 02).

---

## Google Ads API

```
Le o arquivo .env deste projeto. Usa as credenciais do Google Ads para:
1. Obter um access token usando o refresh token
2. Listar minhas campanhas ativas (status ENABLED) dos ultimos 7 dias
Mostra: nome da campanha, spend (convertido de micros para reais), clicks e impressions.
```

**Resultado esperado:** Lista de campanhas com spend em R$. Se der 404, a versao da API pode ter mudado.

---

## GA4 API

```
Le o arquivo .env e o arquivo de service account do GA4 (ga4-service-account.json).
Faz uma chamada a GA4 Data API para puxar as sessoes dos ultimos 7 dias,
agrupadas por canal (sessionDefaultChannelGroup).
Mostra: canal e numero de sessoes, ordenado do maior para o menor.
```

**Resultado esperado:** Lista de canais (Organic Search, Paid Search, Direct, etc) com quantidade de sessoes.

---

## Windsor MCP (se configurado)

```
Lista os conectores disponiveis no Windsor usando a ferramenta MCP.
```

**Resultado esperado:** Lista de conectores (Google Ads, Meta, etc) com seus account IDs.

---

## Teste Geral (todas as APIs de uma vez)

```
Le o .env e testa a conexao com todas as APIs configuradas:
1. Meta Ads: puxa spend de ontem
2. Google Ads: puxa spend de ontem
3. GA4: puxa sessoes de ontem

Me mostra um resumo simples:
- Meta Ads: OK/ERRO (valor ou mensagem de erro)
- Google Ads: OK/ERRO (valor ou mensagem de erro)
- GA4: OK/ERRO (valor ou mensagem de erro)
```
