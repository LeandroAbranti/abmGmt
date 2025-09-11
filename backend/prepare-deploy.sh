#!/bin/bash

echo "🚀 Preparando projeto ABM para deploy..."

# 1. Atualizar package.json para produção
echo "📦 Configurando package.json..."
cat > package.json << 'EOF'
{
  "name": "abm-backend",
  "version": "1.0.0",
  "description": "API backend para sistema de autenticação ABM",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "build": "echo 'No build needed'",
    "test": "node test-client.js"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["abm", "authentication", "token", "email", "express"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "crypto-js": "^4.2.0",
    "@emailjs/nodejs": "^4.0.3",
    "dotenv": "^16.4.5",
    "axios": "^1.7.7"
  }
}
EOF

# 2. Criar arquivo de exemplo .env
echo "🔐 Criando .env.example..."
cat > .env.example << 'EOF'
# Configurações do EmailJS
EMAILJS_SERVICE_ID=seu_service_id
EMAILJS_TEMPLATE_ID=seu_template_id
EMAILJS_PUBLIC_KEY=sua_public_key
EMAILJS_PRIVATE_KEY=sua_private_key

# Configurações do servidor
PORT=3001

# Configurações de produção
NODE_ENV=production
EOF

# 3. Atualizar .gitignore
echo "📝 Atualizando .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/

# Temporary files
*.tmp
*.temp

# Production build
dist/
build/
EOF

# 4. Criar Procfile para Heroku (se necessário)
echo "⚙️ Criando Procfile..."
echo "web: node server.js" > Procfile

# 5. Atualizar README para deploy
echo "📚 Atualizando README..."
cat >> README.md << 'EOF'

## 🚀 Deploy

### Railway (Recomendado)
1. Fork este repositório
2. Conecte no Railway.app
3. Configure variáveis de ambiente
4. Deploy automático!

### Heroku
```bash
heroku create seu-app-abm
heroku config:set EMAILJS_SERVICE_ID=seu_service_id
heroku config:set EMAILJS_TEMPLATE_ID=seu_template_id
heroku config:set EMAILJS_PUBLIC_KEY=sua_public_key
git push heroku main
```

### Variáveis de Ambiente Necessárias
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID  
- EMAILJS_PUBLIC_KEY
- EMAILJS_PRIVATE_KEY (opcional)
- PORT (automático)
EOF

echo "✅ Projeto preparado para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Commit e push para GitHub:"
echo "   git add ."
echo "   git commit -m 'Preparar para deploy'"
echo "   git push origin main"
echo ""
echo "2. Deploy no Railway:"
echo "   - Acesse https://railway.app"
echo "   - Login com GitHub"
echo "   - New Project → Deploy from GitHub"
echo "   - Selecione este repositório"
echo "   - Configure variáveis de ambiente"
echo ""
echo "3. URLs sugeridas para testar:"
echo "   https://railway.app (mais fácil)"
echo "   https://render.com (alternativa)"
echo "   https://vercel.com (serverless)"
echo ""
echo "🌐 Seu sistema estará online em minutos!"