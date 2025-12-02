const API_BASE = 'http://localhost:3000/api';
let usuarioLogado = null;

// FUNÇÃO ESSENCIAL QUE ESTAVA FALTANDO!
function mudarTela(novaTela) {
    console.log('🔄 Mudando para tela:', novaTela);
    
    // Esconder todas as telas
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    
    // Mostrar nova tela
    const telaAlvo = document.getElementById(`tela-${novaTela}`);
    if (telaAlvo) {
        telaAlvo.classList.add('ativa');
        console.log('✅ Tela mostrada:', novaTela);
    } else {
        console.error('❌ Tela não encontrada:', novaTela);
    }
}

// Gerenciamento de login
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Formulário de login enviado');
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    console.log('🔐 Tentando login com:', { email, senha });
    await fazerLogin(email, senha);
});

document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Formulário de cadastro enviado');
    
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;
    const tipo_perfil = document.getElementById('cadastro-perfil').value;
    
    await fazerCadastro(nome, email, senha, tipo_perfil);
});

async function fazerLogin(email, senha) {
    try {
        console.log('🌐 Enviando requisição de login para:', `${API_BASE}/login`);
        
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });

        console.log('📨 Status da resposta:', response.status);

        const data = await response.json();
        console.log('📊 Dados da resposta:', data);

        if (response.ok) {
            usuarioLogado = data.usuario;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            console.log('✅ Login bem-sucedido! Usuário:', usuarioLogado);
            alert('✅ Login realizado com sucesso!');
            mostrarTelaSeletora();
        } else {
            console.error('❌ Erro no login:', data.error);
            alert('❌ Erro: ' + data.error);
        }
    } catch (error) {
        console.error('💥 Erro no login:', error);
        alert('❌ Erro ao conectar com o servidor. Verifique se o servidor está rodando.');
    }
}

async function fazerCadastro(nome, email, senha, tipo_perfil) {
    try {
        console.log('🌐 Enviando cadastro...');
        
        const response = await fetch(`${API_BASE}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha, tipo_perfil })
        });

        const data = await response.json();
        console.log('Resposta do cadastro:', data);

        if (response.ok) {
            usuarioLogado = data.usuario;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            alert('✅ Conta criada com sucesso!');
            mostrarTelaSeletora();
        } else {
            alert('❌ Erro: ' + data.error);
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function mostrarLogin() {
    console.log('👤 Mostrando tela de login');
    mudarTela('login');
}

function mostrarCadastro() {
    console.log('📝 Mostrando tela de cadastro');
    mudarTela('cadastro');
}

function mostrarTelaSeletora() {
    console.log('🎯 Mostrando tela seletora para:', usuarioLogado?.nome);
    mudarTela('seletora');
    
    // Aqui você pode carregar conteúdo específico baseado no perfil
    if (usuarioLogado) {
        console.log('👤 Usuário logado:', usuarioLogado);
        // Futuramente: carregar telas específicas baseadas no tipo_perfil
    }
}

function preencherDemo(email, senha) {
    console.log('🎪 Preenchendo demo:', email);
    document.getElementById('login-email').value = email;
    document.getElementById('login-senha').value = senha;
}

function fazerLogout() {
    console.log('🚪 Fazendo logout');
    usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    mudarTela('login');
}

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Página carregada - Verificando autenticação...');
    
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        usuarioLogado = JSON.parse(usuarioSalvo);
        console.log('🔑 Usuário já logado:', usuarioLogado.nome);
        mostrarTelaSeletora();
    } else {
        console.log('🔒 Nenhum usuário logado - Mostrando login');
        mostrarLogin();
    }
    
    console.log('✅ Auth.js carregado completamente');
});