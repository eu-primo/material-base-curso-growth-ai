# Guia 02: Meta Ads API (Facebook/Instagram Ads)

Conectar a API do Meta permite que o Claude Code puxe dados de campanhas do Facebook Ads e Instagram Ads diretamente: spend, impressions, clicks, conversions, CTR, CPC e muito mais.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Gratis |
| Tempo de setup | ~20-30 minutos |
| Token expira? | Sim, a cada ~60 dias (renovacao rapida) |
| O que voce precisa | Acesso admin a uma conta de anuncios |

## Passo a passo

### 1. Criar app no Facebook Developers

1. Acesse: https://developers.facebook.com
2. Faca login com sua conta do Facebook
3. Clique em **"My Apps"** (canto superior direito) > **"Create App"**
4. Selecione tipo: **"Business"** (ou "Other" dependendo da versao)
5. Preencha o nome do app (ex: "Minha API Marketing") e seu email
6. Clique "Create App"

### 2. Adicionar produto Marketing API

1. No painel do app, va em **"Add Product"**
2. Encontre **"Marketing API"** e clique "Set Up"
3. Pronto, o produto foi adicionado

### 3. Criar paginas de Terms of Service e Privacy Policy

O Meta exige que seu app tenha URLs de Terms of Service e Privacy Policy. Voce pode gerar essas paginas rapidamente:

**Opcao rapida:** Use o prompt incluso em [prompts/05-termos-uso-meta.md](../prompts/05-termos-uso-meta.md) para o Claude gerar essas paginas para voce. Depois hospede como pagina simples (GitHub Pages, Notion publica, Google Sites, etc).

**Configurar no app:**
1. Va em **Settings > Basic**
2. Cole as URLs nos campos "Privacy Policy URL" e "Terms of Service URL"
3. Salve

### 4. Gerar token de acesso

1. Va em **Tools > Graph API Explorer** (ou acesse: https://developers.facebook.com/tools/explorer)
2. No topo, selecione seu app (o que voce acabou de criar)
3. Selecione **"User Token"**
4. Clique em **"Add a Permission"** e adicione:
   - `ads_management`
   - `ads_read`
   - `read_insights`
5. Clique **"Generate Access Token"**
6. Autorize no popup que abrir

### 5. Estender o token (IMPORTANTE)

O token gerado dura apenas ~1 hora. Voce precisa estender para ~60 dias:

1. Copie o token gerado
2. Acesse o **Access Token Debugger**: https://developers.facebook.com/tools/debug/accesstoken
3. Cole o token e clique "Debug"
4. Na parte inferior, clique **"Extend Access Token"**
5. Um novo token sera gerado — este dura ~60 dias
6. Copie este token estendido

### 6. Encontrar o ID da conta de anuncios

1. Acesse o Business Manager: https://business.facebook.com
2. Va em **Business Settings > Accounts > Ad Accounts**
3. Selecione sua conta — o ID aparece no topo (ex: `292991555948433`)
4. Para uso na API, adicione o prefixo `act_`: `act_292991555948433`

### 7. Salvar no .env

Abra o arquivo `.env` e preencha:

```
META_ACCESS_TOKEN="seu_token_estendido_de_60_dias"
META_AD_ACCOUNT_ID="act_SEU_ID_AQUI"
META_APP_ID="id_do_seu_app"
META_APP_SECRET="secret_do_seu_app"
```

## Como renovar o token (a cada ~60 dias)

Quando o token expirar, basta repetir os passos 4 e 5:
1. Graph API Explorer > selecionar app > User Token > adicionar permissoes > Generate
2. Access Token Debugger > colar > Extend Access Token
3. Atualizar no .env

Dica: coloque um lembrete no calendario para ~55 dias.

## Teste rapido no Claude Code

Apos preencher o .env, abra o Claude Code e digite:

```
Le o .env e usa o token do Meta para listar minhas campanhas ativas com spend dos ultimos 7 dias.
```

Se funcionar, voce vera suas campanhas com valores de investimento!

## Notas importantes

- Valores monetarios nos insights vem como string (ex: "1383.87"), nao em centavos
- Budget de adsets vem em centavos (5000 = R$50,00)
- Rate limit: ~200 chamadas por hora por ad account
- O token com caracteres especiais funciona melhor via Python do que curl direto

## Links oficiais

- Graph API Explorer: https://developers.facebook.com/tools/explorer
- Access Token Debugger: https://developers.facebook.com/tools/debug/accesstoken
- Metricas de Insights: https://developers.facebook.com/docs/marketing-api/insights/parameters
- Breakdowns: https://developers.facebook.com/docs/marketing-api/insights/breakdowns
- Rate Limits: https://developers.facebook.com/docs/marketing-api/overview/rate-limiting

## Checklist de validacao

- [ ] App criado no Facebook Developers
- [ ] Marketing API adicionada como produto
- [ ] Terms of Service e Privacy Policy configurados
- [ ] Token estendido gerado (~60 dias)
- [ ] Ad Account ID copiado (com prefixo act_)
- [ ] .env preenchido com todas as 4 variaveis META_*
- [ ] Teste no Claude Code funcionou (listou campanhas)

Proximo passo: [Google Ads API](03-google-ads-api.md) ou [GA4 API](04-ga4-api.md)
