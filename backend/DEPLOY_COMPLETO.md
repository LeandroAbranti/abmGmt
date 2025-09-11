# 🌐 GUIA COMPLETO DE DEPLOY

## 🎯 **RECOMENDAÇÃO: Railway.app**

**Por que Railway?**
- ✅ **Gratuito** para projetos pequenos
- ✅ **Deploy automático** do GitHub
- ✅ **HTTPS** incluído
- ✅ **Fácil configuração**
- ✅ **Suporte Node.js nativo**

---

## 🚀 **PASSO A PASSO - Railway**

### **1. Preparar Código (✅ JÁ FEITO)**
```bash
# Já executado pelo script
✅ package.json atualizado
✅ .env.example criado
✅ Procfile configurado
✅ .gitignore atualizado
```

### **2. Subir para GitHub**
```bash
# No terminal:
git add .
git commit -m "Deploy: Backend pronto para produção"
git push origin main
```

### **3. Deploy no Railway**

#### **3.1 Acessar Railway**
- 🌐 **Acesse**: https://railway.app
- 🔑 **Login** com sua conta GitHub
- 🆕 **Clique**: "New Project"

#### **3.2 Conectar Repositório**
- 📂 **Escolha**: "Deploy from GitHub repo"
- 🔍 **Selecione**: `abmGmt` (seu repositório)
- 📁 **Configure**: `/backend` como pasta raiz

#### **3.3 Configurar Variáveis**
No Railway Dashboard → Settings → Environment:
```env
EMAILJS_SERVICE_ID=service_udwecpg
EMAILJS_TEMPLATE_ID=template_1mhawd2
EMAILJS_PUBLIC_KEY=K-Li2H0Hlcz5QTM9X
NODE_ENV=production
```

#### **3.4 Deploy Automático**
- ⚡ Railway detecta Node.js automaticamente
- 🚀 Deploy inicia em segundos
- 🌐 URL gerada: `https://seu-projeto.railway.app`

---

## 🌐 **ALTERNATIVAS DE DEPLOY**

### **🥈 Render.com**
```bash
1. Acesse render.com
2. Connect GitHub
3. New Web Service
4. Configure: 
   - Build: npm install
   - Start: npm start
   - Port: 3001
```

### **🥉 Vercel (Serverless)**
```bash
1. npm install -g vercel
2. vercel login
3. vercel --prod
4. Configure variáveis no dashboard
```

### **💰 Heroku (Pago)**
```bash
1. heroku create abm-sistema
2. heroku config:set EMAILJS_SERVICE_ID=service_udwecpg
3. git push heroku main
```

---

## 🔧 **CONFIGURAÇÃO DO FRONT-END**

### **Após Deploy, Atualizar URL da API:**

```javascript
// No app-updated.html, linha ~47:
const API_BASE = 'https://SEU-PROJETO.railway.app/api';

// Exemplo:
const API_BASE = 'https://abm-backend-production.railway.app/api';
```

### **Opções para Hospedar Front-end:**

#### **1. GitHub Pages (Gratuito)**
```bash
1. Copie app-updated.html para pasta docs/
2. Renomeie para index.html
3. GitHub Settings → Pages → Enable
4. URL: https://SEU-USUARIO.github.io/abmGmt
```

#### **2. Netlify (Gratuito)**
```bash
1. Arraste app-updated.html para netlify.com
2. URL gerada automaticamente
3. HTTPS incluído
```

#### **3. Vercel (Gratuito)**
```bash
1. vercel --prod (com app-updated.html)
2. Deploy instantâneo
```

---

## 📊 **CUSTOS ESTIMADOS**

| Plataforma | Gratuito | Pago | Ideal Para |
|------------|----------|------|------------|
| **Railway** | ✅ 500h/mês | $5/mês | Projetos pequenos/médios |
| **Render** | ✅ 750h/mês | $7/mês | Startups |
| **Vercel** | ✅ Ilimitado | $20/mês | Empresas |
| **Heroku** | ❌ | $7/mês | Projetos tradicionais |
| **DigitalOcean** | ❌ | $6/mês | VPS completo |

---

## 🛡️ **SEGURANÇA EM PRODUÇÃO**

### **✅ Implementado:**
- HTTPS automático
- Variáveis de ambiente
- Hash SHA256 das senhas
- Tokens temporários
- CORS configurado

### **🔒 Recomendações Extras:**
```javascript
// Adicionar ao server.js:
app.use(helmet()); // Segurança extra
app.use(rateLimit({ // Rate limiting
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests
}));
```

---

## 🧪 **TESTE DE PRODUÇÃO**

### **1. Verificar API:**
```bash
curl https://seu-projeto.railway.app/api/status
```

### **2. Testar Login:**
1. Abra front-end hospedado
2. Digite matrícula 257 ou 862
3. Verifique email
4. Complete o login

### **3. Monitorar Logs:**
- Railway Dashboard → Logs
- Verificar erros em tempo real

---

## 🎯 **RESUMO EXECUTIVO**

### **✅ RECOMENDAÇÃO FINAL:**

1. **Back-end**: Railway.app (gratuito, fácil)
2. **Front-end**: GitHub Pages ou Netlify
3. **Domínio**: Opcional - pode comprar depois

### **⏱️ TEMPO ESTIMADO:**
- **Setup inicial**: 15 minutos
- **Deploy back-end**: 5 minutos  
- **Deploy front-end**: 2 minutos
- **Configuração final**: 8 minutos
- **TOTAL**: ~30 minutos

### **💰 CUSTO TOTAL:**
- **Desenvolvimento**: GRATUITO
- **Hospedagem**: GRATUITO (Railway + GitHub Pages)
- **Domínio**: ~$10/ano (opcional)

---

**🚀 SEU SISTEMA ESTARÁ ONLINE EM MENOS DE 1 HORA!**

**🌐 URL exemplo final**: `https://abm-sistema.railway.app`

Quer que eu te ajude com algum passo específico do deploy?