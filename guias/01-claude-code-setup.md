# Guia 01: Instalacao do Claude Code

Claude Code e uma extensao do VS Code que permite voce conversar com o Claude diretamente no seu ambiente de trabalho. Diferente do ChatGPT ou Claude Web, aqui o Claude tem acesso aos seus arquivos, pode executar comandos, ler suas credenciais e gerar outputs diretamente no projeto.

## Pre-requisitos

- VS Code instalado (guia anterior)
- Conta no Claude com plano **Pro** ($20/mes) ou **Team** — necessario para usar Claude Code

## Passo a passo

### 1. Instalar a extensao

- Abra o VS Code
- Clique no icone de extensoes na barra lateral (ou `Cmd+Shift+X` no Mac / `Ctrl+Shift+X` no Windows)
- Busque: **"Claude Code"**
- Clique "Install" na extensao oficial da Anthropic
- Apos instalar, um icone do Claude aparece na barra lateral

### 2. Fazer login

- Clique no icone do Claude na barra lateral
- Clique "Sign in" e autorize com sua conta Anthropic
- O Claude Code vai abrir no painel inferior do VS Code

### 3. Primeira conversa (teste)

Com a pasta do workshop aberta, digite no Claude Code:

```
Ola! Voce consegue ver os arquivos deste projeto? Liste as pastas que existem aqui.
```

O Claude deve responder listando: guias, templates, prompts, exemplos. Se listou, esta funcionando!

### 4. Como funciona na pratica

Voce conversa com o Claude em linguagem natural. Exemplos:

- "Le o arquivo .env.example e me explica cada variavel"
- "Cria um arquivo teste.txt com o texto 'funcionou!'"
- "Executa o comando `echo Hello` no terminal"

O Claude pede permissao antes de executar acoes (criar arquivos, rodar comandos). Voce aprova ou nega.

### 5. Conceito-chave: contexto de projeto

A grande diferenca do Claude Code vs ChatGPT/Claude Web:

| | Claude Code | ChatGPT / Claude Web |
|---|---|---|
| Acesso a arquivos | Sim, le e edita | Nao |
| Executa comandos | Sim (com permissao) | Nao |
| Contexto do projeto | Sabe o que tem nas pastas | Nao sabe nada |
| Persiste entre msgs | Mantem contexto do projeto | Perde ao fechar |

## Checklist de validacao

- [ ] Extensao Claude Code instalada no VS Code
- [ ] Login feito com conta Anthropic
- [ ] Primeira conversa funcionou (Claude listou os arquivos do projeto)

Proximo passo: Configure pelo menos 1 API:
- [Meta Ads API](02-meta-ads-api.md) (mais rapido de configurar)
- [Google Ads API](03-google-ads-api.md)
- [GA4 API](04-ga4-api.md) (configura 1 vez, nunca expira)
