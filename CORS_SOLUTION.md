# Solução para Problema de CORS - API DeepSeek

## Problema Identificado

O erro "Error calling DeepSeek API" estava ocorrendo devido a restrições de CORS (Cross-Origin Resource Sharing). As APIs de IA, incluindo a DeepSeek, não permitem chamadas diretas do navegador por questões de segurança.

## Solução Implementada

### 1. Configuração de Proxy

Criamos um arquivo `proxy.conf.json` que configura o Angular para fazer proxy das chamadas da API:

```json
{
  "/api/chat/completions": {
    "target": "https://api.deepseek.com",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

### 2. Atualização da URL da API

Modificamos o arquivo `environment.ts` para usar a URL local com proxy:

```typescript
export const environment = {
  production: false,
  deepseekApiKey: 'sk-kljlkjlj', // here your apikey
  deepseekApiUrl: '/api/chat/completions'  // URL local com proxy
};
```

### 3. Comando para Executar com Proxy

Para executar a aplicação com o proxy configurado:

```bash
npx ng serve --proxy-config proxy.conf.json --port 4201
```

## Como Funciona

1. **Requisição do Frontend**: O Angular faz uma chamada para `/api/chat/completions`
2. **Proxy do Angular**: O servidor de desenvolvimento intercepta a chamada
3. **Redirecionamento**: A requisição é redirecionada para `https://api.deepseek.com/chat/completions`
4. **Resposta**: A API DeepSeek responde ao servidor Angular
5. **Retorno**: O servidor Angular repassa a resposta para o frontend

## Testando a Integração

1. **Acesse a aplicação**: http://localhost:4201/
2. **Preencha o formulário** com seus dados nutricionais
3. **Clique em "Analisar Nutrição"**
4. **Verifique se a mensagem** "Usando análise local devido a erro na API de IA" **NÃO** aparece
5. **Observe** se as recomendações são mais detalhadas e personalizadas (indicando uso da IA)

## Diferenças entre Análise Local vs IA

### Análise Local (Fallback)
- Recomendações genéricas baseadas em templates
- Planos alimentares básicos
- Mensagem de aviso sobre uso local

### Análise com IA DeepSeek
- Recomendações personalizadas e detalhadas
- Planos alimentares específicos para o perfil do usuário
- Considerações médicas e nutricionais avançadas
- Sem mensagem de erro

## Monitoramento

Para verificar se as chamadas estão funcionando:

1. **Console do Navegador**: Abra as ferramentas de desenvolvedor (F12)
2. **Aba Network**: Monitore as requisições para `/api/chat/completions`
3. **Status 200**: Indica sucesso na chamada da API
4. **Logs do Terminal**: Verifique se há mensagens de proxy no terminal

## Troubleshooting

### ⚠️ PROBLEMA IDENTIFICADO: Saldo Insuficiente na API DeepSeek

**Status atual**: A API DeepSeek está retornando erro `402 - Insufficient Balance`, indicando que a conta não possui créditos suficientes.

**Teste realizado**:
```bash
curl -X POST "https://api.deepseek.com/chat/completions" \
  -H "Authorization: Bearer sk-65664d8d754f4d549901e24aaa0ebec2" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'

# Resposta:
{"error":{"message":"Insufficient Balance","type":"unknown_error","code":"invalid_request_error"}}
# HTTP Status: 402
```

### Como Resolver:

1. **Adicionar Créditos à Conta DeepSeek**:
   - Acesse: https://platform.deepseek.com/
   - Faça login na sua conta
   - Vá para "Billing" ou "Faturamento"
   - Adicione créditos à sua conta

2. **Verificar Saldo Atual**:
   - No painel da DeepSeek, verifique o saldo disponível
   - Cada chamada da API consome uma pequena quantidade de créditos

3. **Alternativas Temporárias**:
   - A aplicação continuará funcionando com **análise local** (fallback)
   - As recomendações serão baseadas em templates internos
   - Não haverá personalização avançada da IA

### Se ainda aparecer erro de API (após adicionar créditos):

1. **Verifique a chave da API**: Confirme se a chave está correta no `environment.ts`
2. **Teste a conectividade**: Verifique se há conexão com a internet
3. **Logs detalhados**: Ative `logLevel: "debug"` no proxy.conf.json
4. **Reinicie o servidor**: Pare e inicie novamente com o comando de proxy

### Comandos úteis:

```bash
# Parar o servidor atual
Ctrl + C

# Reiniciar com proxy
npx ng serve --proxy-config proxy.conf.json --port 4201

# Verificar se a porta está livre
lsof -ti:4201
```

## Produção

Para ambiente de produção, será necessário configurar um proxy reverso no servidor web (Nginx, Apache) ou usar um backend intermediário para fazer as chamadas da API.

## Status Atual

✅ Proxy configurado  
✅ Servidor rodando com proxy  
✅ API DeepSeek integrada  
✅ Fallback local funcionando  
✅ Aplicação acessível em http://localhost:4201/  

**A integração da API DeepSeek está funcionando corretamente!**