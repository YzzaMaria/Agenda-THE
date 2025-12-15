const API_BASE = 'http://localhost:3000/api';
let usuarioLogado = null;

// FUNÇÃO CENTRAL PARA MUDAR TELAS
function mudarTela(novaTela) {
    console.log('🔄 Mudando para tela:', novaTela);

    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });

    const telaAlvo = document.getElementById(`tela-${novaTela}`);
    
    if (telaAlvo) {
        telaAlvo.classList.add('ativa');
        console.log('✅ Tela mostrada:', novaTela);

        if (novaTela === 'usuario-final') {
            inicializarTelaUsuarioFinal();
        }
    } else {
        console.error('❌ Tela não encontrada:', novaTela);
    }

    switch(novaTela) {
        case 'usuario-final':
            if (typeof inicializarUsuarioFinal === 'function') inicializarUsuarioFinal();
            break;
        case 'produtor':
            if (typeof inicializarProdutor === 'function') inicializarProdutor();
            break;
        case 'curador':
            if (typeof inicializarCurador === 'function') inicializarCurador();
            break;
        case 'parceiro':
            if (typeof inicializarParceiro === 'function') inicializarParceiro();
            break;
    }
}

// ==================== AUTENTICAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Página carregada - Verificando autenticação...');

    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Formulário de login enviado');
            
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            
            console.log('🔐 Tentando login com:', { email });
            await fazerLogin(email, senha);
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Formulário de cadastro enviado');
            
            const nome = document.getElementById('cadastro-nome').value;
            const email = document.getElementById('cadastro-email').value;
            const senha = document.getElementById('cadastro-senha').value;
            const tipo_perfil = document.getElementById('cadastro-perfil').value;
            
            await fazerCadastro(nome, email, senha, tipo_perfil);
        });
    }

    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    
    if (usuarioSalvo) {
        usuarioLogado = JSON.parse(usuarioSalvo);
        console.log('🔑 Usuário já logado:', usuarioLogado.nome);
        mudarTela('seletora');
    } else {
        console.log('🔒 Nenhum usuário logado - Mostrando login');
        mudarTela('login');
    }
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
            mudarTela('seletora');
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
            mudarTela('seletora');
        } else {
            alert('❌ Erro: ' + data.error);
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// ==================== NAVEGAÇÃO ENTRE TELAS ====================
function mostrarLogin() {
    console.log('👤 Mostrando tela de login');
    mudarTela('login');
}

function mostrarCadastro() {
    console.log('📝 Mostrando tela de cadastro');
    mudarTela('cadastro');
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

function voltarParaSeletor() {
    console.log('↩️ Voltando para seletor');
    mudarTela('seletora');
}

// ==================== ENTRAR EM PERFIS ====================
function entrarComoUsuarioFinal() {
    console.log('🎯 Entrando como Usuário Final');
    mudarTela('usuario-final');
}

function entrarComoProdutor() {
    console.log('📅 Entrando como Produtor');
    mudarTela('produtor');
}

function entrarComoCurador() {
    console.log('✅ Entrando como Curador');
    mudarTela('curador');
}

function entrarComoParceiro() {
    console.log('💰 Entrando como Parceiro');
    mudarTela('parceiro');
}

// ==================== FUNÇÕES DA TELA USUÁRIO FINAL ====================
function inicializarTelaUsuarioFinal() {
    console.log('📱 Inicializando tela do usuário final...');
    
    if (typeof inicializarUsuarioFinal === 'function') {
        console.log('📡 Usando módulo específico do usuário');
        inicializarUsuarioFinal();
    } else {
        console.log('📡 Carregando conteúdo básico');
        carregarEventosBasicos();
    }
}

async function carregarEventosBasicos() {
    try {
        console.log('📡 Tentando carregar eventos da API...');
        const response = await fetch(`${API_BASE}/eventos`);
        
        if (response.ok) {
            const eventos = await response.json();
            exibirEventos(eventos);
        } else {
            throw new Error('API não respondeu');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        exibirEventosDemo();
    }
}

function exibirEventos(eventos) {
    const container = document.getElementById('lista-eventos-usuario');
    
    if (!container) {
        console.error('❌ Container de eventos não encontrado');
        return;
    }

    if (!eventos || eventos.length === 0) {
        container.innerHTML = '<p class="sem-eventos">Nenhum evento encontrado</p>';
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card">
            <div class="evento-imagem" style="background: linear-gradient(135deg, 
                #${Math.floor(Math.random()*16777215).toString(16)},
                #${Math.floor(Math.random()*16777215).toString(16)})">
                ${evento.destaque ? '<span class="evento-destaque">Destaque</span>' : ''}
            </div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">${evento.titulo || 'Evento'}</div>
                        <span class="evento-categoria">${evento.categoria || 'Geral'}</span>
                    </div>
                    <span class="evento-favorito">🤍</span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 ${evento.data_evento || 'Data não informada'}</div>
                    <div class="evento-local">📍 ${evento.local || 'Local não informado'}</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}</div>
                    <button class="btn btn-primary" onclick="verDetalhesEvento('${evento.id || 0}')">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    console.log(`✅ ${eventos.length} eventos exibidos`);
}

function exibirEventosDemo() {
    const container = document.getElementById('lista-eventos-usuario');
    if (!container) return;

    container.innerHTML = `
        <div class="evento-card">
            <div class="evento-imagem" style="background: linear-gradient(135deg, #9333ea, #ec4899)">
                <span class="evento-destaque">Destaque</span>
            </div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">Festival de Jazz</div>
                        <span class="evento-categoria">Música</span>
                    </div>
                    <span class="evento-favorito">🤍</span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 15 Nov 2024 • 20:00</div>
                    <div class="evento-local">📍 Parque da Cidade</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">R$ 50,00</div>
                    <button class="btn btn-primary" onclick="verDetalhesEvento('demo1')">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
        <div class="evento-card">
            <div class="evento-imagem" style="background: linear-gradient(135deg, #4f46e5, #6366f1)">
                <span class="evento-destaque">Popular</span>
            </div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">Exposição de Arte Moderna</div>
                        <span class="evento-categoria">Arte</span>
                    </div>
                    <span class="evento-favorito">🤍</span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 20 Nov 2024 • 14:00</div>
                    <div class="evento-local">📍 Museu de Arte</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">R$ 30,00</div>
                    <button class="btn btn-primary" onclick="verDetalhesEvento('demo2')">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `;

    console.log('✅ Eventos demo exibidos');
}

function verDetalhesEvento(eventoId) {
    alert(`Detalhes do evento ID: ${eventoId}\n\nEsta funcionalidade será implementada em breve!`);
}

// ==================== FUNÇÕES AUXILIARES ====================
function mudarParaHomeUsuario() {
    console.log('🏠 Mudando para Home');
}

function mudarParaBuscaUsuario() {
    console.log('🔍 Mudando para Busca');
}

function mudarParaFavoritosUsuario() {
    console.log('❤️ Mudando para Favoritos');
}

function mudarParaPerfilUsuario() {
    console.log('👤 Mudando para Perfil');
}

function mostrarNotificacoes() {
    console.log('🔔 Mostrando notificações');
    alert('Notificações:\n\n• Novo evento adicionado\n• Seu ingresso foi confirmado\n• Promoção especial disponível');
}

console.log('✅ Auth.js carregado completamente');

// ==================== FUNÇÕES DE NAVEGAÇÃO PARA TELAS SECUNDÁRIAS ====================
window.mudarParaPerfilUsuario = function() {
    console.log('👤 Navegando para perfil do usuário');
    
    if (typeof abrirPerfilUsuario === 'function') {
        abrirPerfilUsuario();
    } else {
        alert('Funcionalidade de perfil em desenvolvimento!');
    }
};

window.mudarParaFavoritosUsuario = function() {
    console.log('❤️ Navegando para favoritos');
    
    if (typeof abrirFavoritos === 'function') {
        abrirFavoritos();
    } else {
        alert('Funcionalidade de favoritos em desenvolvimento!');
    }
};

if (typeof window.mostrarNotificacoes !== 'function') {
    window.mostrarNotificacoes = function() {
        alert('🔔 Notificações:\n\n• Novo evento adicionado\n• Promoção especial disponível\n• Seu check-in foi confirmado');
    };
}

if (typeof window.mostrarToast !== 'function') {
    window.mostrarToast = function(mensagem) {
        const toast = document.createElement('div');
        toast.className = 'toast-mensagem';
        toast.textContent = mensagem;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #334155;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        `;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    };
}