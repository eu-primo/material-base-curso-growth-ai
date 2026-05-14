# Prompt: Terms of Service e Privacy Policy para Meta App

Ao criar um app no Facebook Developers, voce precisa de URLs de Terms of Service e Privacy Policy. Copie e cole o prompt abaixo no Claude Code — ele vai te guiar pelo processo.

---

## Prompt (copie e cole no Claude Code)

```
Preciso gerar os textos de Terms of Service e Privacy Policy para configurar meu app no Facebook Developers (Meta Marketing API).

Antes de gerar, me pergunta:

1. Qual o nome do app ou da empresa?
2. Qual o email de contato?
3. Onde voce vai publicar? As opcoes sao:
   a) Notion — gero o texto em Markdown para voce colar numa pagina do Notion
   b) Pagina web (HTML) — gero dois arquivos HTML prontos (terms-of-service.html e privacy-policy.html)
   c) Pagina unica (HTML) — gero um unico arquivo HTML com as duas secoes juntas
   d) Só o texto — mostro o texto aqui no chat para voce copiar e colar onde quiser

Aguarda minhas respostas antes de gerar qualquer coisa.

Depois de eu responder, gera os textos com essas regras:
- Texto profissional e em ingles (requisito do Meta)
- Uso do app: acessar dados de campanhas Facebook/Instagram via Marketing API para relatorios de performance de marketing
- Uso interno / para clientes de gestao de trafego
- Incluir as clausulas padrao necessarias para aprovacao do Meta
- Incluir data de "last updated" com a data de hoje

Se eu escolher Notion, mostra o texto em Markdown no chat e me orienta a criar a pagina no Notion, publicar com "Share to web" e colar a URL no app do Meta (Settings > Basic).

Se eu escolher HTML, salva os arquivos no projeto e me orienta a hospedar (GitHub Pages, Google Sites, etc).
```
