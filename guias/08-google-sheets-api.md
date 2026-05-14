# Guia 08: Google Sheets API

Conectar a API do Google Sheets permite que o Claude Code leia e escreva em planilhas do Google — ideal para organizar dados, gerar relatorios estruturados e manter dashboards atualizados. Assim como o GA4, usa **Service Account**: configura uma vez e nunca mais precisa renovar.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Gratis |
| Tempo de setup | ~15-20 minutos |
| Token expira? | **Nao!** Service Account = configura 1 vez, para sempre |
| O que voce precisa | Conta Google + planilha criada |

## Passo a passo

### 1. Ativar a API no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto (ou crie um novo — veja nota abaixo)
3. Va em **APIs & Services > Library**
4. Busque **"Google Sheets API"** e clique **"Enable"**

> **Nota sobre Organization:** Se sua conta e Google Workspace (dominio da empresa), o projeto pode estar dentro de uma Organization. Organizacoes podem ter politicas que bloqueiam criacao de chaves de Service Account. Nesse caso, voce tem 3 opcoes:
> 1. Usar uma **conta Gmail pessoal** (nao tem Organization, sem bloqueios)
> 2. Pedir ao admin para desabilitar a politica `iam.disableServiceAccountKeyCreation` em **IAM & Admin > Organisation Policies**
> 3. Se voce for o admin: adicionar a role **"Organization Policy Administrator"** ao seu usuario no nivel da Organization, e entao desativar a politica

### 2. Criar Service Account (ou reaproveitar)

Se voce ja criou uma Service Account no [Guia 04 (GA4)](04-ga4-api.md), pode **reaproveitar a mesma**. Basta habilitar a Google Sheets API no mesmo projeto e pular para o Passo 4.

Caso contrario:

1. Va em **IAM & Admin > Service Accounts**
2. Clique **"Create Service Account"**
3. Nome: `google-services` (generico, para usar com Sheets, GA4, etc)
4. Clique "Create and Continue"
5. Role (permissao): pode pular
6. Clique "Done"

### 3. Gerar chave JSON

1. Clique na service account criada
2. Va na aba **"Keys"**
3. Clique **"Add Key" > "Create new key"**
4. Selecione **JSON** e clique "Create"
5. Um arquivo `.json` sera baixado
6. **Mova para a raiz do projeto** e renomeie para `google-services.json`

> IMPORTANTE: Este arquivo contem sua chave privada. Ele ja esta no .gitignore para nao ser commitado. Se a chave vazar (ex: aparecer em log, chat, ou commit), revogue imediatamente: Service Account > Keys > lixeira na chave > crie uma nova.

### 4. Compartilhar a planilha com a Service Account

A Service Account e como um "usuario robo" — ela precisa receber acesso a planilha, assim como voce compartilharia com um colega.

1. Abra o arquivo JSON e copie o campo `client_email`
   (formato: `nome@projeto.iam.gserviceaccount.com`)
2. Abra a planilha no Google Sheets
3. Clique em **Compartilhar**
4. Cole o email da service account
5. Selecione **Editor** (para ler e escrever)
6. Desmarque "Notificar pessoas"
7. Clique **Compartilhar**

### 5. Anotar o Spreadsheet ID

O ID da planilha esta na URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_AQUI/edit
```

Copie o trecho entre `/d/` e `/edit`.

### 6. Salvar no .env

```
GOOGLE_SERVICE_ACCOUNT_JSON="google-services.json"
GOOGLE_SHEETS_SPREADSHEET_ID="SEU_SPREADSHEET_ID"
```

## Teste rapido no Claude Code

```
Le o .env e o arquivo de service account. Acessa a planilha do Google Sheets e lista os headers (primeira linha) e quantas linhas de dados existem.
```

Se funcionar, voce vera os headers da planilha e a contagem de linhas.

## O que da pra fazer com a Sheets API?

**Leitura:**
- Ler celulas, ranges, abas inteiras
- Listar abas existentes na planilha
- Ler formatacao (cores, fontes, bordas)

**Escrita:**
- Escrever em celulas e ranges
- Inserir/deletar linhas e colunas
- Criar novas abas
- Aplicar formatacao (cores, bordas, negrito)
- Criar validacoes de dados (dropdowns, etc)

**Ideias de uso:**
- Organizar grade de aulas de um curso
- Gerar relatorios automatizados de marketing
- Registrar logs de campanhas
- Dashboard de KPIs atualizado via script

## Notas importantes

- A planilha precisa ser compartilhada com o email da SA — sem isso, da erro 403
- Uma Service Account pode acessar multiplas planilhas (basta compartilhar cada uma)
- Limite de 300 requests/minuto por projeto (mais que suficiente para uso normal)
- Se precisar apenas **ler** a planilha, de permissao de **Viewer** em vez de Editor

## Links oficiais

- Google Sheets API: https://developers.google.com/sheets/api
- Referencia de API: https://developers.google.com/sheets/api/reference/rest
- Limites e quotas: https://developers.google.com/sheets/api/limits

## Checklist de validacao

- [ ] Google Sheets API habilitada no Google Cloud
- [ ] Service Account criada (ou reaproveitada do GA4)
- [ ] Arquivo JSON baixado e salvo como `google-services.json` na raiz
- [ ] Email da service account adicionado como Editor na planilha
- [ ] Spreadsheet ID anotado
- [ ] .env preenchido com GOOGLE_SERVICE_ACCOUNT_JSON e GOOGLE_SHEETS_SPREADSHEET_ID
- [ ] Teste no Claude Code funcionou

Proximo passo: [Metodos de Autenticacao](09-autenticacao-google.md) para entender quando usar Service Account vs OAuth2
