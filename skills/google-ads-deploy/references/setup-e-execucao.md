# Setup, execução e solução de problemas

## Pré-requisitos

- **Node.js** e a dependência **`google-ads-api`** (já no `package.json` do projeto — rode `npm install` na raiz se faltar).
- **`.env` na raiz** com as 6 variáveis do Google Ads (o script sobe diretórios a partir de si mesmo até achar o `.env`):
  - `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`
  - `GOOGLE_ADS_CUSTOMER_ID` (conta do cliente) e `GOOGLE_ADS_MCC_CUSTOMER_ID` (gerenciadora)
  - Setup completo: **Guia 03 — Google Ads API** (pasta `guias/` do material do curso).

## Como rodar

Sempre **a partir da raiz do projeto** (para o `.env` e o `node_modules` serem encontrados):

```bash
# 1) Dry-run obrigatório — valida e testa a conta, não cria nada
node ".claude/skills/google-ads-deploy/scripts/subir_campanha.js" "plano-google-ads-cliente.md" --validate-only

# 2) Execução real — cria a campanha PAUSADA
node ".claude/skills/google-ads-deploy/scripts/subir_campanha.js" "plano-google-ads-cliente.md"
```

**Flags:**
- `--validate-only` (ou `--dry-run`): valida o documento, força as salvaguardas, conecta na conta e imprime o plano. Não cria nada.
- `--list-accounts`: lista as contas vinculadas ao MCC (pra achar o `customer_id` certo) e sai.
- `--customer <id>`: sobrescreve o `customer_id` do cliente (sem hífen).
- `--login <id>`: sobrescreve o `login_customer_id` (MCC, sem hífen).

A conta usada vem, em ordem: flag → JSON do doc (`conta.customer_id`) → `.env`.

## Ordem de criação

1. **Orçamento** (`campaignBudget`) — valor/dia em micros.
2. **Campanha** — `SEARCH`, `PAUSED`, rede de pesquisa pura, estratégia de lance.
3. **Critérios da campanha** — localizações (geo), idiomas, negativas de campanha.
4. **Grupos de anúncios**.
5. **Keywords** (frase/exata) e **negativas** do grupo.
6. **Anúncios RSA** (headlines, descriptions, paths).
7. **Extensões** — callouts e sitelinks (não abortam a campanha se falharem; o erro é reportado).

## Salvaguardas embutidas (não dá pra burlar pelo doc)

- `status` é **forçado para PAUSED**.
- `search_partners` e `display` são **forçados para `false`**.
- Validação local bloqueia o envio se houver erro (limites de caractere, match inválido, grupo sem keyword/anúncio, URL inválida, etc.).

## Conversões

- **Micros:** R$ 1,00 = 1.000.000. Orçamento e lances são convertidos automaticamente (arredondados a múltiplos de 10.000 micros, exigência do Google).
- **Idiomas:** `pt` = 1014, `en` = 1000, `es` = 1003.

## Solução de problemas

| Sintoma | Causa provável / o que fazer |
|---|---|
| `Falha ao conectar na conta` | `customer_id`/MCC errados, refresh token expirado, ou a conta não está sob esse MCC. Teste com `node scripts/test-google-ads.js`. |
| `USER_PERMISSION_DENIED` | O `login_customer_id` (MCC) não gerencia esse `customer_id`, ou o developer token não tem acesso. |
| `404`/`500` ou versão | A versão da API muda; atualize a lib (`npm i google-ads-api@latest`) e tente de novo. |
| Erro em geo/localização | `criteria_id` incorreto. Confira em https://developers.google.com/google-ads/api/data/geotargets. |
| `MANUAL_CPC` sem lance | Informe `lance_padrao_brl` nos grupos. |
| Criação parcial após erro | O orçamento/campanha podem ter sido criados antes do erro. **Verifique no painel** antes de rodar de novo, para não duplicar. |

## Depois de subir

A campanha fica **PAUSADA**. Revise no painel, complete os **ativos externos** (logo/imagens) e **ative manualmente**. Otimização contínua é assunto das skills de otimização (próxima etapa do curso).
