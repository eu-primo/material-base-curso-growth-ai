# Guia 09: Metodos de Autenticacao do Google — Service Account vs OAuth2

Quando voce conecta APIs do Google, existem dois metodos principais de autenticacao. Entender a diferenca entre eles evita dor de cabeca e te ajuda a escolher o certo para cada situacao.

## Resumo rapido

| | Service Account | OAuth2 (Usuario) |
|---|---|---|
| **O que e** | Um "usuario robo" com email proprio | Voce mesmo, autenticado via login |
| **Como autentica** | Arquivo JSON (chave privada) | Login no navegador + refresh token |
| **Expira?** | Nunca (enquanto a chave existir) | Refresh token pode expirar/revogar |
| **Precisa de browser?** | Nao | Sim (na primeira vez) |
| **Aparece como** | `nome@projeto.iam.gserviceaccount.com` | `seuemail@gmail.com` |
| **Ideal para** | Automacoes, backend, scripts | APIs que exigem contexto de usuario |

## Quando usar cada um?

### Service Account — use quando:
- Voce quer **automatizar** (scripts que rodam sozinhos)
- Precisa apenas **ler dados** ou **escrever em recursos compartilhados**
- Quer setup simples: gera o JSON uma vez e esquece
- Exemplos: puxar relatorios do GA4, ler/escrever no Google Sheets

### OAuth2 — use quando:
- A API **exige** (Google Ads so aceita OAuth2)
- Voce precisa **administrar/configurar** recursos (criar audiences no GA4, gerenciar campanhas)
- Precisa agir **como o usuario logado** (acessar Meu Drive, enviar emails como voce)
- Exemplos: Google Ads API, GA4 Admin API, Gmail API

## Mapa por API do Google

| API | Service Account | OAuth2 | Recomendacao |
|-----|:-:|:-:|---|
| **Google Sheets** | Ler e escrever | Ler e escrever | Service Account (mais simples) |
| **GA4 Data API** (relatorios) | Ler | Ler | Service Account (mais simples) |
| **GA4 Admin API** (configurar) | Nao suporta | Ler e escrever | OAuth2 (unico metodo) |
| **Google Ads** | Nao suporta | Ler e escrever | OAuth2 (unico metodo) |
| **Google Drive** | Arquivos compartilhados | Meu Drive completo | Depende do uso |

### Abordagem hibrida para GA4

Uma estrategia inteligente e combinar os dois metodos:

- **Service Account** para puxar relatorios automatizados (sessoes, conversoes, canais)
  - Setup: [Guia 04](04-ga4-api.md)
  - Vantagem: nunca expira, roda sem intervencao humana

- **OAuth2** para operacoes administrativas (criar metricas customizadas, audiences, configurar eventos)
  - Setup: similar ao [Guia 03 (Google Ads)](03-google-ads-api.md) — mesmo fluxo de OAuth2
  - Vantagem: acesso completo a configuracoes da propriedade

No `.env`, voce teria ambos configurados e usaria cada um conforme a necessidade.

## Conta pessoal (Gmail) vs Google Workspace

Outra diferenca importante que afeta o setup:

| | Gmail pessoal (`@gmail.com`) | Google Workspace (`@empresa.com`) |
|---|---|---|
| **Organization no GCP** | Nao tem | Tem (controlada pelo admin) |
| **Politicas de seguranca** | Nenhuma — tudo liberado | Pode bloquear criacao de chaves SA |
| **Compartilhar com SA** | Sem restricoes | Pode restringir compartilhamento externo |
| **Recomendacao** | Ideal para quem esta comecando | Precisa verificar politicas com admin |

### Se voce usa Google Workspace e encontrou bloqueios:

1. **"Service account key creation is disabled"**
   - Causa: politica `iam.disableServiceAccountKeyCreation` ativa na Organization
   - Solucao: admin vai em **IAM & Admin > Organisation Policies**, busca a politica, clica "Manage Policy", coloca Enforcement **Off**
   - Dica: pode desativar so para o projeto especifico (nao precisa ser na org inteira)

2. **"Organization's user policy" ao compartilhar**
   - Causa: a Organization restringe compartilhamento com emails externos
   - Solucao: admin vai em **Google Admin Console > Apps > Google Workspace > Drive > Sharing settings** e permite compartilhamento com `gserviceaccount.com`

3. **Alternativa simples**: criar o projeto GCP com uma conta Gmail pessoal e compartilhar os recursos (planilhas, GA4) com o email da Service Account

## Como funciona por baixo dos panos

### Service Account
1. Voce gera um arquivo JSON com uma chave privada
2. O codigo usa essa chave para gerar um **JWT** (JSON Web Token)
3. O JWT e trocado por um **access token** temporario (~1 hora)
4. Tudo isso acontece automaticamente — a biblioteca `googleapis` faz por voce
5. Quando o access token expira, gera outro automaticamente. Zero manutencao.

### OAuth2
1. Voce faz login no navegador e autoriza o app
2. O Google retorna um **authorization code**
3. O codigo troca o authorization code por um **access token** + **refresh token**
4. O access token expira em ~1 hora, mas o refresh token e usado para gerar novos
5. O refresh token normalmente nao expira, mas pode ser revogado pelo usuario ou pelo Google

## Checklist de decisao

Antes de configurar uma API do Google, pergunte-se:

- [ ] A API aceita Service Account? (verifique na documentacao)
- [ ] Voce precisa apenas ler dados ou tambem administrar/configurar?
- [ ] O processo precisa rodar automaticamente (sem intervencao humana)?
- [ ] Sua conta e pessoal (Gmail) ou Workspace (empresa)?

Se a API aceita SA e voce so precisa ler/escrever dados → **Service Account**.
Se a API exige OAuth2 ou voce precisa gerenciar configuracoes → **OAuth2**.

## Links oficiais

- Service Account Overview: https://cloud.google.com/iam/docs/service-account-overview
- OAuth2 para APIs Google: https://developers.google.com/identity/protocols/oauth2
- Escolhendo metodo de auth: https://cloud.google.com/docs/authentication

Proximo passo: Volte para o [README](../README.md) para ver o mapa completo de guias.
