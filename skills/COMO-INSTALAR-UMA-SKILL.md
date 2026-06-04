# Como instalar uma skill no Claude Code

Este guia vale pra **qualquer skill** do curso. Toda skill é uma **pasta**
(com um arquivo `SKILL.md` dentro, e às vezes subpastas). Instalar = colocar
essa pasta no lugar certo pra o Claude enxergar.

## Passo a passo

1. **Baixe** o `.zip` da skill na área de membros.
2. **Descompacte** num lugar fácil de achar (ex.: a Área de Trabalho / Desktop).
   Vai aparecer uma pasta com o nome da skill.
3. Abra o **Claude Code** dentro dessa pasta descompactada.
4. **Cole esta mensagem pro Claude:**

   > Instala essa skill pra mim como skill global do Claude Code. Move a pasta
   > da skill (com tudo que está dentro dela) pra `~/.claude/skills/`. Cria a
   > pasta se não existir e me confirma quando terminar.

5. Quando o Claude terminar, **reinicie o Claude Code**.

Pronto. A partir daí a skill funciona em qualquer projeto no seu computador.

## Como saber se deu certo

No Claude Code, digite `/` e veja se o nome da skill aparece na lista.
Você pode chamá-la digitando `/nome-da-skill` ou só pedindo naturalmente
o que ela faz.

## Instalação manual (opcional, se preferir fazer na mão)

A skill mora aqui:

- **Mac / Linux:** `~/.claude/skills/`
- **Windows:** `C:\Users\SEU_USUARIO\.claude\skills\`

É só arrastar a pasta descompactada pra dentro dessa pasta `skills`
(crie ela se não existir) e reiniciar o Claude Code.

---

> **Atenção (só pra skill `gerar-imagem-codex`):** ela depende do **Codex CLI**
> instalado e logado com sua conta ChatGPT. Se não tiver, peça pro Claude:
> *"confere se o Codex está instalado rodando `codex --version` e me ajuda a instalar/logar se precisar"*.
