---
name: gerar-imagem-codex
description: >-
  Gera imagens localmente pelo terminal usando o Codex CLI (ferramenta nativa
  image_generation, via login do ChatGPT — sem API key) e salva o arquivo na pasta
  do projeto. Use quando o usuário pedir para gerar/criar uma imagem, criativo ou
  arte direto aqui no fluxo (sem ir ao ChatGPT no navegador), gerar a partir de um
  prompt, ou produzir um PNG localmente. Gatilhos: "gera a imagem", "cria a imagem",
  "gerar imagem aqui", "Codex", "image_generation", "salvar a imagem local".
---

# Gerar imagens com o Codex via Claude Code

Gera imagens **no terminal**, sem copiar prompt pro ChatGPT. O Codex usa a ferramenta nativa `image_generation` (servidor do plano ChatGPT — **não precisa de `OPENAI_API_KEY`**) e salva o PNG localmente.

## Pré-requisitos (checar 1x)

- Codex instalado: `codex --version` (binário em `/opt/homebrew/bin/codex`).
- Logado via ChatGPT: `codex login` se necessário (auth fica em `~/.codex/auth.json`, `auth_mode: chatgpt`).
- Feature ativa: `codex features list | grep image_generation` → deve estar `stable / true`.

## Pasta de saída padrão

Salve sempre em **`output-codex/`** na raiz do projeto (crie se não existir). É a pasta padrão para os outputs do Codex.

## Comando

```bash
codex exec --skip-git-repo-check --ephemeral \
  -C "<caminho absoluto da pasta output-codex>" \
  -s workspace-write \
  "PROMPT DA IMAGEM. Salve como <nome>.png no diretório atual, tamanho <LARGURAxALTURA>. Use sua ferramenta nativa image_generation."
```

- `-C <dir>`: diretório de trabalho onde o arquivo é salvo (use a pasta `output-codex`).
- `-s workspace-write`: deixa o Codex escrever o arquivo (a geração é server-side, não precisa de rede).
- `--ephemeral`: não persiste sessão.
- Por baixo, o Codex gera em `~/.codex/generated_images/<id>/ig_*.png` e **copia** pro diretório de trabalho com o nome pedido.

## Formatos (Meta Ads)

Diga o aspect ratio E um tamanho-alvo no prompt. Valores que funcionam bem:

| Formato | Aspect ratio | Tamanho a pedir |
|---|---|---|
| Feed | 4:5 | `1024x1280` |
| Story / Reels | 9:16 | `1024x1792` |
| Quadrado | 1:1 | `1024x1024` |

Se precisar de 1080px de largura (padrão Meta), peça o aspect ratio e faça upscale depois na edição.

## Texto dentro da imagem

O Codex renderiza texto bem, mas para acertar:
- Escreva o texto **entre aspas** e curto: *...com o texto "HIDRATE-SE" no topo*.
- Peça **"texto ortograficamente correto em português"**.
- Se sair errado, corrija na edição (não brigue com o prompt).

## Imagem de referência (opcional)

Para gerar a partir de um criativo de referência, anexe a imagem com `-i`:

```bash
codex exec --skip-git-repo-check -C "<output-codex>" -s workspace-write \
  -i "/caminho/referencia.png" \
  "Crie um criativo seguindo a estrutura/cores da imagem de referência anexa, mas com o texto 'MINHA COPY'. Salve como criativo.png, tamanho 1024x1280."
```

## Conexão com a skill de criativos

Esta skill é o **motor de geração**. Quando o prompt já estiver pronto (ex.: vindo da skill `criativos-meta-ia`), é só passá-lo no comando acima para gerar a imagem localmente em vez de levar pro ChatGPT.

## Dica de verificação

Confirme dimensão e tipo do arquivo gerado:

```bash
file output-codex/<nome>.png   # ex.: PNG image data, 1024 x 1280, 8-bit/color RGB
```
