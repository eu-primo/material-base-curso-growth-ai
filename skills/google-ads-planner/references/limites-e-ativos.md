# Limites de caracteres e ativos do anúncio

**O espaço conta como caractere.** Conte sempre e fique, de preferência, 1–2 caracteres abaixo do limite. Não estoure — o que passa do limite é rejeitado.

## Limites (Rede de Pesquisa)

| Ativo | Quantidade | Limite de caracteres |
|---|---|---|
| **Headline** | até 15 (mínimo recomendado: 8–10) | 30 |
| **Description** | até 4 (mínimo recomendado: 3) | 90 |
| **Path** (display path) | 2 campos (`path1`, `path2`) | 15 cada |
| **Callout** (frase de destaque) | mín. 2 (ideal 4–8) | 25 |
| **Sitelink — texto** | mín. 2 (ideal 4–6) | 25 |
| **Sitelink — descrição** | 2 linhas opcionais | 35 cada |
| **Structured snippet — valores** | 3–10 por cabeçalho | 25 cada |
| **Business name** | 1 | 25 |

## Boas práticas de RSA

- **Variedade > repetição.** As 15 headlines devem cobrir ângulos diferentes para o Google testar combinações: keyword do grupo (message match), benefício, diferencial, prova/garantia, oferta/CTA, localização.
- **Pelo menos 2–3 headlines com a keyword do grupo** (message match). As demais vendem benefício e diferencial.
- **Não repita** a mesma ideia em headlines diferentes — desperdiça o teste do algoritmo.
- **Fixação (pinning):** use com parcimônia. Fixar tudo mata a otimização. Se precisar garantir algo (ex.: marca na posição 1), fixe **apenas** essa.
- **CTA claro** em pelo menos 1 headline e 1 description ("Peça seu orçamento", "Fale no WhatsApp").
- **Descriptions** complementam, não repetem as headlines: aprofundam diferencial, prova e oferta, terminando em CTA.

## O que a IA gera vs. o que depende de ativo externo

**A skill GERA (texto):**
- ✅ Headlines e Descriptions (RSA)
- ✅ Callouts (frases de destaque)
- ✅ Sitelinks (texto + URL + descrições)
- ✅ Structured snippets (cabeçalho + valores)
- ✅ Display paths (`path1`/`path2`)

**A skill NÃO gera (ativo externo — adicionar depois):**
- ❌ **Business logo** — precisa do arquivo da marca
- ❌ **Imagens** do anúncio — precisam ser produzidas/fornecidas
- ❌ **Vídeos**

Por isso o documento sempre termina com a seção **"Ativos externos pendentes & otimização"**, listando logo e imagens como pendências, com a observação de que podem ser adicionados manualmente no painel ou via deploy quando o usuário tiver os arquivos. (Imagens de anúncio podem, inclusive, ser geradas com as skills `criativos-meta-ia` / `gerar-imagem-codex` e depois subidas.)
