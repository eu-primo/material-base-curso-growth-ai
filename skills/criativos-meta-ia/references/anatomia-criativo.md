# Anatomia do criativo de referência

Esta é a peça central da skill: como **olhar para um criativo de referência e decompô-lo** numa descrição estruturada que vira insumo direto do prompt de imagem.

## Por que descrever a anatomia (e não dizer "faça igual")

O GPT Image 2 **se inspira na referência, não copia pixel a pixel.** Se você só joga a imagem e diz "faça igual", o resultado é imprevisível. O que funciona é **traduzir a referência em instruções explícitas**: onde fica cada elemento, que hierarquia, que paleta, que estilo. Quanto melhor você descreve a anatomia, mais fiel e controlável é o output.

Vale tanto para o **Caso 2** (adaptar referência, copy nova) quanto para o **Caso 4** (referência + copy prontas).

## Checklist de leitura (extraia tudo isto da referência)

Ao receber a imagem de referência, descreva cada item:

### 1. Layout e grid
- A peça é dividida em quantas zonas? (ex.: topo com headline, centro com produto/pessoa, base com CTA)
- Onde o olho cai primeiro? Qual a leitura (de cima pra baixo, da esquerda pra direita)?
- Há molduras, faixas, blocos de cor, divisórias?

### 2. Hierarquia visual
- Qual elemento é o maior/mais forte? (headline? foto? número?)
- Qual a ordem de importância: 1º, 2º, 3º elemento?
- O que tem mais contraste/destaque?

### 3. Posição de cada elemento
- **Headline:** topo, centro, base? Alinhamento?
- **Imagem principal (produto/pessoa):** onde, ocupando quanto da peça?
- **CTA / botão / selo:** existe? onde?
- **Logo / marca:** canto? tamanho?
- **Elementos de apoio:** preço, selo de garantia, avaliação, setas, balões?

### 4. Paleta de cores
- Cor de fundo dominante
- Cor do texto principal
- Cor de destaque/CTA (a que "grita")
- Sensação geral (vibrante, sóbria, pastel, alto contraste)

### 5. Tipografia
- Estilo da fonte do headline (serifada, sem serifa, manuscrita, condensada, bold pesada)
- Há contraste entre fontes (headline vs. apoio)?
- Texto em caixa alta? Itálico? Sublinhado/grifado?

### 6. Estilo de imagem
- Foto real? 3D? ilustração? colagem? screenshot/nativo (estilo "print")?
- Iluminação (natural, estúdio, dramática)?
- Fundo (liso, cenário real, gradiente, texturizado)?

### 7. Clima / mood
- Que emoção a peça transmite? (confiança, urgência, aspiração, proximidade, sofisticação)
- É "polido/produzido" ou "nativo/orgânico" (parece post, não anúncio)?

## Modelo de saída da anatomia

Resuma o que extraiu neste formato (ele alimenta o prompt direto):

```markdown
### Anatomia da referência
- **Formato/proporção:** [ex.: vertical 4:5]
- **Layout:** [ex.: 3 zonas — headline no topo, produto no centro, CTA na base]
- **Hierarquia:** [1º headline, 2º produto, 3º selo de desconto]
- **Headline:** [posição, alinhamento, estilo de fonte]
- **Imagem principal:** [o quê, onde, proporção da peça]
- **CTA/selos:** [o que existe e onde]
- **Paleta:** [fundo / texto / destaque]
- **Tipografia:** [estilo headline + apoio]
- **Estilo de imagem:** [foto/3D/ilustração/nativo + iluminação + fundo]
- **Clima:** [emoção + polido vs. nativo]
```

## O que adaptar vs. o que manter

No Caso 2, o usuário quer **o mesmo padrão, com a realidade dele**. Por padrão:

- **Manter:** layout, hierarquia, paleta, tipografia, estilo, clima (o "esqueleto" que faz a peça funcionar).
- **Trocar:** a copy (pela nova) e a imagem principal (pela foto/produto dele).

Se o usuário pedir, dá para variar também a paleta ou o estilo — mas pergunte antes; o valor do swipe file está justamente em reaproveitar o que já comprovadamente funciona.

## Quando NÃO há referência (Casos 1 e 3)

Sem referência, **você propõe o layout**. Use a mesma estrutura do checklist, mas como decisão de design:
- Defina hierarquia a partir do ângulo (ex.: ângulo de prova social → número grande em destaque).
- Escolha paleta coerente com o nicho.
- Mantenha a regra: 1 mensagem principal, 1 elemento visual forte, 1 CTA claro.
