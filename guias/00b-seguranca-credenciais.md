# Guia 00b: Seguranca de Credenciais — .env, .gitignore e boas praticas

Antes de conectar qualquer API, voce precisa entender como proteger suas chaves e tokens. Este guia explica o sistema de protecao que usamos no projeto e por que ele existe.

## Por que isso importa?

Quando voce conecta uma API (Meta Ads, Google Ads, GA4, Sheets), recebe **chaves de acesso** — tokens, IDs, arquivos JSON com chaves privadas. Se alguem obter essas chaves, pode:

- Acessar e modificar seus dados de anuncios
- Ler seus relatorios e dados de clientes
- Gastar seu orcamento de ads
- Acessar planilhas e documentos compartilhados

Bots automatizados varrem o GitHub 24 horas por dia procurando chaves vazadas. Um commit acidental com seu token pode ser explorado em minutos.

## O sistema de protecao: 3 arquivos

Usamos 3 arquivos que trabalham juntos:

```
.env.example  →  template com nomes das variaveis (SEM valores reais)
                  ESTE vai pro Git — serve de guia para quem clonar o projeto

.env          →  suas credenciais reais (tokens, IDs, caminhos)
                  NUNCA vai pro Git — so existe na sua maquina

.gitignore    →  lista de arquivos que o Git deve ignorar
                  protege o .env e arquivos sensiveis de serem commitados
```

### Fluxo na pratica

```
1. Voce clona o projeto        → recebe o .env.example (sem segredos)
2. Copia para .env             → cp .env.example .env
3. Preenche o .env             → coloca seus tokens e IDs reais
4. O .gitignore protege        → Git ignora o .env, nunca sobe pro repositorio
5. O codigo le o .env          → usa as variaveis sem expor os valores
```

## Como funciona no codigo

A biblioteca `dotenv` carrega o `.env` e transforma cada linha em uma variavel de ambiente:

```
# .env (arquivo na sua maquina)
GOOGLE_SHEETS_SPREADSHEET_ID="1olaDSTV..."
GOOGLE_SERVICE_ACCOUNT_JSON="google-services.json"
```

```javascript
// No codigo — nenhum segredo aparece aqui
require('dotenv').config();

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
// spreadsheetId agora tem "1olaDSTV..." — mas o valor so existe no .env
```

O codigo so referencia o **nome** da variavel. O **valor** vem do `.env`, que nao esta no Git.

## O .gitignore do nosso projeto

```
# Credenciais e segredos
.env
.env.*
*-service-account.json
google-services.json

# MCP config com tokens reais
.mcp.json
```

Isso significa que, mesmo se voce rodar `git add .` (adicionar tudo), esses arquivos serao ignorados.

## Tipos de credenciais que protegemos

| Arquivo/Variavel | O que contem | Risco se vazar |
|---|---|---|
| `.env` | Tokens, IDs de conta, caminhos | Acesso a todas as suas APIs |
| `google-services.json` | Chave privada da Service Account | Acesso a tudo que a SA tem permissao |
| `.mcp.json` | Tokens de MCPs (Windsor, etc) | Acesso aos servicos conectados |

## Boas praticas

### Faca sempre:
- Copie `.env.example` para `.env` antes de comecar
- Verifique o `.gitignore` antes do primeiro commit
- Use nomes descritivos nas variaveis (facilita saber o que e cada uma)
- Revogue chaves que vazaram imediatamente (mesmo que "so apareceu no chat")

### Nunca faca:
- Colocar tokens direto no codigo (`const token = "abc123"`)
- Commitar o `.env` ou arquivos JSON de service account
- Compartilhar o `.env` por email, Slack ou mensagem
- Usar a mesma chave em producao e desenvolvimento

## Se uma chave vazar

1. **Revogue imediatamente** na plataforma de origem:
   - Meta: Business Manager > App Settings > gerar novo token
   - Google Service Account: Cloud Console > Service Account > Keys > deletar a chave > criar nova
   - Google OAuth2: Cloud Console > Credentials > deletar credencial > criar nova
2. **Gere uma nova chave** e atualize o `.env`
3. **Verifique logs** da plataforma para ver se houve acesso nao autorizado

## Teste de seguranca

Antes de fazer qualquer push, verifique:

```bash
git status
```

Se `.env`, `google-services.json` ou `.mcp.json` aparecerem na lista de "Untracked files" ou "Changes to be committed", **algo esta errado com o .gitignore**. Nao faca o commit ate resolver.

## Checklist

- [ ] Entendi a diferenca entre `.env` e `.env.example`
- [ ] Copiei `.env.example` para `.env` e preenchi com meus dados
- [ ] Verifiquei que `.env` aparece no `.gitignore`
- [ ] Verifiquei que `google-services.json` aparece no `.gitignore`
- [ ] Sei como revogar uma chave caso ela vaze

Proximo passo: [Instalar VS Code](00-vscode-setup.md) e [Claude Code](01-claude-code-setup.md)
