# 🚀 ABM Backend - API de Autenticação

API Node.js Express para sistema de autenticação ABM com tokens por email.

## 🔧 **Tecnologias**

- **Node.js** + **Express** - Servidor web
- **EmailJS** - Envio de emails
- **Crypto-JS** - Hash SHA256 das senhas
- **CORS** - Comunicação com front-end

## 📡 **Rotas da API**

### 🔐 **Autenticação**

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/solicitar-token` | Solicita token de acesso (matrícula ou email) |
| POST | `/api/solicitar-token-email` | Solicita token com email (primeiro acesso) |
| POST | `/api/validar-token` | Valida token recebido por email |
| POST | `/api/criar-senha` | Cria senha no primeiro acesso |
| POST | `/api/login` | Login com token + senha |
| GET | `/api/status` | Status da API |

### 📋 **Exemplos de Uso**

#### 1. Solicitar Token
```javascript
POST /api/solicitar-token
{
  "identificador": "257" // ou email
}
```

#### 2. Validar Token
```javascript
POST /api/validar-token
{
  "token": "123456"
}
```

#### 3. Criar Senha
```javascript
POST /api/criar-senha
{
  "token": "123456",
  "senha": "minhasenha123"
}
```

#### 4. Login
```javascript
POST /api/login
{
  "token": "123456",
  "senha": "minhasenha123"
}
```

## 🚀 **Como Executar**

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Configurar EmailJS**
Edite o arquivo `.env`:
```env
EMAILJS_SERVICE_ID=seu_service_id
EMAILJS_TEMPLATE_ID=seu_template_id
EMAILJS_PUBLIC_KEY=sua_public_key
EMAILJS_PRIVATE_KEY=sua_private_key
```

### 3. **Iniciar Servidor**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3001`

## 👑 **Administradores**

Matrículas com acesso administrativo:
- **257** - Administrador 1
- **862** - Administrador 2

## 🔒 **Segurança**

### ✅ **Implementado:**
- Hash SHA256 para senhas
- Tokens temporários (10 minutos)
- Limite de tentativas (5 máximo)
- Validação de entrada
- Limpeza automática de tokens expirados

### 🔄 **Fluxo de Autenticação:**
1. **Solicitar Token** → Email com código 6 dígitos
2. **Validar Token** → Verifica se código é válido
3. **Criar Senha** → Primeiro acesso define senha
4. **Login** → Autenticação com token + senha

## 🌐 **Integração com Front-end**

Para integrar com o front-end existente, atualize as URLs das requisições para:
```javascript
const API_BASE = 'http://localhost:3001/api';
```

## 📊 **Status da API**

Acesse `/api/status` para verificar:
- Status do servidor
- Tokens ativos
- Usuários cadastrados

## 🚀 **Próximos Passos**

- [ ] Implementar JWT para sessões
- [ ] Adicionar banco de dados (PostgreSQL/MongoDB)
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Testes automatizados
- [ ] Deploy para produção

---

**🎯 API segura e pronta para produção!**
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
