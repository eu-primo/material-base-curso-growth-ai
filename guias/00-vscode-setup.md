# Guia 00: Instalacao do VS Code

O VS Code (Visual Studio Code) e o ambiente onde voce vai trabalhar com o Claude Code. Nao se preocupe se voce nunca usou — ele e simples e intuitivo.

## Por que VS Code?

O Claude Code funciona como extensao dentro do VS Code. Isso permite que ele:
- Leia e edite arquivos do seu projeto
- Execute comandos no terminal
- Acesse suas credenciais de API (via .env)
- Gere reports, scripts e analises direto nos seus arquivos

## Passo a passo

### 1. Baixar e instalar

- Acesse: https://code.visualstudio.com
- Clique em "Download" (detecta seu sistema automaticamente)
- Instale normalmente (next, next, finish)

### 2. Primeiro contato com a interface

Ao abrir o VS Code, voce vera 3 areas principais:

```
+------------------+----------------------------------------+
|                  |                                        |
|   EXPLORER       |            EDITOR                      |
|   (arquivos)     |         (conteudo do arquivo)          |
|                  |                                        |
|   Aqui voce ve   |    Aqui voce ve e edita                |
|   as pastas e    |    o conteudo dos arquivos             |
|   arquivos do    |                                        |
|   projeto        |                                        |
|                  |                                        |
+------------------+----------------------------------------+
|                  TERMINAL                                 |
|   (linha de comando - nao precisa usar diretamente)       |
+-----------------------------------------------------------+
```

- **Explorer** (barra lateral esquerda): mostra as pastas e arquivos
- **Editor** (area central): onde voce ve o conteudo dos arquivos
- **Terminal** (parte inferior): linha de comando (o Claude Code usa isso por voce)

### 3. Abrir o projeto do workshop

- `File > Open Folder...`
- Navegue ate a pasta do workshop (onde voce clonou/baixou este repositorio)
- Selecione a pasta e clique "Open"

Pronto! Voce vera todos os arquivos do workshop no Explorer.

### 4. Extensoes uteis (opcional)

Extensoes sao plugins que adicionam funcionalidades ao VS Code. So 1 e obrigatoria:
- **Claude Code** (instale no proximo guia)

Opcionais que ajudam:
- **Portuguese (Brazil) Language Pack** — interface em portugues
- **Live Server** — para visualizar os reports HTML no navegador com 1 clique

Para instalar extensoes: clique no icone de quadrado na barra lateral esquerda (ou `Ctrl+Shift+X` / `Cmd+Shift+X` no Mac), busque o nome e clique "Install".

## Checklist de validacao

- [ ] VS Code aberto e funcionando
- [ ] Pasta do workshop aberta no Explorer (voce ve as pastas: guias, templates, prompts, exemplos)
- [ ] Consegue clicar num arquivo e ver seu conteudo no editor

Proximo passo: [01-claude-code-setup.md](01-claude-code-setup.md)
