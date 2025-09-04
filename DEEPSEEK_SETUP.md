# Configuração da API DeepSeek para NutriAI

## Pré-requisitos

1. **Conta DeepSeek**: Crie uma conta em [https://chat.deepseek.com/](https://chat.deepseek.com/)
2. **API Key**: Obtenha sua chave de API no painel de desenvolvedor da DeepSeek

## Configuração

### 1. Configurar a Chave da API

Edite o arquivo `src/environments/environment.ts` e substitua `YOUR_DEEPSEEK_API_KEY` pela sua chave real:

```typescript
export const environment = {
  production: false,
  deepseekApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Sua chave real aqui
  deepseekApiUrl: 'https://api.deepseek.com/chat/completions'
};
```

### 2. Configuração para Produção

Para produção, edite `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  deepseekApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Sua chave de produção
  deepseekApiUrl: 'https://api.deepseek.com/chat/completions'
};
```

## Como Funciona

### Integração com IA

O sistema agora utiliza a API da DeepSeek para:

1. **Análise Nutricional Personalizada**: A IA analisa os dados do usuário (peso, altura, gordura corporal, objetivos) e fornece recomendações específicas

2. **Planos Alimentares Inteligentes**: Gera planos de refeição detalhados baseados no perfil e objetivos do usuário

3. **Recomendações Contextualizadas**: Fornece conselhos nutricionais personalizados considerando o IMC, TMB e necessidades calóricas

### Fallback Local

Se a API falhar ou não estiver disponível, o sistema automaticamente:
- Utiliza os cálculos locais para análise básica
- Gera planos alimentares padrão baseados no objetivo
- Exibe uma nota informando que está usando análise local

## Estrutura do Prompt

O sistema envia para a IA:
- Dados completos do paciente
- Análises calculadas (IMC, TMB, necessidades calóricas)
- Solicitação de formato JSON estruturado
- Contexto de nutricionista especializado

## Exemplo de Resposta da IA

```json
{
  "recommendations": "Baseado em sua análise, recomendo...",
  "diets": [
    {
      "name": "Plano Equilibrado para Perda de Peso",
      "meals": {
        "breakfast": "Aveia com frutas vermelhas e castanhas...",
        "lunch": "Salmão grelhado com quinoa e vegetais...",
        "dinner": "Frango com batata doce e salada verde...",
        "snacks": "Iogurte natural com nozes..."
      }
    }
  ]
}
```

## Segurança

⚠️ **Importante**: 
- Nunca commite suas chaves de API no repositório
- Use variáveis de ambiente em produção
- Mantenha suas chaves seguras e privadas

## Troubleshooting

### Erro de API
- Verifique se a chave está correta
- Confirme se há créditos disponíveis na conta DeepSeek
- Verifique a conectividade com a internet

### Fallback Ativado
- O sistema mostrará "⚠️ Nota: Usando análise local devido a erro na API de IA"
- Verifique os logs do console para detalhes do erro

## Executar a Aplicação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Acessar em http://localhost:4200
```

A aplicação agora fornecerá análises nutricionais alimentadas por IA real em vez de dados mockados!