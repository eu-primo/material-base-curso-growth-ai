---
name: google-ads-planner
description: >-
  Planeja e estrutura uma campanha de Rede de Pesquisa do Google Ads de ponta a ponta:
  entende o negócio, faz a pesquisa de palavras-chave (via DataForSEO, via Planejador do
  Google Ads, ou de forma autônoma), agrupa em grupos de anúncios temáticos com
  correspondência frase/exata e gera os anúncios RSA com message match — entregando um
  documento Markdown pronto para subir com a skill google-ads-deploy. Use quando o usuário
  quiser criar, planejar ou estruturar uma campanha de Google Ads (rede de pesquisa),
  pesquisar ou selecionar palavras-chave, montar grupos de anúncios, ou escrever
  headlines/descriptions/callouts/sitelinks. Gatilhos: "google ads", "campanha de pesquisa",
  "rede de pesquisa", "palavras-chave", "keywords", "grupo de anúncios", "ad group",
  "anúncio de texto", "RSA", "headlines", "planejar campanha", "estruturar campanha",
  "pesquisa de palavras-chave".
---

# Google Ads Planner — planejamento de campanha de pesquisa

Esta skill transforma o contexto de um cliente num **plano de campanha de Rede de Pesquisa pronto para executar**: pesquisa e seleção de palavras-chave, estrutura de grupos de anúncios e os anúncios RSA com seus textos. A entrega é um **documento Markdown** salvo no projeto (na raiz, por padrão), que a skill [google-ads-deploy](../google-ads-deploy/SKILL.md) sobe no Google Ads via API.

Esta skill **planeja**. Ela não sobe nada e não gasta verba — isso é a etapa seguinte.

## Filosofia (o método)

- **Fundo de funil primeiro.** A maioria dos clientes tem verba curta (R$ 10–20k/mês). Priorize termos de alta intenção de compra/contratação. Topo e meio de funil só quando sobra orçamento.
- **Correspondência frase ou exata, nunca ampla.** Ampla traz volume sujo e lead desqualificado. O critério de seleção é sempre **maximizar conversão**: mais leads qualificados, menor custo, melhor qualidade.
- **Agrupe por tema.** Cada grupo de anúncios gira em torno de UM tema coeso (ex.: um ambiente, uma linha de produto) + normalmente um grupo institucional/marca.
- **Message match.** As palavras-chave do grupo entram nas headlines e descriptions daquele grupo. É o que puxa CTR e Índice de Qualidade pra cima e o CPC pra baixo.
- **Rede de Pesquisa pura.** Sem parceiros de pesquisa e sem Display por padrão (isso é garantido na etapa de deploy).

## Passo 0 — Detecção (sempre comece aqui)

Antes de pesquisar qualquer coisa, levante o contexto. Pergunte (ou deduza do que já foi enviado):

**Contexto do cliente/produto**
1. **URLs** do site, landing pages e páginas de produto.
2. **O que vende**, proposta de valor, diferenciais e ticket médio.

**Contexto da campanha**
3. **Região-alvo:** Brasil todo, estados, cidades ou raio? (define a segmentação geográfica)
4. **Verba mensal** disponível.
5. **Objetivo de conversão:** formulário, ligação, WhatsApp, compra?
6. Observações de estratégia (foco específico, sazonalidade, o que evitar).

**Escolha do caminho de pesquisa de palavras-chave** — passo a passo de cada um em [references/caminhos-pesquisa-keywords.md](references/caminhos-pesquisa-keywords.md):

| Caminho | Quando usar | Qualidade |
|---|---|---|
| **A — DataForSEO** (MCP ou REST) | DataForSEO conectado (MCP no `.mcp.json`) ou credenciais no `.env` | ⭐⭐ volume/CPC reais |
| **B — Semente + Planejador** | Sem DataForSEO, mas com acesso à conta do Google Ads | ⭐⭐ dados reais do Google |
| **C — Autônomo** | Sem nenhuma fonte de dados | ⭐ estimativa da IA (+ web) |
| **D — Histórico da conta** | O cliente **já roda** campanhas (ótimo p/ reestruturar) | ⭐⭐⭐ conversões reais da conta |

Para escolher: se o cliente **já roda campanhas**, o caminho **D** (histórico) costuma ser o melhor ponto de partida — são conversões reais. Se houver DataForSEO (MCP no `.mcp.json` ou credenciais no `.env`), use **A**. Sem isso, **B** (se tem acesso à conta) e **C** como último recurso. Pode combinar (ex.: D para descobrir o que converte + A para dimensionar volume). Registre no documento final qual caminho foi usado.

## Pipeline

### 1. Entender o negócio
Leia as URLs fornecidas. Monte um mini-perfil: o que o cliente vende, para quem, diferenciais, e a **lista de temas** que viram grupos de anúncios (ex.: para móveis planejados — cozinha, closet, home office, dormitório, casa completa + institucional/marca). Use o enquadramento de [references/estrategia-fundo-funil.md](references/estrategia-fundo-funil.md).

### 2. Pesquisar palavras-chave (pelo caminho escolhido)
Siga o passo a passo do caminho A, B, C ou D em [references/caminhos-pesquisa-keywords.md](references/caminhos-pesquisa-keywords.md). No caminho **D** (histórico da conta), use `scripts/puxar_historico.js --customer <ID>` para trazer os termos/keywords que já convertem. O resultado é um pool de termos com (quando disponível) volume, CPC, concorrência e/ou conversões reais.

### 3. Selecionar e agrupar
- Filtre para **fundo de funil**; descarte termos informacionais/curiosos.
- Agrupe os termos em **grupos temáticos** coesos.
- Defina a **correspondência** (frase/exata) por termo e a lista de **palavras-chave negativas**.

Critérios, sinais de intenção e exemplos em [references/estrategia-fundo-funil.md](references/estrategia-fundo-funil.md).

### 4. Gerar anúncios e extensões
Para CADA grupo, escreva:
- **2 RSAs por grupo** (padrão, para teste A/B; o Google permite até 3). Faça os dois com ângulos distintos — ex.: **RSA 1 factual/produto** (tipologia, números, diferenciais) e **RSA 2 lifestyle/CTA** (benefício emocional, "agende uma visita", "fale no WhatsApp") — sempre com **message match** (use as keywords do grupo). Cada RSA: até 15 headlines (≤30 caracteres) e até 4 descriptions (≤90 caracteres). Espaço conta como caractere.
- **Callouts** (frases de destaque, ≤25 caracteres), **sitelinks** e **structured snippets** (cabeçalho + valores ≤25; cabeçalhos pt-BR válidos: `Comodidades`, `Tipos`, `Bairros`, `Estilos`, `Marcas` etc.).

Limites, contagem de caracteres e o que a IA pode/não pode gerar em [references/limites-e-ativos.md](references/limites-e-ativos.md).

### 5. Montar o documento
Gere o doc seguindo o **contrato** de [references/contrato-doc.md](references/contrato-doc.md). **Pergunte ao usuário onde salvar**; por padrão, salve na **raiz do projeto** como `plano-google-ads-<cliente>-<aaaa-mm>.md`. Não dependa de nenhuma pasta específica existir — se o usuário preferir uma subpasta (ex.: `Google Ads Output/`), crie-a antes de salvar. O documento tem duas camadas:
- **Legível** — para humano revisar (resumo, tabelas de keywords, textos dos anúncios).
- **Bloco JSON** (`json-campanha`) — a fonte de verdade que a skill de deploy consome.

Termine o doc com a seção **"Ativos externos pendentes & otimização"**: lembre que **logo e imagens não saem da IA** (dependem de ativos externos) e devem ser adicionados depois — manualmente no painel ou via deploy quando o usuário tiver os arquivos — mais um lembrete de otimização contínua.

## Saída padronizada

Confirme ao usuário, ao final:
1. O **caminho de pesquisa** usado e a qualidade do dado (real/estimada).
2. Quantos **grupos de anúncios** e **keywords** entraram, e por quê.
3. O **caminho do arquivo** gerado (raiz do projeto, salvo destino diferente escolhido).
4. Os **ativos externos pendentes** (logo/imagens) e o próximo passo (rodar a skill `google-ads-deploy`).

Não invente volume/CPC quando o dado não existir — marque como estimativa e diga o que aumentaria a confiança (conectar DataForSEO ou exportar do Planejador).

## Lembrete de instalação

Funciona como **project skill** quando o Claude roda a partir desta pasta. Para usar em qualquer projeto, copie a pasta `google-ads-planner/` para `~/.claude/skills/`. A skill par, para executar a campanha, é `google-ads-deploy/`.
