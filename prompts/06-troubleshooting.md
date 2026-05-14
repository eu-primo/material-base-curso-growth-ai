# Prompts de Troubleshooting

Prompts para diagnosticar e resolver erros comuns.

---

## Diagnostico geral

```
Estou tendo um erro ao tentar acessar a API do [Meta/Google/GA4].
Le o .env, verifica se as credenciais estao corretas (formato, prefixos, etc)
e tenta fazer uma chamada de teste. Me diz exatamente o que esta errado
e como corrigir.
```

---

## Erros comuns por API

### Meta Ads — Token expirado (Erro 190)

```
Meu token do Meta expirou (erro 190 OAuthException).
Me guia no processo de renovacao:
1. O que fazer no Graph API Explorer
2. Como estender o token
3. Como atualizar no .env
```

### Meta Ads — Permissoes insuficientes

```
Estou recebendo erro de permissao no Meta Ads (#10 / Permission denied).
Verifica no .env: o token tem as permissoes ads_read e read_insights?
Me mostra como verificar e, se necessario, gerar um novo token com
as permissoes corretas.
```

### Google Ads — Erro 404 ou 500

```
A chamada ao Google Ads esta retornando erro [404/500].
Possiveis causas:
- Versao da API descontinuada (v19 foi descontinuada em fev/2026)
- URL malformada
Verifica a versao sendo usada e me sugere a correcao.
```

### Google Ads — Refresh token invalido

```
Estou recebendo "invalid_grant" ao tentar usar o refresh token do Google Ads.
Le o .env e me ajuda a diagnosticar:
- O refresh token esta no formato correto?
- O client_id e client_secret batem?
Se preciso, me guia para gerar um novo refresh token.
```

### GA4 — Permission denied (403)

```
Estou recebendo 403 "permission denied" do GA4.
Possiveis causas:
1. O email do service account nao foi adicionado como Viewer no GA4
2. O Property ID esta errado
3. A API nao esta habilitada no Google Cloud

Verifica o .env e o arquivo de service account e me diz o que corrigir.
```

### GA4 — Arquivo service account nao encontrado

```
Erro ao ler o arquivo de service account do GA4.
Verifica:
1. O arquivo ga4-service-account.json existe na raiz do projeto?
2. O caminho no .env (GA4_SERVICE_ACCOUNT_JSON) esta correto?
3. O arquivo tem o formato correto (JSON com private_key, client_email, etc)?
```

---

## Diagnostico de formato de dados

```
Os dados que recebi da API parecem estranhos. Me ajuda a interpretar:
- Meta Ads: valores monetarios vem como string (ex: "1383.87") — e em reais
- Google Ads: valores em MICROS (1000000 = R$ 1,00) — precisa dividir por 1M
- GA4: datas vem como YYYYMMDD (ex: "20260115") — precisa formatar
- GA4: bounceRate e decimal (0.45 = 45%) — precisa multiplicar por 100

Formata os dados que eu te passei corretamente em pt-BR.
```

---

## Debug de chamada de API

```
Faz uma chamada de teste a API do [Meta/Google/GA4] e me mostra:
1. A URL/endpoint exato que foi chamado
2. Os headers enviados
3. O body da requisicao (se POST)
4. A resposta completa (status code + body)

Quero entender exatamente o que esta sendo enviado e recebido.
```
