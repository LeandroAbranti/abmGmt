const express = require('express');
const cors = require('cors');
const crypto = require('crypto-js');
const emailjs = require('@emailjs/nodejs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração EmailJS
const EMAILJS_CONFIG = {
    serviceId: process.env.EMAILJS_SERVICE_ID || 'service_udwecpg',
    templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_1mhawd2',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || 'K-Li2H0Hlcz5QTM9X',
    privateKey: process.env.EMAILJS_PRIVATE_KEY || ''
};

// Armazenamento em memória (em produção usar banco de dados)
const tokens = new Map(); // { token: { matricula, email, expires, tentativas } }
const usuarios = new Map(); // { matricula: { nome, email, senha, isAdmin, ativo } }

// Matrículas autorizadas
const matriculasAutorizadas = {
    '257': { isAdmin: true, nome: 'Administrador 1' },
    '862': { isAdmin: true, nome: 'Administrador 2' },
    '100': { isAdmin: false, nome: 'Operador 1' },
    '101': { isAdmin: false, nome: 'Operador 2' }
};

// Função auxiliar para gerar token
function gerarToken() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

// Função auxiliar para hash SHA256
function hashSenha(senha) {
    return crypto.SHA256(senha).toString();
}

// Função auxiliar para verificar se matrícula é admin
function isMatriculaAdmin(matricula) {
    const config = matriculasAutorizadas[matricula];
    return config && config.isAdmin === true;
}

// Função auxiliar para validar email
function isEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função auxiliar para enviar email
async function enviarEmail(email, token) {
    try {
        const templateParams = {
            to_email: email,
            token: token
        };

        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            {
                publicKey: EMAILJS_CONFIG.publicKey,
                privateKey: EMAILJS_CONFIG.privateKey
            }
        );

        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return { success: false, error: error.message };
    }
}

// Função para limpar tokens expirados
function limparTokensExpirados() {
    const agora = Date.now();
    for (const [token, data] of tokens.entries()) {
        if (data.expires < agora) {
            tokens.delete(token);
        }
    }
}

// Executar limpeza a cada 5 minutos
setInterval(limparTokensExpirados, 5 * 60 * 1000);

// ROTAS

// 1. Solicitar token de acesso
app.post('/api/solicitar-token', async (req, res) => {
    try {
        const { identificador } = req.body; // pode ser matrícula ou email

        if (!identificador || identificador.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Matrícula ou email é obrigatório'
            });
        }

        let matricula = '';
        let email = '';

        // Verificar se é email ou matrícula
        if (isEmailValido(identificador)) {
            // É um email - buscar usuário por email
            let usuarioEncontrado = null;
            for (const [mat, usuario] of usuarios.entries()) {
                if (usuario.email === identificador) {
                    usuarioEncontrado = { matricula: mat, ...usuario };
                    break;
                }
            }

            if (!usuarioEncontrado) {
                return res.status(404).json({
                    success: false,
                    message: 'Email não encontrado no sistema'
                });
            }

            matricula = usuarioEncontrado.matricula;
            email = identificador;
        } else {
            // É uma matrícula
            matricula = identificador;

            // Verificar se matrícula é autorizada
            if (!matriculasAutorizadas[matricula]) {
                return res.status(403).json({
                    success: false,
                    message: 'Matrícula não autorizada no sistema'
                });
            }

            // Buscar email do usuário ou usar configuração padrão
            const usuario = usuarios.get(matricula);
            if (usuario && usuario.email) {
                email = usuario.email;
            } else {
                // Primeiro acesso - solicitar email
                return res.status(200).json({
                    success: true,
                    primeiroAcesso: true,
                    message: 'Matrícula válida. Informe seu email para receber o token.',
                    matricula: matricula
                });
            }
        }

        // Limpar tokens expirados
        limparTokensExpirados();

        // Gerar novo token
        const token = gerarToken();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutos

        // Salvar token
        tokens.set(token, {
            matricula,
            email,
            expires,
            tentativas: 0
        });

        // Enviar email
        const resultadoEmail = await enviarEmail(email, token);

        if (!resultadoEmail.success) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar email. Tente novamente.',
                erro: resultadoEmail.error
            });
        }

        res.json({
            success: true,
            message: `Token enviado para ${email}`,
            matricula: matricula
        });

    } catch (error) {
        console.error('Erro em solicitar-token:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// 2. Solicitar token com email (para primeiro acesso)
app.post('/api/solicitar-token-email', async (req, res) => {
    try {
        const { matricula, email } = req.body;

        if (!matricula || !email) {
            return res.status(400).json({
                success: false,
                message: 'Matrícula e email são obrigatórios'
            });
        }

        // Verificar se matrícula é autorizada
        if (!matriculasAutorizadas[matricula]) {
            return res.status(403).json({
                success: false,
                message: 'Matrícula não autorizada no sistema'
            });
        }

        // Validar email
        if (!isEmailValido(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        // Limpar tokens expirados
        limparTokensExpirados();

        // Gerar novo token
        const token = gerarToken();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutos

        // Salvar token
        tokens.set(token, {
            matricula,
            email,
            expires,
            tentativas: 0
        });

        // Enviar email
        const resultadoEmail = await enviarEmail(email, token);

        if (!resultadoEmail.success) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar email. Tente novamente.',
                erro: resultadoEmail.error
            });
        }

        res.json({
            success: true,
            message: `Token enviado para ${email}`,
            matricula: matricula
        });

    } catch (error) {
        console.error('Erro em solicitar-token-email:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// 3. Validar token
app.post('/api/validar-token', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token é obrigatório'
            });
        }

        // Limpar tokens expirados
        limparTokensExpirados();

        const dadosToken = tokens.get(token);

        if (!dadosToken) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        // Verificar se expirou
        if (dadosToken.expires < Date.now()) {
            tokens.delete(token);
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        // Incrementar tentativas
        dadosToken.tentativas++;

        // Verificar limite de tentativas (máximo 5)
        if (dadosToken.tentativas > 5) {
            tokens.delete(token);
            return res.status(429).json({
                success: false,
                message: 'Muitas tentativas. Solicite um novo token.'
            });
        }

        // Token válido - verificar se usuário já tem senha
        const usuario = usuarios.get(dadosToken.matricula);
        const temSenha = usuario && usuario.senha;

        res.json({
            success: true,
            matricula: dadosToken.matricula,
            email: dadosToken.email,
            temSenha: !!temSenha,
            isAdmin: isMatriculaAdmin(dadosToken.matricula),
            message: temSenha ? 'Token válido' : 'Token válido. Defina sua senha.'
        });

    } catch (error) {
        console.error('Erro em validar-token:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// 4. Criar senha (primeiro acesso)
app.post('/api/criar-senha', (req, res) => {
    try {
        const { token, senha } = req.body;

        if (!token || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Token e senha são obrigatórios'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Senha deve ter pelo menos 6 caracteres'
            });
        }

        // Limpar tokens expirados
        limparTokensExpirados();

        const dadosToken = tokens.get(token);

        if (!dadosToken) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        // Verificar se expirou
        if (dadosToken.expires < Date.now()) {
            tokens.delete(token);
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        // Criar/atualizar usuário
        const config = matriculasAutorizadas[dadosToken.matricula];
        usuarios.set(dadosToken.matricula, {
            nome: config.nome,
            email: dadosToken.email,
            senha: hashSenha(senha),
            isAdmin: config.isAdmin,
            ativo: true,
            criadoEm: new Date(),
            primeiroAcesso: false
        });

        // Remover token usado
        tokens.delete(token);

        res.json({
            success: true,
            message: 'Senha criada com sucesso',
            matricula: dadosToken.matricula,
            isAdmin: config.isAdmin
        });

    } catch (error) {
        console.error('Erro em criar-senha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// 5. Login com senha
app.post('/api/login', (req, res) => {
    try {
        const { token, senha } = req.body;

        if (!token || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Token e senha são obrigatórios'
            });
        }

        // Limpar tokens expirados
        limparTokensExpirados();

        const dadosToken = tokens.get(token);

        if (!dadosToken) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        // Verificar se expirou
        if (dadosToken.expires < Date.now()) {
            tokens.delete(token);
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        // Buscar usuário
        const usuario = usuarios.get(dadosToken.matricula);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (!usuario.ativo) {
            return res.status(403).json({
                success: false,
                message: 'Usuário inativo'
            });
        }

        // Verificar senha
        const senhaHash = hashSenha(senha);
        if (usuario.senha !== senhaHash) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta'
            });
        }

        // Remover token usado
        tokens.delete(token);

        // Login bem-sucedido
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            usuario: {
                matricula: dadosToken.matricula,
                nome: usuario.nome,
                email: usuario.email,
                isAdmin: usuario.isAdmin
            }
        });

    } catch (error) {
        console.error('Erro em login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// 6. Status do sistema
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'API ABM funcionando',
        timestamp: new Date(),
        tokensAtivos: tokens.size,
        usuariosCadastrados: usuarios.size
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ABM rodando na porta ${PORT}`);
    console.log(`📧 EmailJS configurado: ${EMAILJS_CONFIG.serviceId}`);
    console.log(`👑 Admins autorizados: 257, 862`);
});

module.exports = app;