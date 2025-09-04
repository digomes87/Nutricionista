# Instruções de Configuração - NutriAI

## 🔧 Configuração Inicial

Este projeto requer configuração de arquivos de ambiente com chaves de API sensíveis que não são versionadas por segurança.

### 1. Configurar Arquivos de Ambiente

**Desenvolvimento:**
```bash
# Copie o template
cp src/environments/environment.template.ts src/environments/environment.ts

# Edite o arquivo e substitua YOUR_DEEPSEEK_API_KEY_HERE pela sua chave real
```

**Produção:**
```bash
# Copie o template
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts

# Edite o arquivo e substitua YOUR_DEEPSEEK_API_KEY_HERE pela sua chave real
```

### 2. Configurar Proxy (Desenvolvimento)

```bash
# Copie o template
cp proxy.conf.template.json proxy.conf.json

# O arquivo já está configurado corretamente para desenvolvimento
```

### 3. Obter Chave da API DeepSeek

1. Acesse: https://platform.deepseek.com/
2. Crie uma conta ou faça login
3. Vá para "API Keys"
4. Gere uma nova chave
5. **Importante**: Adicione créditos à sua conta em "Billing"

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar em Desenvolvimento

```bash
# Com proxy para resolver CORS da API DeepSeek
npx ng serve --proxy-config proxy.conf.json --port 4201

# Acesse: http://localhost:4201/
```

## 🔒 Segurança

### Arquivos NÃO Versionados (Sensíveis)
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `proxy.conf.json`
- Qualquer arquivo `.env*`

### Arquivos Versionados (Templates)
- `src/environments/environment.template.ts`
- `src/environments/environment.prod.template.ts`
- `proxy.conf.template.json`

## 🚀 Funcionalidades

### Com API DeepSeek (Requer Créditos)
- Análise nutricional personalizada por IA
- Recomendações detalhadas e específicas
- Planos alimentares customizados

### Sem API DeepSeek (Fallback Local)
- Cálculos nutricionais básicos (IMC, TMB)
- Recomendações baseadas em templates
- Planos alimentares genéricos

## 🛠️ Troubleshooting

### Erro "Insufficient Balance"
- Adicione créditos à sua conta DeepSeek
- Verifique o saldo em https://platform.deepseek.com/

### Erro de CORS
- Certifique-se de usar o proxy: `--proxy-config proxy.conf.json`
- Verifique se o arquivo `proxy.conf.json` existe

### Erro de Compilação
- Verifique se os arquivos de ambiente existem
- Copie os templates se necessário

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da UI
│   ├── services/            # Serviços (nutrition.service.ts)
│   └── app.component.ts     # Componente principal
├── environments/
│   ├── environment.template.ts      # Template (versionado)
│   ├── environment.prod.template.ts # Template prod (versionado)
│   ├── environment.ts              # Real (NÃO versionado)
│   └── environment.prod.ts         # Real prod (NÃO versionado)
└── assets/                  # Recursos estáticos
```

## 🤝 Contribuindo

1. **NUNCA** commite chaves de API reais
2. Use sempre os arquivos template como referência
3. Teste localmente antes de fazer push
4. Documente mudanças na configuração

---

**⚠️ Lembre-se**: Mantenha suas chaves de API seguras e nunca as compartilhe publicamente!