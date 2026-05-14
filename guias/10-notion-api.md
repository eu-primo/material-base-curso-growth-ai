# Guia 10: Notion API

Conectar a API do Notion permite que o Claude Code leia, crie e edite paginas, databases e blocos no seu workspace. Ideal para organizar projetos, registrar informacoes automaticamente e criar dashboards de gestao.

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | Gratis (qualquer plano Notion) |
| Tempo de setup | ~10 minutos |
| Token expira? | **Nao!** Integration token permanente |
| O que voce precisa | Conta no Notion com workspace |

## Como funciona a autenticacao do Notion

Diferente do Google (que usa Service Account ou OAuth2), o Notion usa **Internal Integrations** — voce cria uma integracao no Notion, recebe um token, e conecta esse token as paginas/databases que quiser. Simples e direto.

Importante: a integracao so acessa o que voce **explicitamente compartilhar** com ela. Por padrao, ela nao ve nada.

## Passo a passo

### 1. Criar uma Integration

1. Acesse: https://www.notion.so/my-integrations
2. Clique **"+ New integration"**
3. Preencha:
   - **Name**: `claude-code` (ou qualquer nome descritivo)
   - **Associated workspace**: selecione seu workspace
   - **Type**: Internal
4. Clique **Submit**
5. Copie o **Internal Integration Secret** (comeca com `ntn_`)

> Este token nao expira e nao precisa de renovacao. Guarde-o no `.env`.

### 2. Salvar no .env

```
NOTION_TOKEN="ntn_seu_token_aqui"
```

### 3. Compartilhar paginas/databases com a Integration

A integracao so acessa o que voce compartilhar. Para cada pagina ou database:

1. Abra a pagina/database no Notion
2. Clique no menu **"..."** (tres pontos) no canto superior direito
3. Clique em **"Connections"** (ou "Conexoes")
4. Busque o nome da sua integracao (`claude-code`)
5. Clique para conectar

> **Dica**: se voce compartilhar uma pagina pai, todas as subpaginas tambem ficam acessiveis.

### 4. Encontrar IDs de paginas e databases

Toda pagina e database no Notion tem um ID unico na URL:

```
https://www.notion.so/Minha-Pagina-abc123def456...
                                    ^^^^^^^^^^^^^^^^
                                    este e o ID (32 caracteres)
```

Para databases:
```
https://www.notion.so/abc123def456?v=xyz789...
                      ^^^^^^^^^^^^^^^^
                      este e o database ID
```

O Claude Code consegue extrair o ID da URL se voce colar direto.

## Teste rapido no Claude Code

```
Le o .env e usa o token do Notion. Lista as paginas e databases que a integracao tem acesso.
```

Se funcionar, voce vera a lista de paginas/databases compartilhadas.

## O que da pra fazer com a Notion API?

**Leitura:**
- Listar paginas e databases acessiveis
- Ler conteudo de paginas (blocos de texto, headings, listas, etc)
- Consultar databases com filtros e ordenacao (como um banco de dados)
- Ler propriedades de paginas (status, tags, datas, responsaveis)
- Buscar conteudo por texto

**Escrita:**
- Criar novas paginas
- Adicionar blocos de conteudo (texto, headings, listas, codigo, callouts)
- Criar e editar registros em databases
- Atualizar propriedades (status, tags, datas)
- Criar databases novas dentro de paginas

**Ideias de uso para gestao de trafego:**
- Registrar automaticamente resultados de campanhas em uma database
- Criar relatorios semanais como paginas formatadas
- Manter um CRM simples de clientes com status e metricas
- Documentar processos e playbooks de otimizacao
- Centralizar anotacoes de reunioes com clientes

**Ideias de uso para organizacao pessoal:**
- Organizar grade de aulas do curso
- Registrar aprendizados e anotacoes durante a producao
- Manter checklist de tarefas do projeto
- Criar um wiki pessoal de comandos e prompts uteis

## Conceitos do Notion API

O Notion organiza tudo em 3 niveis:

```
Page (pagina)
  └── Block (bloco de conteudo: texto, heading, lista, imagem, etc)
  └── Database (tabela com propriedades tipadas)
        └── Page (cada linha da database e uma pagina)
              └── Block (conteudo dentro da linha)
```

- **Page**: pode ser uma pagina solta ou um registro em uma database
- **Block**: unidade de conteudo (paragrafo, heading, lista, toggle, codigo, etc)
- **Database**: tabela com colunas tipadas (text, number, select, date, relation, etc)

## Notion vs Google Sheets — quando usar cada um

| Aspecto | Notion | Google Sheets |
|---|---|---|
| **Melhor para** | Conteudo rico (texto + tabelas + midias) | Dados tabulares puros (numeros, metricas) |
| **Estrutura** | Flexivel (paginas dentro de paginas) | Rigida (linhas e colunas) |
| **Formulas** | Basicas | Avancadas |
| **Visualizacao** | Kanban, calendario, galeria, timeline | Graficos |
| **Colaboracao** | Excelente (comments, mentions) | Boa |
| **API** | Leitura e escrita completa | Leitura e escrita completa |

**Resumo**: use Sheets para dados e calculos, use Notion para gestao e documentacao.

## Notas importantes

- A integracao so acessa paginas/databases **explicitamente compartilhadas**
- Compartilhar uma pagina pai da acesso a todas as subpaginas
- O token nunca expira, mas pode ser revogado em notion.so/my-integrations
- Limite: 3 requests/segundo por integracao (suficiente para uso normal)
- Blocos de conteudo sao retornados em lotes de 100 (paginacao automatica)
- Databases suportam filtros complexos (AND, OR, por tipo de propriedade)

## Biblioteca

Usamos a biblioteca oficial `@notionhq/client`, mantida pela equipe do Notion:
- **npm**: `npm install @notionhq/client`
- **Repositorio**: github.com/makenotion/notion-sdk-js
- **Documentacao**: developers.notion.com
- Ja esta instalada no projeto.

## Links oficiais

- My Integrations: https://www.notion.so/my-integrations
- API Reference: https://developers.notion.com/reference
- Getting Started: https://developers.notion.com/docs/getting-started
- Notion SDK (GitHub): https://github.com/makenotion/notion-sdk-js

## Checklist de validacao

- [ ] Integration criada em notion.so/my-integrations
- [ ] Token copiado (comeca com `ntn_`)
- [ ] .env preenchido com NOTION_TOKEN
- [ ] Pelo menos uma pagina/database compartilhada com a integracao
- [ ] Teste no Claude Code funcionou (listou paginas acessiveis)

Proximo passo: Volte para o [README](../README.md) para ver o mapa completo de guias.
