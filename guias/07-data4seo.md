# Guia 07: Data4SEO (Dados de SEO e SERP)

Data4SEO (tambem conhecido como DataForSEO) e uma API que fornece dados de SEO, SERP (resultados de busca), keywords, backlinks e concorrencia organica. Ideal para complementar suas analises de trafego pago com inteligencia de busca organica.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Tier gratis para teste. Pagamento por uso (creditos) |
| O que faz | Dados de SERP, keywords, backlinks, concorrencia |
| Integracao | API REST — Claude Code chama direto |

## Casos de uso para marketing

- **Posicao de keywords:** em que posicao seu site aparece para termos-chave
- **Analise de concorrencia organica:** quais keywords seus concorrentes rankeiam
- **Volume de busca:** quantas buscas mensais um termo recebe
- **SERP features:** quem aparece nos featured snippets, people also ask, etc
- **Backlinks:** quem linka para seu site vs concorrentes
- **Monitoramento:** acompanhar posicoes ao longo do tempo

## Passo a passo

### 1. Criar conta

1. Acesse: https://dataforseo.com
2. Crie uma conta (tem creditos gratis para teste)
3. Va em **Dashboard > API Access** e copie seu **Login** e **Password**

### 2. Salvar credenciais

Adicione ao seu `.env`:
```
DATAFORSEO_LOGIN="seu_login"
DATAFORSEO_PASSWORD="sua_senha"
```

A autenticacao e via HTTP Basic Auth (login:password em base64).

### 3. Usar no Claude Code

**Pesquisar volume de busca:**
```
Usa a API do DataForSEO para pesquisar o volume de busca mensal
das keywords: "revestimento ceramico", "porcelanato preco",
"piso vinilico" no Brasil. Mostra volume, CPC e competicao.
```

**Verificar posicao no Google:**
```
Usa a API do DataForSEO para verificar em que posicao o site
meusite.com.br aparece no Google para a keyword "revestimento ceramico"
na regiao de Sao Paulo.
```

**Analisar concorrente:**
```
Usa a API do DataForSEO para listar as top 20 keywords organicas
do site concorrente.com.br. Mostra posicao, volume e URL.
```

## APIs disponiveis

| API | O que retorna |
|-----|--------------|
| SERP API | Resultados de busca do Google em tempo real |
| Keywords Data | Volume, CPC, competicao por keyword |
| DataForSEO Labs | Keywords organicas de dominio, concorrentes |
| Backlinks | Perfil de backlinks de qualquer dominio |
| On-Page | Auditoria tecnica de SEO |

## Links

- DataForSEO: https://dataforseo.com
- API Docs: https://docs.dataforseo.com
- Pricing: https://dataforseo.com/pricing

## Checklist

- [ ] Conta criada no DataForSEO
- [ ] Login e Password copiados e salvos no .env
- [ ] Testou uma consulta de keywords via Claude Code
