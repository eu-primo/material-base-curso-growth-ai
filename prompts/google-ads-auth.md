# Prompt: Gerar URL de Autenticação do Google Ads

Copie e cole o prompt abaixo no Claude Code para gerar sua URL de autenticação OAuth2 do Google Ads.

## Pre-requisitos

Antes de usar este prompt, voce precisa ter preenchido no `.env`:

- `GOOGLE_ADS_CLIENT_ID` (OAuth2 Client ID)
- `GOOGLE_ADS_CLIENT_SECRET` (OAuth2 Client Secret)

Se ainda nao tem, siga o [Guia 03 - Google Ads API](../guias/03-google-ads-api.md) ate o passo 3.

---

## Prompt (copie e cole no Claude Code)

```
Le o .env e usa o GOOGLE_ADS_CLIENT_ID para gerar a URL de autenticacao OAuth2 do Google Ads.

A URL deve usar:
- redirect_uri: http://localhost:8080
- scope: https://www.googleapis.com/auth/adwords
- access_type: offline
- prompt: consent
- response_type: code

Depois me mostra a URL pronta para eu abrir no navegador.

Quando eu voltar com o code (que vem no parametro ?code= da URL de callback), troca automaticamente pelo refresh token usando curl com o CLIENT_ID e CLIENT_SECRET do .env, e salva o refresh_token no .env no campo GOOGLE_ADS_REFRESH_TOKEN.

IMPORTANTE: o code vem na barra de endereco do navegador depois de autorizar (a pagina vai dar erro porque nao tem servidor rodando, mas o code esta la na URL). Nao confundir o authorization code com o refresh token — sao coisas diferentes.
```

---

## O que vai acontecer

1. O Claude Code vai ler seu `.env` e montar a URL com seu Client ID
2. Voce abre a URL no navegador e autoriza o app
3. A pagina redireciona para `http://localhost:8080?code=XXXXX` (vai dar erro na pagina, e normal)
4. Voce copia o valor do `code=` da barra de endereco e cola no Claude Code
5. O Claude Code troca o code pelo refresh token e salva no `.env` automaticamente
