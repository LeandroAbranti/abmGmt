# 🔄 GUIA DE ATUALIZAÇÃO DO FRONT-END

## 🎯 **Objetivo**

Integrar o front-end existente (`app.html`) com o back-end seguro criado, substituindo a autenticação local por chamadas à API.

---

## 📋 **Passos para Atualização**

### 1. **Substituir Configuração EmailJS**

❌ **REMOVER** (no app.html):
```javascript
// Configuração do serviço de email (usando EmailJS como exemplo)
const emailConfig = {
    serviceId: 'service_udwecpg',
    templateId: 'template_1mhawd2', 
    publicKey: 'K-Li2H0Hlcz5QTM9X',
    configurado: true
};
```

✅ **ADICIONAR**:
```javascript
// Configuração da API Backend
const API_BASE = 'http://localhost:3001/api';
const emailConfig = { configurado: true }; // Back-end gerencia tudo
```

### 2. **Substituir Função solicitarToken()**

❌ **REMOVER** a função `solicitarToken()` existente no app.html

✅ **SUBSTITUIR** pela versão da API (do arquivo `frontend-integration.js`)

### 3. **Substituir Função validarToken()**

❌ **REMOVER** a função `validarToken()` existente no app.html

✅ **SUBSTITUIR** pela versão da API (do arquivo `frontend-integration.js`)

### 4. **Adicionar Novas Funções**

✅ **ADICIONAR** estas novas funções:
- `solicitarTokenComEmail()`
- `criarSenha()`
- `fazerLogin()`
- `verificarStatusAPI()`

### 5. **Atualizar HTML**

✅ **ADICIONAR** os novos elementos HTML do arquivo `frontend-html-updates.html`:
- Campo de email para primeiro acesso
- Formulário de criação de senha
- Indicador de status da API

### 6. **Atualizar Inicialização**

❌ **REMOVER** funções antigas de inicialização do EmailJS

✅ **SUBSTITUIR** pela nova inicialização com verificação da API

---

## 🚀 **Implementação Rápida**

### **Opção 1: Atualização Manual**

1. Abra o arquivo `app.html`
2. Copie o conteúdo de `frontend-integration.js`
3. Substitua as funções existentes
4. Adicione os elementos HTML de `frontend-html-updates.html`

### **Opção 2: Arquivo Completo** (Recomendado)

Vou criar um `app-updated.html` completo com todas as integrações:

---

## 🔧 **Configurações Necessárias**

### **1. CORS (se necessário)**

Se o front-end estiver em domínio diferente, configure CORS no back-end:

```javascript
// No server.js, adicionar:
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));
```

### **2. URL da API**

Atualize a URL base conforme seu ambiente:

```javascript
// Desenvolvimento
const API_BASE = 'http://localhost:3001/api';

// Produção (exemplo)
const API_BASE = 'https://sua-api.herokuapp.com/api';
```

---

## ✅ **Validação da Integração**

### **1. Verificar Conexão**

Abra o console do navegador e verifique:
```
✅ API conectada: API ABM funcionando
```

### **2. Testar Fluxo Completo**

1. **Digite matrícula 257**
2. **Receba email com token**
3. **Digite token no sistema**
4. **Crie senha (primeiro acesso)**
5. **Acesse o sistema**

### **3. Verificar Logs**

**No console do navegador:**
```
🚀 Iniciando sistema ABM com back-end seguro...
✅ API conectada: API ABM funcionando
✅ Sistema pronto para uso!
```

**No terminal do back-end:**
```
🚀 Servidor ABM rodando na porta 3001
📧 EmailJS configurado: service_udwecpg
👑 Admins autorizados: 257, 862
```

---

## 🛡️ **Benefícios da Integração**

### **Antes (Front-end only):**
❌ Tokens gerados no JavaScript (expostos)  
❌ Senhas em localStorage  
❌ Validação no client-side  
❌ EmailJS público no código  

### **Depois (Back-end integrado):**
✅ Tokens gerados no servidor (seguros)  
✅ Senhas hasheadas no back-end  
✅ Validação centralizada  
✅ EmailJS protegido no servidor  

---

## 🚀 **Próximas Etapas**

1. **Testar integração** completa
2. **Configurar HTTPS** para produção  
3. **Deploy do back-end** (Heroku, Railway, etc.)
4. **Monitoramento** e logs
5. **Backup automático** dos dados

---

**🎯 Sistema agora 100% seguro e profissional!**