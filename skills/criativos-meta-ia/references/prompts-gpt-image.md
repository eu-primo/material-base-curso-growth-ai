# Prompts para o GPT Image 2

Aqui está a receita de prompt que transforma a anatomia + a copy num comando que o GPT Image 2 obedece. O prompt é sempre o **destino final** dos quatro casos.

## Receita (a ordem importa)

Monte o prompt nesta sequência de blocos:

1. **Papel + objetivo** — o que é a peça. *"Crie um criativo de anúncio estático para Meta Ads (Instagram/Facebook), formato vertical 4:5, para [nicho/produto]."*
2. **Estilo geral** — fotográfico/3D/ilustração/nativo + clima. *"Estilo [foto realista com iluminação natural / 3D / aparência nativa de post], clima [aspiracional/urgente/sóbrio]."*
3. **Layout (vindo da anatomia)** — descreva as zonas e a posição de cada elemento. *"Divida em 3 zonas: headline no topo, [produto/pessoa] ocupando o centro, faixa de CTA na base."*
4. **Texto a renderizar (copy da arte)** — escreva o texto EXATO entre aspas e onde ele entra. *"No topo, em fonte sem serifa bold caixa alta, o texto: «[HEADLINE]». Na base, o botão: «[CTA]»."*
5. **Paleta** — fundo, texto, destaque. *"Fundo [cor], texto [cor], cor de destaque [cor] no CTA."*
6. **Imagem principal** — descreva o que aparece. *"No centro, [foto do produto / pessoa sorrindo segurando X], boa iluminação, fundo [liso/cenário]."*
7. **Formato + restrições** — proporção e o que evitar. *"Proporção 4:5 (1080x1350). Sem marca d'água, sem texto extra além do indicado, texto legível e bem posicionado, alto contraste."*

## Template pronto para preencher

```
Crie um criativo de anúncio estático para Meta Ads (Instagram/Facebook),
formato vertical [4:5 | 9:16], para [nicho/produto].

ESTILO: [foto realista / 3D / ilustração / nativo "estilo post"], com iluminação
[natural/estúdio/dramática] e clima [aspiracional/urgente/confiável/próximo].

LAYOUT: [descrever as zonas e a posição de cada elemento, vindo da anatomia].

TEXTO NA ARTE (renderizar exatamente):
- Headline (topo, fonte [estilo], [caixa alta?]): «[HEADLINE]»
- Apoio (abaixo do headline, menor): «[SUBHEADLINE]»
- CTA (base, em botão [cor]): «[CTA]»

IMAGEM PRINCIPAL: [descrever o que aparece no centro, fundo, iluminação].

PALETA: fundo [cor], texto [cor], destaque [cor].

RESTRIÇÕES: proporção [1080x1350 | 1080x1920], texto legível e ortograficamente
correto em português, alto contraste, sem marca d'água, sem texto além do indicado.
```

## Dica crítica: texto dentro da imagem

Modelos de imagem erram texto com frequência. Para aumentar o acerto:
- Escreva o texto **entre aspas/«»** e diga "renderizar exatamente este texto".
- Mantenha o texto da arte **curto** (headline de poucas palavras). Quanto mais longo, mais erro.
- Peça explicitamente **"texto ortograficamente correto em português"**.
- Se o texto sair errado no output, não insista no prompt — o ajuste fino do texto é feito depois, na edição da imagem (fora da skill).

## Formato: 9:16 vs 4:5

- **4:5 (1080x1350)** — Feed do Instagram/Facebook. É o default da skill se o usuário não disser.
- **9:16 (1080x1920)** — Stories e Reels.
- No **ChatGPT**, o usuário consegue selecionar a proporção na própria interface — mesmo assim, **inclua o formato no prompt** por via das dúvidas (e obrigatoriamente se for gerar via **API**, onde não há seleção manual).
- Estratégia comum do fluxo: gerar em **9:16 (Story)** no GPT e depois **recortar para 4:5 (Feed)** na etapa de edição (fora da skill).

## Motores alternativos (quando o prompt muda)

A receita acima é otimizada para **GPT Image 2**. Outros motores que aparecem no fluxo e quando considerá-los:

- **Kie AI / Fal AI** — plataformas/APIs para rodar modelos de imagem em escala (útil para gerar muitas variações via API). O prompt segue a mesma lógica, mas o formato precisa ser explícito (não há seleção manual).
- **Nano Banana (Gemini)** — forte em renderização de texto dentro da imagem; bom quando o headline na arte é essencial.
- **Flux** — forte em fotorrealismo e em manter identidade consistente com múltiplas imagens de referência (bom para gerar 50+ variações com o mesmo produto/pessoa).
- **Ideogram** — melhor da categoria em renderizar texto/banners com texto.

Regra geral: a **estrutura do prompt não muda** (papel → estilo → layout → texto → paleta → imagem → restrições). O que muda é: (a) tornar o formato sempre explícito em API, e (b) escolher o motor conforme a necessidade (texto na arte → Nano Banana/Ideogram; consistência de identidade → Flux; escala via API → Kie/Fal).
