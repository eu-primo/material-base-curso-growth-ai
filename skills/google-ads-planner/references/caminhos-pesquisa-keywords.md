# Caminhos de pesquisa de palavras-chave

Há **quatro** formas de levantar as keywords. Escolha no **Passo 0** conforme o que o usuário tem disponível. Nem todo aluno terá DataForSEO ou já roda campanhas — a skill funciona em qualquer um dos casos. Sempre registre no documento final **qual caminho foi usado** e a **qualidade do dado** (real vs estimado).

| Caminho | Origem do dado | Qualidade |
|---|---|---|
| **A — DataForSEO** (MCP ou REST) | Volume/CPC/concorrência reais do Google | ⭐⭐ |
| **B — Semente + Planejador** | Dados reais do Planejador do Google Ads | ⭐⭐ |
| **C — Autônomo** | Estimativa da IA (+ busca na web opcional) | ⭐ |
| **D — Histórico da própria conta** | Conversões/termos reais da conta do cliente | ⭐⭐⭐ (melhor insumo) |

---

## Caminho A — DataForSEO (MCP ou REST)

Dá volume de busca, CPC e concorrência **reais**. Há duas formas de falar com o DataForSEO — escolha pela disponibilidade:

### A1) Via MCP (mais simples, quando já conectado)
Se o servidor `dataforseo` está no `.mcp.json` (é o caso do material base do curso), o Claude usa as **ferramentas nativas** do MCP — sem escrever requisição nenhuma. Basta pedir volume/ideias de keywords e ele chama a tool certa.
- **Prós:** zero código, ótimo para iniciantes, descoberta automática das capacidades.
- **Contras:** consome mais janela de contexto (o servidor expõe muitas ferramentas) e as respostas podem ser verbosas. Mitigue limitando os módulos do servidor (ex.: carregar só *Keywords Data* / *Labs*) e pedindo resultados resumidos.

### A2) Via API REST (leve e portátil)
Chamadas diretas com HTTP Basic Auth (`DATAFORSEO_USERNAME`/`DATAFORSEO_PASSWORD`, ou `LOGIN`/`PASSWORD`). Setup no **Guia 07 — DataForSEO** (pasta `guias/` do material do curso).
- **Prós:** leve no contexto, você pega só o que precisa, funciona em **cloud/headless** (sem depender de MCP).
- **Contras:** precisa montar as chamadas.

Brasil: `location_code: 2076` (ou `location_name: "Brazil"`). Português: `language_code: "pt"`. Cidade: use `location_name` (ex.: `"São Paulo,State of São Paulo,Brazil"`).

```bash
# 1) Expandir sementes → ideias de keywords
curl -s -X POST "https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live" \
  -u "$DATAFORSEO_USERNAME:$DATAFORSEO_PASSWORD" -H "Content-Type: application/json" \
  -d '[{"keywords":["cozinha planejada","cozinha sob medida"],"location_code":2076,"language_code":"pt","limit":200}]'

# 2) Volume/CPC/competição das candidatas
curl -s -X POST "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live" \
  -u "$DATAFORSEO_USERNAME:$DATAFORSEO_PASSWORD" -H "Content-Type: application/json" \
  -d '[{"keywords":["cozinha planejada preço","cozinha planejada sob medida sp"],"location_code":2076,"language_code":"pt"}]'
```
Campos úteis: `search_volume`, `cpc`, `competition`, `competition_index`. Endpoints/versão mudam — confira https://docs.dataforseo.com. É pago por uso: gere ideias uma vez e trabalhe sobre o resultado.

> **Recomendação:** use o **MCP** quando já estiver conectado (didático e rápido); use **REST** para algo leve/portátil (cloud, headless) ou quando quiser controlar o custo de contexto. As duas chegam no mesmo dado.

Depois, siga para **seleção e agrupamento** ([estrategia-fundo-funil.md](estrategia-fundo-funil.md)).

---

## Caminho B — Semente + Planejador do Google Ads

Use quando não há DataForSEO, mas há acesso à conta do Google Ads. A IA sugere as sementes; o **humano** roda o Planejador e devolve os dados reais do próprio Google.

1. A skill **gera as sementes** por tema (10–20 termos âncora de fundo de funil).
2. No Google Ads: **Ferramentas → Planejamento → Planejador de palavras-chave → Descobrir novas palavras-chave**. Cole as sementes.
3. Ajuste **local** (região-alvo) e **idioma** (Português).
4. **Baixar ideias de palavras-chave** (download → CSV).
5. Devolva o CSV (salve no projeto ou cole o conteúdo).
6. A skill **lê o CSV** (colunas: *Keyword*, *Avg. monthly searches*, *Competition*, *Top of page bid low/high*), filtra fundo de funil e agrupa.

Dados reais, sem custo extra — só exige o passo manual de exportar.

---

## Caminho C — Autônomo (estimativa da IA)

Use quando não há nenhuma fonte de dados.

- Gere keywords de fundo de funil por tema com base no produto, na região e na linguagem do público.
- **Opcional, recomendado:** use **busca na web** para validar variações regionais, ver como concorrentes se descrevem e checar termos reais.
- **Sem volume/CPC reais.** Marque tudo como *estimativa* e seja transparente: a seleção fica "na mão da IA".
- Sugira evoluir para A, B ou D quando possível.

---

## Caminho D — Histórico da própria conta ⭐⭐⭐ (melhor insumo)

Use quando o cliente **já roda campanhas** no Google Ads. É o melhor ponto de partida: são dados de **conversão reais da própria conta** — mostra exatamente o que já dá resultado. Excelente para **reestruturar** uma conta existente.

Exige a conta vinculada via API (mesma configuração da skill `google-ads-deploy`) — **conecte na conta do cliente** (customer_id correto, não a conta padrão do `.env`).

**Duas formas:**

### D1) Via API (script de leitura)
Rode (a partir da raiz do projeto), apontando para a conta do cliente:
```bash
node ".claude/skills/google-ads-planner/scripts/puxar_historico.js" --customer <ID_DO_CLIENTE> --days 90
```
O script roda GAQL e traz: **termos de pesquisa que converteram**, **keywords por performance** (conversões, custo, CPA) e **termos que gastam sem converter**. Imprime em JSON para a skill analisar.

### D2) Via export manual
No Google Ads, exporte os relatórios de **Termos de Pesquisa** e de **Palavras-chave** (CSV, últimos 30–90 dias) e suba os arquivos. A skill analisa igual.

**O que extrair do histórico:**
- **Termos de pesquisa com conversões** → candidatos a virar keyword **exata** em grupo dedicado.
- **Keywords campeãs** (bom CPA) → manter/escalar; base dos grupos.
- **Termos que gastam e não convertem** → **negativas**.
- **Temas recorrentes** nos termos → sugerem **novos grupos**.

Cruze esses achados com o site do cliente para montar a nova estrutura. Quando faltar volume para algum tema, complemente com o caminho A, B ou C.
