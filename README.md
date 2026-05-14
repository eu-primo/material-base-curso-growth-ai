# Curso: Growth Marketing com IA — Material Base

Material base do curso. Aqui voce encontra todos os guias, prompts e scripts necessarios para automatizar reports, analises e dashboards de marketing usando Claude Code conectado nas APIs do Meta Ads, Google Ads, GA4, Google Sheets e Notion.

## O que voce vai conseguir fazer

- Gerar reports profissionais de performance em minutos (nao horas)
- Puxar dados de Meta Ads, Google Ads e GA4 direto no Claude Code
- Cruzar dados de diferentes fontes para encontrar oportunidades
- Personalizar reports com a cara da sua marca/cliente
- Exportar dados para Google Sheets e Notion automaticamente

## Pre-requisitos

1. Conta no [Claude](https://claude.ai) com plano Pro ou Team (necessario para Claude Code)
2. Acesso admin a pelo menos uma conta de ads (Meta, Google ou GA4)
3. Computador com acesso a internet

## Como comecar

### Passo 1: Instalar VS Code

Siga o guia: [guias/00-vscode-setup.md](guias/00-vscode-setup.md)

### Passo 2: Instalar Claude Code

Siga o guia: [guias/01-claude-code-setup.md](guias/01-claude-code-setup.md)

### Passo 3: Clonar este repositorio

```bash
git clone https://github.com/eu-primo/material-base-curso-growth-ai.git
cd material-base-curso-growth-ai
```

### Passo 4: Instalar dependencias

```bash
npm install
```

### Passo 5: Configurar credenciais

```bash
cp .env.example .env
```

Abra o `.env` e preencha com suas chaves de API seguindo os guias da pasta `guias/`.

> **Importante:** o arquivo `.env` contem suas credenciais pessoais e NUNCA deve ser compartilhado ou commitado no Git. Ele ja esta no `.gitignore`.

### Passo 6: Testar conexao

Abra o Claude Code neste projeto e use os prompts de teste:

[prompts/01-teste-conexao.md](prompts/01-teste-conexao.md)

Ou rode os scripts de teste:

```bash
npm run test:sheets       # Testa conexao com Google Sheets
npm run test:notion       # Testa conexao com Notion
npm run test:google-ads   # Testa conexao com Google Ads
```

## Estrutura do repositorio

```
guias/        Passo-a-passo para configurar cada ferramenta
prompts/      Prompts testados para copiar e colar no Claude Code
templates/    Templates HTML de report prontos para usar
exemplos/     Dados e reports de exemplo para referencia
scripts/      Scripts de teste de conexao com APIs
```

## Guias disponiveis

| # | Guia | Descricao |
|---|------|-----------|
| 00 | [VS Code Setup](guias/00-vscode-setup.md) | Instalacao e configuracao do VS Code |
| 00b | [Seguranca](guias/00b-seguranca-credenciais.md) | Boas praticas de seguranca com credenciais |
| 00c | [Como APIs funcionam](guias/00c-como-apis-funcionam.md) | Entenda o basico de APIs |
| 01 | [Claude Code Setup](guias/01-claude-code-setup.md) | Instalacao do Claude Code |
| 02 | [Meta Ads API](guias/02-meta-ads-api.md) | Configurar API do Meta Ads |
| 03 | [Google Ads API](guias/03-google-ads-api.md) | Configurar API do Google Ads |
| 04 | [GA4 API](guias/04-ga4-api.md) | Configurar API do Google Analytics 4 |
| 05 | [Windsor MCP](guias/05-windsor-mcp.md) | Configurar Windsor AI (agregador) |
| 06 | [Apify](guias/06-apify.md) | Configurar Apify (web scraping) |
| 07 | [Data4SEO](guias/07-data4seo.md) | Configurar Data4SEO |
| 08 | [Google Sheets](guias/08-google-sheets-api.md) | Configurar API do Google Sheets |
| 09 | [Autenticacao Google](guias/09-autenticacao-google.md) | OAuth e Service Account do Google |
| 10 | [Notion API](guias/10-notion-api.md) | Configurar API do Notion |

## Ferramentas cobertas

| Ferramenta | Tipo | Custo |
|------------|------|-------|
| **Meta Ads API** | API gratuita | Gratis |
| **Google Ads API** | API gratuita | Gratis |
| **GA4 Data API** | API gratuita | Gratis |
| **Google Sheets API** | API gratuita | Gratis |
| **Notion API** | API gratuita | Gratis |
| **Windsor AI** | Agregador + MCP | $23/mes (opcional) |
| **Apify** | Web scraping | Tier gratis disponivel |
| **Data4SEO** | Dados SEO/SERP | Tier gratis disponivel |

## Duvidas?

Consulte o guia de troubleshooting: [prompts/06-troubleshooting.md](prompts/06-troubleshooting.md)

Leia sobre seguranca de credenciais: [guias/00b-seguranca-credenciais.md](guias/00b-seguranca-credenciais.md)
