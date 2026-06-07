---
name: google-ads-deploy
description: >-
  Executa no Google Ads, via API, a campanha de Rede de Pesquisa planejada pela skill
  google-ads-planner: lê o documento Markdown gerado em Google Ads Output/, valida e sobe
  orçamento, campanha, grupos de anúncios, palavras-chave (frase/exata), anúncios RSA e
  extensões (callouts/sitelinks). Cria sempre PAUSADA, com parceiros de pesquisa e Display
  desligados (Rede de Pesquisa pura). Use quando o usuário quiser subir, publicar, criar ou
  executar uma campanha no Google Ads a partir do documento planejado. Gatilhos: "subir
  campanha", "publicar campanha", "criar campanha no google ads", "executar o plano",
  "deploy google ads", "lançar campanha", "subir no google ads".
---

# Google Ads Deploy — executar a campanha via API

Esta skill **executa** no Google Ads a campanha que a skill [google-ads-planner](../google-ads-planner/SKILL.md) planejou. Ela lê o documento de `Google Ads Output/`, valida e cria a estrutura via API (Node + `google-ads-api`).

**Salvaguardas (inegociáveis):**
- A campanha é criada **PAUSADA**. Nada veicula até o usuário revisar e ativar no painel.
- **Parceiros de pesquisa OFF** e **Display OFF** — Rede de Pesquisa pura.
- **Sempre rode o dry-run primeiro** (`--validate-only`): valida o documento e testa o acesso à conta, sem criar nada. Só depois execute de verdade, com a confirmação do usuário.
- Ações na API mexem numa **conta real** e gastam verba quando ativadas — trate com o cuidado de algo difícil de reverter.

## Pré-requisitos

- Credenciais `GOOGLE_ADS_*` no `.env` da raiz (developer token, client id/secret, refresh token, customer id, MCC). Setup: veja o **Guia 03 — Google Ads API** (pasta `guias/` do material do curso).
- Lib `google-ads-api` (já é dependência do projeto — `package.json`).
- Um documento gerado pelo planner em `Google Ads Output/`.
- Saber **em qual conta** subir: `customer_id` do cliente (sem hífen) e o MCC como `login_customer_id`. Podem vir no JSON do documento ou do `.env`.

## Passo 0 — Detecção

1. **Qual documento** subir? (caminho do `.md` gerado pelo planner)
2. **Qual conta de anúncios?** Pergunte **em qual conta** subir e garanta que ela está **vinculada ao MCC e acessível via API** — sem isso, nada funciona. Para descobrir/conferir o ID, rode:
   ```bash
   node ".claude/skills/google-ads-deploy/scripts/subir_campanha.js" --list-accounts
   ```
   A conta usada vem, em ordem: `--customer <ID>` → `conta.customer_id` no doc → `.env`. **Nunca assuma a conta do `.env`** sem confirmar com o usuário — ela pode ser de outro cliente. O dry-run testa o acesso antes de criar e falha com mensagem clara se a conta não estiver acessível.

## Pipeline

### 1. Dry-run (sempre primeiro)
```bash
node ".claude/skills/google-ads-deploy/scripts/subir_campanha.js" "plano-google-ads-cliente.md" --validate-only
```
Extrai o JSON do documento, valida limites e campos, testa o acesso à conta e **imprime o plano** (campanha, nº de grupos, keywords, anúncios, extensões). Não cria nada.

### 2. Revisar e confirmar
Mostre o plano ao usuário. Confirme conta, orçamento/dia, estratégia de lance, região e que a rede está como pesquisa pura. **Só prossiga com o "ok" explícito do usuário.**

### 3. Executar
```bash
node ".claude/skills/google-ads-deploy/scripts/subir_campanha.js" "plano-google-ads-cliente.md"
```
Cria, em ordem: resolução de geo (por `criteria_id` ou pelo `nome` via API — aborta se nenhuma região resolver, para nunca veicular no país inteiro sem querer) → orçamento → campanha (PAUSADA, pesquisa pura; com rollback do orçamento se a campanha falhar) → critérios de região/idioma e negativas de campanha → grupos → keywords e negativas dos grupos → anúncios RSA → extensões (callouts/sitelinks/**structured snippets**).

### 4. Auto-auditoria (automática)
Logo após criar, o script roda sozinho uma **auto-auditoria estrutural**: re-consulta a campanha na conta e confere contra o documento + invariantes de segurança (PAUSED, rede pura, **geo aplicado e não-vazio**, **zero keyword em correspondência ampla**, orçamento, contagens de keywords/anúncios/negativas/extensões, limites de caractere ao vivo). Imprime uma seção `🔍 AUTO-AUDITORIA` com ✅/❌ por item.
- **Leia a saída.** Se houver qualquer ❌, NÃO trate como concluído: investigue no painel a divergência antes de o usuário ativar.
- A auditoria do script é **estrutural** (o que entrou na conta bate com o documento). A auditoria **factual** continua sendo sua: cruze as copies dos anúncios (números, m², nomes, estágio do lançamento, comodidades) contra os materiais reais do cliente (site/LP, briefing) e remova qualquer afirmação sem lastro.

### 5. Reportar
Ao final, informe ao usuário:
- IDs criados (campanha, grupos) e **link do painel** para revisar.
- O **resultado da auto-auditoria** (passou limpo, ou quais itens divergiram).
- A campanha está **PAUSADA** — ele precisa revisar e **ativar manualmente**.
- **Ativos externos pendentes** (logo, imagens): adicionar no painel ou subir depois, quando tiver os arquivos.
- Lembrete de otimização contínua (assunto das skills de otimização).

## O que esta skill NÃO faz

- Não cria **logo**, **imagens** nem **vídeos** (dependem de ativos externos).
- Não **ativa** a campanha (proposital — revisão humana antes).
- Não **otimiza** (isso é de outras skills).

## Detalhes técnicos

- Formato de entrada e mapeamentos (match types, estratégias de lance, rede, geo) em [references/formato-de-entrada.md](references/formato-de-entrada.md).
- Setup, flags, ordem de criação e solução de problemas em [references/setup-e-execucao.md](references/setup-e-execucao.md).

## Lembrete de instalação

Funciona como **project skill** rodando a partir desta pasta (precisa do `.env` da raiz e da dependência `google-ads-api`). A skill par, que gera o documento de entrada, é `google-ads-planner/`.
