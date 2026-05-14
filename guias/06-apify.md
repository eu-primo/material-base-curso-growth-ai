# Guia 06: Apify (Web Scraping Inteligente)

Apify e uma plataforma de web scraping e automacao que permite extrair dados de praticamente qualquer site. Com o Claude Code, voce pode acionar scrapers (chamados "Actors") e analisar os resultados diretamente.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Tier gratis disponivel (limitado). Planos a partir de $49/mes |
| O que faz | Web scraping, extracao de dados, automacao |
| Integracao | API REST — Claude Code chama direto |

## Casos de uso para marketing

- **Monitorar concorrentes:** extrair precos, produtos, ofertas de sites concorrentes
- **Scraping de reviews:** coletar avaliacoes de produtos (Google Maps, Trustpilot, etc)
- **Dados de redes sociais:** extrair posts, seguidores, engajamento de perfis publicos
- **Leads de diretórios:** extrair contatos de listas publicas (Google Maps, Yellow Pages)
- **Monitoramento de SERP:** extrair resultados de busca do Google para keywords

## Passo a passo

### 1. Criar conta

1. Acesse: https://apify.com
2. Crie uma conta (tem tier gratis)
3. Va em **Settings > Integrations** e copie sua **API Token**

### 2. Salvar credenciais

Adicione ao seu `.env`:
```
APIFY_API_TOKEN="seu_token_aqui"
```

### 3. Explorar Actors (scrapers prontos)

O Apify tem uma "loja" de scrapers prontos chamados Actors:
- https://apify.com/store

Actors populares para marketing:
- **Google Maps Scraper** — extrair negocios, reviews, telefones
- **Google Search Results Scraper** — resultados de busca
- **Instagram Scraper** — posts e perfis publicos
- **Amazon Product Scraper** — precos e reviews
- **Website Content Crawler** — conteudo de qualquer site

### 4. Usar no Claude Code

```
Usa a API do Apify para rodar o Google Maps Scraper e extrair
os 20 primeiros resultados para "revestimentos ceramicos sao paulo".
Me mostra: nome, endereco, telefone, rating e numero de reviews.
```

O Claude vai chamar a API do Apify, aguardar o scraper rodar e retornar os dados formatados.

## Links

- Apify: https://apify.com
- Apify Store: https://apify.com/store
- API Reference: https://docs.apify.com/api/v2

## Checklist

- [ ] Conta criada no Apify
- [ ] API Token copiado e salvo no .env
- [ ] Testou rodar um Actor via Claude Code
