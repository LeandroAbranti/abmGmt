const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001/api';

// Cliente de teste para as rotas da API
class ABMApiClient {
    constructor(baseUrl = API_BASE) {
        this.baseUrl = baseUrl;
    }

    // 1. Solicitar token
    async solicitarToken(identificador) {
        try {
            const response = await axios.post(`${this.baseUrl}/solicitar-token`, {
                identificador
            });
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }

    // 2. Solicitar token com email (primeiro acesso)
    async solicitarTokenEmail(matricula, email) {
        try {
            const response = await axios.post(`${this.baseUrl}/solicitar-token-email`, {
                matricula,
                email
            });
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }

    // 3. Validar token
    async validarToken(token) {
        try {
            const response = await axios.post(`${this.baseUrl}/validar-token`, {
                token
            });
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }

    // 4. Criar senha
    async criarSenha(token, senha) {
        try {
            const response = await axios.post(`${this.baseUrl}/criar-senha`, {
                token,
                senha
            });
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }

    // 5. Login
    async login(token, senha) {
        try {
            const response = await axios.post(`${this.baseUrl}/login`, {
                token,
                senha
            });
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }

    // 6. Status
    async status() {
        try {
            const response = await axios.get(`${this.baseUrl}/status`);
            return response.data;
        } catch (error) {
            return error.response?.data || { success: false, message: error.message };
        }
    }
}

// Função de teste
async function testarAPI() {
    const client = new ABMApiClient();

    console.log('🧪 Testando API ABM Backend...\n');

    // 1. Testar status
    console.log('1️⃣ Testando status da API...');
    const status = await client.status();
    console.log('   Resultado:', status);
    console.log('');

    // 2. Testar solicitação de token para matrícula admin
    console.log('2️⃣ Testando solicitação de token (matrícula 257)...');
    const tokenRequest = await client.solicitarTokenEmail('257', 'admin@test.com');
    console.log('   Resultado:', tokenRequest);
    console.log('');

    // 3. Testar validação de token inválido
    console.log('3️⃣ Testando validação de token inválido...');
    const tokenInvalido = await client.validarToken('000000');
    console.log('   Resultado:', tokenInvalido);
    console.log('');

    // 4. Testar solicitação com matrícula não autorizada
    console.log('4️⃣ Testando matrícula não autorizada...');
    const matriculaInvalida = await client.solicitarToken('999');
    console.log('   Resultado:', matriculaInvalida);
    console.log('');

    console.log('✅ Testes básicos concluídos!');
    console.log('💡 Para testar o fluxo completo, você precisa do EmailJS configurado.');
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    // Verificar se o servidor está rodando
    axios.get(`${API_BASE}/status`)
        .then(() => {
            testarAPI();
        })
        .catch(() => {
            console.log('❌ Servidor não está rodando!');
            console.log('💡 Execute: npm start');
        });
}

module.exports = ABMApiClient;