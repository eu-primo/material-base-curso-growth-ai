# Casos de uso — o que perguntar e o que entregar

Os quatro casos saem do cruzamento de duas variáveis: **tem criativo de referência?** × **tem copy pronta?**. Todos convergem para a mesma saída (copy + prompt de imagem). O que muda é só o que precisa ser preparado antes.

|  | **Sem copy (gerar)** | **Com copy pronta** |
|---|---|---|
| **Sem referência** | Caso 1 | Caso 3 |
| **Com referência** | Caso 2 | Caso 4 |

Regra geral: **não interrogue o usuário em excesso.** Faça 2-3 perguntas no máximo, deduza o resto do que ele já mandou e assuma defaults (formato 4:5, 2-3 conceitos) avisando que assumiu.

---

## Caso 1 — Só briefing (sem referência, sem copy)

**Entrada típica:** "Tenho uma campanha para um cliente que vende roupas. Quero anúncios estáticos."

**Perguntar (se não souber):** nicho/produto, público-alvo, objetivo (venda, lead, tráfego), e algum diferencial/oferta. Formato: assuma 4:5 se não disserem.

**O que fazer:**
1. Definir **3-5 ângulos** distintos (ver [copywriting.md](copywriting.md) → Ângulos).
2. Para cada ângulo, escrever a copy (arte + campos) e **propor um layout do zero** (sem referência, você decide a estrutura visual).
3. Montar o prompt de imagem de cada um.

**Entregar:** **5-6 pares copy+prompt** — conceitos completos, prontos para jogar no GPT. Cada par é uma variação de ângulo, não só de palavra. Esse volume serve para o usuário testar criativos.

---

## Caso 2 — Adaptar referência (com referência, copy nova) ⭐ o do vídeo

**Entrada típica:** "Peguei esse criativo de um concorrente. Quero seguir esse modelo, mas com a minha foto e a minha copy."

**Perguntar (se não souber):** qual copy nova entra, se vai usar imagem própria (foto do produto/pessoa) ou gerar do zero, e o formato.

**O que fazer:**
1. **Extrair a anatomia** do criativo de referência — layout, hierarquia, posição de cada elemento, paleta, tipografia, estilo. Use o checklist de [anatomia-criativo.md](anatomia-criativo.md).
2. Manter a **estrutura/cores/clima** da referência e **trocar** a copy e (se for o caso) a imagem pela realidade do usuário.
3. Adaptar a copy fornecida para caber no layout; gerar também os campos do anúncio.
4. Montar o prompt descrevendo a anatomia + a copy nova.

**Entregar:** 1-3 conceitos que sigam o modelo da referência, com a copy do usuário. É o fluxo que mantém o padrão do swipe file adaptado ao contexto dele.

---

## Caso 3 — Tem copy, falta o visual (sem referência, com copy)

**Entrada típica:** "Já escrevi a copy do anúncio (ou o cliente mandou). Só preciso transformar em criativo."

**O que fazer:**
1. **Pular a geração de copy.** Use a copy fornecida como está (no máximo ajuste tamanho para a arte).
2. A partir da copy + nicho, **propor um layout do zero** que valorize a mensagem (ver hierarquia em [anatomia-criativo.md](anatomia-criativo.md)).
3. Montar o prompt de imagem.

**Entregar:** 2-3 conceitos visuais para a mesma copy (variando layout/estilo), para o usuário escolher.

---

## Caso 4 — Referência + copy prontas (com referência, com copy)

**Entrada típica:** "Esse é o modelo que quero seguir e essa é a copy exata. Só encaixa."

**O que fazer:**
1. **Pular a geração de copy.**
2. **Extrair a anatomia** da referência ([anatomia-criativo.md](anatomia-criativo.md)).
3. Encaixar a copy existente na estrutura da referência.
4. Montar o prompt.

**Entregar:** 1-2 conceitos — é o caso de menos trabalho, basicamente montar o prompt fiel à referência com a copy dada.

---

## Resumo dos dois "gates"

```
Tem referência?  →  Sim: extrair anatomia (anatomia-criativo.md)
                    Não: propor layout do zero a partir do contexto

Tem copy?        →  Sim: usar a copy fornecida
                    Não: gerar variações (copywriting.md)
```

Depois dos gates, o fluxo é sempre o mesmo: **montar o(s) prompt(s) para o GPT Image 2** ([prompts-gpt-image.md](prompts-gpt-image.md)). A entrega da skill termina no prompt pronto.
