// ==== CONFIGURAÇÃO DA API ====
const API_BASE = 'http://localhost:3001/api';

// ==== FUNÇÕES DE API ATUALIZADAS ====

// Configuração do serviço de email (agora gerenciado pelo back-end)
const emailConfig = {
    configurado: true // Back-end gerencia tudo
};

// Função para solicitar token de acesso
async function solicitarToken() {
    const identificador = document.getElementById('matriculaEmail').value.trim();
    
    if (!identificador) {
        alert('Por favor, digite sua matrícula ou email.');
        return;
    }

    try {
        // Verificar primeiro se precisa de email (primeiro acesso)
        const response = await fetch(`${API_BASE}/solicitar-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identificador })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (result.primeiroAcesso) {
                // Primeiro acesso - solicitar email
                mostrarCampoEmail(result.matricula);
            } else {
                // Token enviado com sucesso
                mostrarMensagemSucesso(`Token enviado para ${result.message.split(' ').pop()}`);
                mostrarTelaToken(result.matricula);
            }
        } else {
            mostrarMensagemErro(result.message);
        }
    } catch (error) {
        console.error('Erro ao solicitar token:', error);
        mostrarMensagemErro('Erro de conexão com o servidor');
    }
}

// Função para solicitar token com email (primeiro acesso)
async function solicitarTokenComEmail() {
    const matricula = document.getElementById('matriculaOculta').value;
    const email = document.getElementById('emailPrimeiroAcesso').value.trim();
    
    if (!email) {
        alert('Por favor, digite seu email.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/solicitar-token-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagemSucesso(`Token enviado para ${email}`);
            esconderCampoEmail();
            mostrarTelaToken(result.matricula);
        } else {
            mostrarMensagemErro(result.message);
        }
    } catch (error) {
        console.error('Erro ao solicitar token com email:', error);
        mostrarMensagemErro('Erro de conexão com o servidor');
    }
}

// Função para validar token
async function validarToken() {
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token || token.length !== 6) {
        alert('Por favor, digite o token de 6 dígitos.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/validar-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Salvar dados temporários
            sessionStorage.setItem('tokenAtual', token);
            sessionStorage.setItem('matriculaAtual', result.matricula);
            sessionStorage.setItem('emailAtual', result.email);
            sessionStorage.setItem('isAdmin', result.isAdmin);
            
            if (result.temSenha) {
                // Usuário já tem senha - mostrar tela de login
                mostrarTelaSenha();
            } else {
                // Primeiro acesso - criar senha
                mostrarTelaCriarSenha();
            }
        } else {
            mostrarMensagemErro(result.message);
        }
    } catch (error) {
        console.error('Erro ao validar token:', error);
        mostrarMensagemErro('Erro de conexão com o servidor');
    }
}

// Função para criar senha (primeiro acesso)
async function criarSenha() {
    const senha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const token = sessionStorage.getItem('tokenAtual');
    
    if (!senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }
    
    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/criar-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, senha })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensagemSucesso('Senha criada com sucesso!');
            // Fazer login automático
            await fazerLogin(token, senha);
        } else {
            mostrarMensagemErro(result.message);
        }
    } catch (error) {
        console.error('Erro ao criar senha:', error);
        mostrarMensagemErro('Erro de conexão com o servidor');
    }
}

// Função para fazer login
async function fazerLogin(tokenParam = null, senhaParam = null) {
    const token = tokenParam || sessionStorage.getItem('tokenAtual');
    const senha = senhaParam || document.getElementById('senhaLogin').value;
    
    if (!senha) {
        alert('Por favor, digite sua senha.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, senha })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Login bem-sucedido
            usuarioAtual = {
                matricula: result.usuario.matricula,
                nome: result.usuario.nome,
                email: result.usuario.email,
                isAdmin: result.usuario.isAdmin,
                ativo: true
            };
            
            // Limpar dados temporários
            sessionStorage.clear();
            
            // Salvar sessão do usuário
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtual));
            
            mostrarMensagemSucesso(`Bem-vindo, ${usuarioAtual.nome}!`);
            mostrarSistema();
        } else {
            mostrarMensagemErro(result.message);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mostrarMensagemErro('Erro de conexão com o servidor');
    }
}

// Função para verificar status da API
async function verificarStatusAPI() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ API conectada:', result.message);
            return true;
        }
    } catch (error) {
        console.error('❌ API não disponível:', error);
        mostrarMensagemErro('Servidor não disponível. Verifique se o back-end está rodando.');
        return false;
    }
}

// ==== FUNÇÕES DE INTERFACE (AUXILIARES) ====

function mostrarCampoEmail(matricula) {
    document.getElementById('matriculaOculta').value = matricula;
    document.getElementById('campoEmailPrimeiroAcesso').style.display = 'block';
    document.getElementById('mensagemPrimeiroAcesso').style.display = 'block';
}

function esconderCampoEmail() {
    document.getElementById('campoEmailPrimeiroAcesso').style.display = 'none';
    document.getElementById('mensagemPrimeiroAcesso').style.display = 'none';
}

function mostrarTelaToken(matricula) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('tokenForm').style.display = 'block';
    document.getElementById('matriculaToken').textContent = matricula;
}

function mostrarTelaSenha() {
    document.getElementById('tokenForm').style.display = 'none';
    document.getElementById('senhaForm').style.display = 'block';
    document.getElementById('matriculaSenha').textContent = sessionStorage.getItem('matriculaAtual');
}

function mostrarTelaCriarSenha() {
    document.getElementById('tokenForm').style.display = 'none';
    document.getElementById('criarSenhaForm').style.display = 'block';
    document.getElementById('matriculaNovaSenha').textContent = sessionStorage.getItem('matriculaAtual');
}

function mostrarSistema() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('sistema').style.display = 'block';
    
    // Mostrar painel admin se for administrador
    if (usuarioAtual.isAdmin) {
        document.getElementById('adminPanel').classList.remove('hidden');
    }
    
    inicializarSistema();
}

function mostrarMensagemSucesso(mensagem) {
    // Implementar notificação de sucesso
    console.log('✅', mensagem);
    // Você pode criar um toast/notificação aqui
}

function mostrarMensagemErro(mensagem) {
    // Implementar notificação de erro
    console.error('❌', mensagem);
    alert(mensagem); // Temporário - substituir por notificação mais elegante
}

function voltarParaLogin() {
    // Limpar dados temporários
    sessionStorage.clear();
    
    // Resetar formulários
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('tokenForm').style.display = 'none';
    document.getElementById('senhaForm').style.display = 'none';
    document.getElementById('criarSenhaForm').style.display = 'none';
    esconderCampoEmail();
    
    // Limpar campos
    document.getElementById('matriculaEmail').value = '';
    document.getElementById('tokenInput').value = '';
    document.getElementById('senhaLogin').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';
}

// ==== INICIALIZAÇÃO ====

// Verificar API ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema ABM com back-end seguro...');
    
    // Verificar se API está disponível
    const apiDisponivel = await verificarStatusAPI();
    
    if (apiDisponivel) {
        console.log('✅ Sistema pronto para uso!');
    } else {
        console.log('⚠️  Sistema em modo offline - algumas funcionalidades podem não funcionar');
    }
    
    // Verificar se há usuário logado
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        try {
            usuarioAtual = JSON.parse(usuarioSalvo);
            mostrarSistema();
        } catch (error) {
            console.error('Erro ao recuperar usuário salvo:', error);
            localStorage.removeItem('usuarioLogado');
        }
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    sessionStorage.clear();
    usuarioAtual = null;
    
    document.getElementById('sistema').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminPanel').classList.add('hidden');
    
    voltarParaLogin();
}