# Guia 05: Windsor AI + MCP (Opcional)

Windsor AI e um agregador de dados de marketing que conecta 50+ fontes (Google Ads, Meta, GA4, Pinterest, TikTok, LinkedIn, etc) em uma unica API. O diferencial: tem suporte a **MCP (Model Context Protocol)**, que conecta direto no Claude Code como um "plugin".

## Quando vale a pena?

| Cenario | Recomendacao |
|---------|-------------|
| 1-3 fontes (Meta + Google + GA4) | API direta (gratis) — voce ja sabe configurar |
| 4+ fontes ou quer simplificar | Windsor ($23/mes) — menos config, mais fontes |
| Precisa de Pinterest, TikTok, LinkedIn Ads | Windsor — evita configurar cada API |
| Cliente quer dados rapidamente | Windsor — 1 token, multiplas fontes |

## Resumo

| Item | Detalhe |
|------|---------|
| Custo | $23/mes (Basic) |
| Fontes | 50+ (Google, Meta, Pinterest, TikTok, LinkedIn, GA4, etc) |
| Conectores simultaneos | 3 (no plano Basic) |
| MCP | Sim — conecta direto no Claude Code |

## Passo a passo

### 1. Criar conta no Windsor

1. Acesse: https://windsor.ai
2. Crie uma conta (tem trial gratis)
3. Escolha o plano Basic ($23/mes) quando estiver pronto

### 2. Conectar fontes de dados

1. No dashboard do Windsor, va em **"Connectors"**
2. Clique na fonte desejada (ex: Google Ads)
3. Autorize o acesso (OAuth — similar ao que voce ja fez)
4. Repita para cada fonte (max 3 no plano Basic)

### 3. Obter API Key

1. No Windsor, va em **Settings** ou **API Access**
2. Copie sua **API Key**

### 4. Configurar MCP no Claude Code

O MCP permite que o Claude Code se conecte diretamente ao Windsor. Para configurar:

1. Copie o arquivo de exemplo:
```bash
cp .mcp.json.example .mcp.json
```

2. Abra `.mcp.json` e substitua o token:
```json
{
  "mcpServers": {
    "windsor": {
      "command": "mcp-proxy",
      "args": [
        "https://mcp.windsor.ai/",
        "--transport=streamablehttp"
      ],
      "env": {
        "API_ACCESS_TOKEN": "sua_api_key_windsor"
      }
    }
  }
}
```

3. Instale o mcp-proxy (necessario):
```bash
npm install -g mcp-proxy
```

4. Reinicie o Claude Code (feche e abra novamente)

### 5. Testar

No Claude Code, digite:

```
Lista os conectores disponiveis no Windsor.
```

O Claude usara a ferramenta `mcp__windsor__get_connectors` e mostrara suas fontes conectadas.

Depois teste puxar dados:

```
Puxa o spend de todas as minhas fontes de ads dos ultimos 7 dias via Windsor.
```

## Ferramentas MCP disponiveis

Quando o Windsor MCP esta configurado, o Claude Code ganha 4 novas ferramentas:

| Ferramenta | O que faz |
|-----------|-----------|
| `mcp__windsor__get_connectors` | Lista fontes conectadas |
| `mcp__windsor__get_fields` | Mostra campos disponiveis por fonte |
| `mcp__windsor__get_data` | Puxa dados (metricas, dimensoes, periodo) |
| `mcp__windsor__get_options` | Opcoes de configuracao |

## Exemplo de uso pratico

```
Puxa via Windsor os dados de spend, clicks e impressions do Google Ads e Meta Ads
dos ultimos 30 dias, agrupados por campanha. Compara a eficiencia dos dois canais.
```

O Claude vai chamar `mcp__windsor__get_data` para cada fonte, cruzar os dados e te dar a analise.

## Notas

- O plano Basic tem max 3 conectores simultaneos
- Para trocar um conector, desconecte um e conecte outro
- Windsor agrega dados em formato padronizado (campos iguais para todas as fontes)
- Ideal para quem gerencia multiplos clientes (conecta uma vez, puxa de todos)

## Checklist de validacao

- [ ] Conta criada no Windsor AI
- [ ] Pelo menos 1 fonte conectada (Google Ads, Meta, etc)
- [ ] API Key obtida
- [ ] .mcp.json configurado com o token
- [ ] mcp-proxy instalado (`npm install -g mcp-proxy`)
- [ ] Claude Code reiniciado
- [ ] Teste funcionou (listou conectores e puxou dados)

Voltar para o [README](../README.md)
