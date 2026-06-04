---
name: criativos-meta-ia
description: >-
  Cria criativos estáticos para Meta Ads (Facebook/Instagram) com IA: gera a copy
  (texto da arte + campos do anúncio) e o prompt pronto para o GPT Image 2 a partir
  de um briefing e/ou de um criativo de referência. Use quando o usuário quiser criar
  anúncios, criativos, peças, artes ou estáticos para tráfego pago; pedir prompt de
  imagem para ChatGPT/GPT Image; adaptar um criativo de referência ou swipe file; ou
  gerar copy de anúncio. Gatilhos: "criativo", "anúncio", "ad", "ad creative", "Meta
  Ads", "Facebook Ads", "Instagram", "tráfego pago", "estático", "copy de anúncio",
  "prompt de imagem", "criativo de referência", "swipe file".
---

# Criativos para Meta Ads com IA

Esta skill transforma um briefing e/ou um criativo de referência em **conceitos de anúncio prontos para produzir**: a copy (o texto que vai NA arte + os campos do anúncio no Meta) e o **prompt pronto para colar no GPT Image 2**.

## Filosofia

- **A etapa que importa é traduzir referência + copy num prompt que o GPT obedece.** Gerar e editar a imagem qualquer um faz; o valor está em descrever bem o que pedir.
- **O GPT Image 2 se inspira, não copia pixel.** Quando há referência, descreva a *anatomia* dela (layout, hierarquia, paleta, estilo), não diga "faça igual".
- **Criativo nativo > criativo polido.** Para tráfego frio, o que parece conteúdo orgânico costuma converter mais que o que parece anúncio.
- **Volume e variação.** O primeiro output raramente é o melhor; gere variações por ângulo.

## Passo 0 — Detecção (sempre comece aqui)

Antes de produzir qualquer coisa, descubra em qual caso o usuário está. Faça (ou deduza do que ele já mandou) **2 perguntas-gate**:

1. **Tem um criativo de referência?** (uma imagem/print de anúncio que ele quer seguir como modelo)
2. **Já tem a copy** ou quer que a skill **gere** as variações?

Isso define o caso de uso:

|  | **Sem copy (gerar)** | **Com copy pronta** |
|---|---|---|
| **Sem referência** | **Caso 1** — só briefing | **Caso 3** — falta o visual |
| **Com referência** | **Caso 2** — adaptar modelo | **Caso 4** — referência + copy prontas |

Os quatro casos **convergem** para a mesma saída final. O detalhe do que perguntar e do que entregar em cada um está em [references/casos-de-uso.md](references/casos-de-uso.md). Leia esse arquivo assim que identificar o caso.

Pergunte também (se ainda não souber): **nicho/produto**, **público**, **objetivo do anúncio** e **formato de saída** (9:16 Story ou 4:5 Feed — padrão 4:5 se não disserem).

## Pipeline (os 4 casos convergem aqui)

### 1. Preparar a copy
- **Sem copy:** gere variações usando os frameworks de [references/copywriting.md](references/copywriting.md) — defina 3-5 **ângulos** primeiro, depois escreva. No Caso 1, entregue **5-6 pares copy+prompt**.
- **Com copy pronta:** use a copy fornecida; no máximo ajuste para caber nos limites de caractere e no espaço da arte.
- A copy tem **duas camadas**: o **texto da arte** (headline/frase que aparece na imagem) e os **campos do anúncio** (primary text, headline, description). Gere as duas. Detalhes e fórmulas em [references/copywriting.md](references/copywriting.md).

### 2. Extrair a anatomia da referência (só se houver — Casos 2 e 4)
- Decomponha o criativo de referência em estrutura reutilizável (layout, hierarquia, posição de cada elemento, paleta, tipografia, estilo). Use o checklist de [references/anatomia-criativo.md](references/anatomia-criativo.md).
- Sem referência (Casos 1 e 3): proponha um layout do zero a partir do nicho e do ângulo.

### 3. Montar o(s) prompt(s) para o GPT Image 2
- Monte o prompt seguindo a receita de [references/prompts-gpt-image.md](references/prompts-gpt-image.md): papel + estilo + layout + copy a renderizar + paleta + formato + restrições.
- Inclua o **formato** (9:16 ou 4:5) no prompt por via das dúvidas, mesmo que o usuário vá selecionar no ChatGPT.
- A entrega da skill termina aqui, no prompt pronto. O acabamento do 1º output (edição fina, ajuste de texto, reformatação) é feito fora da skill.

## Saída padronizada

Para cada conceito de anúncio, entregue neste formato:

```markdown
## Conceito [N]: [nome curto do ângulo]

**Ângulo:** [dor / resultado / prova social / curiosidade / ...]
**Formato:** [9:16 Story | 4:5 Feed]

### Copy da arte (texto na imagem)
- Headline principal: "..."
- Apoio / subheadline: "..."
- CTA na arte (se houver): "..."

### Campos do anúncio (Meta)
- Primary text: "..."   (hook nos primeiros 125 caracteres)
- Headline: "..."        (~40 caracteres)
- Description: "..."      (~30 caracteres)

### Prompt para o GPT Image 2
```
[prompt completo, pronto para colar]
```
```

No Caso 1, repita esse bloco 5-6 vezes (um par copy+prompt por ângulo). Nos demais casos, gere quantos conceitos fizerem sentido (padrão: 2-3).

## Lembrete de instalação

Esta skill funciona como **project skill** quando o Claude roda a partir desta pasta. Para usá-la em qualquer projeto, copie a pasta `criativos-meta-ia/` para `~/.claude/skills/`.
