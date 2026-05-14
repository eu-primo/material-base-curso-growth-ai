# Guia 00c: Como o Claude Code se conecta com APIs — Node.js, bibliotecas e .env

Este guia explica a infraestrutura por tras das conexoes com APIs. Voce nao precisa ser programador para usar o Claude Code, mas entender como as pecas se encaixam vai te ajudar a resolver problemas e trabalhar com mais confianca.

## A visao geral

Para o Claude Code acessar um servico externo (Google Sheets, GA4, Meta Ads), 3 coisas precisam existir:

```
Suas credenciais (.env)  →  Biblioteca (googleapis)  →  Servico (Google Sheets)
    "a senha"               "o app do banco"              "o banco"
```

1. **Suas credenciais** — tokens, IDs, chaves. Ficam no `.env` e no JSON da service account.
2. **A biblioteca** — codigo pronto que sabe como falar com a API do Google. Voce instala uma vez.
3. **O servico** — Google Sheets, GA4, Meta Ads, etc. Esta na nuvem, esperando receber pedidos.

O Claude Code e quem **junta** as 3 coisas: le suas credenciais, usa a biblioteca, e faz o pedido ao servico.

## Por que precisa de uma biblioteca?

Toda API tem regras: como autenticar, como formatar pedidos, como interpretar respostas, como lidar com erros. Isso e um processo complexo.

A biblioteca `googleapis` ja vem com tudo isso resolvido. Sem ela, o Claude Code teria que escrever dezenas de linhas de codigo toda vez que voce pedisse "le minha planilha". Com ela, o trabalho se resume a poucas linhas.

**Analogia:** voce poderia ir ao banco presencialmente, pegar senha, esperar na fila, falar com o caixa. Ou voce abre o app do banco e resolve em 2 toques. A biblioteca e o app — faz o trabalho pesado por voce.

### googleapis: um pacote, todos os servicos Google

O `googleapis` e a biblioteca **oficial** do Google, mantida pela propria equipe do Google. Ela cobre praticamente todos os servicos:

| Servico | Incluido? | Exemplo de uso |
|---|:-:|---|
| Google Sheets | Sim | Ler/escrever planilhas |
| Google Drive | Sim | Upload/download de arquivos |
| GA4 Data API | Sim | Puxar relatorios de analytics |
| GA4 Admin API | Sim | Criar metricas, audiences |
| Google Calendar | Sim | Criar eventos, ler agenda |
| Gmail | Sim | Enviar/ler emails |
| YouTube Data | Sim | Dados de canais, videos |
| Google Docs | Sim | Ler/escrever documentos |
| **Google Ads** | **Nao** | Tem biblioteca propria (`google-ads-api`) |

Ou seja: com um unico `npm install googleapis`, voce tem acesso a dezenas de APIs do Google. So precisa habilitar cada uma no Google Cloud Console e configurar as credenciais.

> O Google Ads e a excecao — por ser mais complexo (linguagem de query propria, estrutura de campanhas, hierarquia MCC > conta > campanha > grupo > anuncio), tem uma biblioteca dedicada: `google-ads-api`. Ambas ja estao instaladas no projeto. Veja mais detalhes em [Guia 03: Google Ads API](03-google-ads-api.md).

### Resumo das bibliotecas instaladas no projeto

| Biblioteca | Instalacao | Para que serve | Quem mantem |
|---|---|---|---|
| `googleapis` | `npm install googleapis` | Todos os servicos Google (Sheets, GA4, Drive, YouTube, etc) | Google (oficial) |
| `google-ads-api` | `npm install google-ads-api` | Google Ads especificamente (campanhas, keywords, GAQL) | Comunidade (usa API oficial) |
| `@notionhq/client` | `npm install @notionhq/client` | Notion (databases, pages, blocos) | Notion (oficial) |
| `dotenv` | `npm install dotenv` | Ler variaveis do arquivo `.env` | Comunidade (padrao da industria) |

### E de onde vem? E confiavel?

O `googleapis` e baixado do **npm** (npmjs.com) — o repositorio central de bibliotecas Node.js. Indicadores de confianca:

- **Publicado por**: `google` (conta verificada no npm)
- **Repositorio**: github.com/googleapis/google-api-nodejs-client (organizacao oficial do Google)
- **Downloads**: ~4 milhoes por semana
- **Licenca**: Apache 2.0 (licenca open source do Google)

E o mesmo nivel de confianca de baixar um app oficial do Google na App Store.

### dotenv: a biblioteca que le o .env

O `dotenv` nao e do Google — e uma biblioteca da comunidade open source. Sua unica funcao e ler o arquivo `.env` e transformar cada linha em uma variavel de ambiente acessivel no codigo.

Indicadores de confianca:
- **Downloads**: ~25 milhoes por semana (uma das mais usadas do npm)
- **Usada por**: praticamente todo projeto Node.js profissional
- **Funcao**: simples e especifica — so le o `.env`, nada mais

Sem o `dotenv`, voce teria que passar as variaveis manualmente pelo terminal toda vez. Com ele, basta ter o `.env` no projeto e chamar `require('dotenv').config()` no inicio do codigo.

## O que e Node.js?

Node.js e o **ambiente** que roda codigo JavaScript fora do navegador. Quando voce instala uma biblioteca com `npm install`, e o Node.js que permite usar ela.

Pense assim:
- **Node.js** = o sistema operacional do app do banco (iOS/Android)
- **npm** = a loja de apps (App Store/Play Store)
- **googleapis** = o app do banco que voce baixou

Sem o sistema operacional, o app nao roda. Sem o npm, voce nao instala. Sem o app, nao acessa o banco.

## Os arquivos do Node.js no projeto

```
package.json        →  lista de bibliotecas que o projeto usa ("lista de compras")
package-lock.json   →  versoes exatas instaladas (garante que todo mundo usa as mesmas)
node_modules/       →  as bibliotecas baixadas ("o carrinho cheio")
```

### Por que o node_modules tem tantas pastas?

Porque bibliotecas dependem de outras bibliotecas. O `googleapis` precisa de uma biblioteca para autenticacao, que precisa de outra para gerar tokens, que precisa de outra para criptografia, e assim por diante.

```
googleapis                    (conectar nas APIs do Google)
  └── google-auth-library     (autenticacao)
        └── gtoken            (gerar tokens JWT)
              └── jws         (assinar tokens)
                    └── ...   (e por ai vai)
```

O npm resolve tudo automaticamente. Voce nunca precisa abrir ou editar nada dentro do `node_modules`.

### Preciso me preocupar com o node_modules?

Nao. Ele:
- Ja esta no `.gitignore` — nao vai pro Git
- E recriado automaticamente com `npm install` se for deletado
- Nunca precisa ser editado

Quem clonar o projeto so precisa rodar `npm install` para baixar tudo de novo.

## O fluxo completo na pratica

Quando voce pede ao Claude Code "le minha planilha do Google Sheets", acontece o seguinte:

```
1. Claude Code le o .env             → descobre o ID da planilha e o caminho do JSON
2. Claude Code le o google-services.json  → pega a chave privada da Service Account
3. Claude Code usa o googleapis      → a biblioteca gera um token de acesso automaticamente
4. googleapis faz o pedido           → envia para a API do Google Sheets
5. Google Sheets responde            → retorna os dados da planilha
6. Claude Code mostra pra voce       → formata e apresenta os dados
```

Tudo isso acontece em segundos. Voce so ve o resultado final.

## Resumo: o que cada coisa faz

| Componente | O que e | Analogia |
|---|---|---|
| `.env` | Suas credenciais | Senha do banco |
| `google-services.json` | Chave privada da Service Account | Cartao do banco |
| `googleapis` | Biblioteca que fala com APIs Google | App do banco |
| `dotenv` | Biblioteca que le o .env | Leitor de cartao |
| `node_modules/` | Pasta com todas as bibliotecas | Apps instalados no celular |
| `package.json` | Lista de bibliotecas do projeto | Lista de apps necessarios |
| Node.js | Ambiente que roda o codigo | Sistema operacional (iOS/Android) |
| npm | Gerenciador de pacotes | App Store / Play Store |
| Claude Code | Quem orquestra tudo | Voce, usando o app do banco |

## Checklist

- [ ] Entendi que o `.env` guarda credenciais, mas nao conecta sozinho
- [ ] Entendi que `googleapis` e a biblioteca que faz a comunicacao com o Google
- [ ] Entendi que `node_modules` e automatico e nao preciso mexer
- [ ] Sei que `npm install` recria o node_modules a partir do package.json

Proximo passo: [Seguranca de Credenciais](00b-seguranca-credenciais.md) para entender como proteger suas chaves
