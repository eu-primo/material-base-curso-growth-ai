# Skills do curso — Growth Marketing com IA

Skills do **Claude Code** usadas nas aulas. Cada skill é uma **pasta** (com um
arquivo `SKILL.md` dentro). Para usar, você instala a pasta no seu Claude Code.

## Skills disponíveis

| Skill | O que faz | Depende de |
|---|---|---|
| [`criativos-meta-ia/`](criativos-meta-ia/) | Gera a copy do anúncio + um prompt pronto pro GPT Image 2, a partir de um briefing e/ou criativo de referência. | Só o Claude Code |
| [`gerar-imagem-codex/`](gerar-imagem-codex/) | Gera a imagem direto no terminal pelo Codex CLI (sem ir no ChatGPT do navegador). | Claude Code + **Codex CLI** logado |
| [`google-ads-planner/`](google-ads-planner/) | Planeja uma campanha de Rede de Pesquisa: pesquisa de palavras-chave (DataForSEO / Planejador / IA / histórico da conta), grupos por tema e anúncios RSA com message match → documento Markdown pronto. | Claude Code (DataForSEO opcional) |
| [`google-ads-deploy/`](google-ads-deploy/) | Lê o documento do planner e sobe a campanha no Google Ads via API — sempre pausada, rede de pesquisa pura. | Claude Code + Node + **API do Google Ads** |

## Como instalar (o próprio Claude instala pra você)

1. **Baixe** a pasta da skill (veja a seção abaixo) e descompacte num lugar fácil
   de achar (ex.: a Área de Trabalho / Desktop).
2. Abra o **Claude Code** dentro dessa pasta.
3. **Cole esta mensagem pro Claude:**

   > Instala essa skill pra mim como skill global do Claude Code. Move a pasta da
   > skill (com tudo que está dentro) pra `~/.claude/skills/`. Cria a pasta se não
   > existir e me confirma quando terminar.

4. **Reinicie o Claude Code.** Pronto — digite `/` e a skill aparece na lista.

## Como baixar só uma pasta do GitHub

O GitHub não deixa baixar uma subpasta direto pelo botão "Download ZIP" (ele baixa o
repositório inteiro). Duas opções:

- **Baixar o repositório inteiro** (botão verde **Code → Download ZIP**) e pegar a
  pasta `skills/` lá dentro — é o material do curso completo, então vale a pena.
- Ou colar o link da pasta da skill em **[download-directory.github.io](https://download-directory.github.io/)**
  pra baixar só ela em ZIP.