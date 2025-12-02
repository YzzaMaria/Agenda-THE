
// Configurações da API
const API_BASE = '/api';

// Estado da aplicação
let estadoApp = {
    telaAtual: 'seletora',
    usuario: null,
    eventos: [],
    categorias: ['Todos', 'Música', 'Arte', 'Teatro', 'Gastronomia', 'Esportes'],
    categoriaAtiva: 'Todos'
};
async function testarConexaoAPI() {
    try {
        const response = await fetch(`${API_BASE}`);
        const data = await response.json();
        console.log('✅ API conectada:', data.message);
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com API:', error);
        
        // Dados de fallback para desenvolvimento
        estadoApp.eventos = [
            {
                id: 1,
                titulo: "Festival de Jazz",
                categoria: "música",
                data_evento: "2024-11-15",
                hora_evento: "20:00",
                local: "Parque da Cidade",
                preco: 50.00,
                descricao: "Um incrível festival de jazz com artistas locais e nacionais.",
                destaque: 1
            },
            {
                id: 2,
                titulo: "Exposição de Arte Moderna",
                categoria: "arte", 
                data_evento: "2024-11-20",
                hora_evento: "14:00",
                local: "Museu de Arte Contemporânea",
                preco: 30.00,
                descricao: "Exposição com obras de artistas contemporâneos renomados.",
                destaque: 1
            }
        ];
        
        estadoApp.usuario = {
            id: 1,
            nome: 'João Silva (Demo)',
            email: 'demo@email.com',
            pontos: 1250,
            nivel: 'Explorador'
        };
        
        return false;
    }
}

// Modifique a função carregarEventos para usar fallback
async function carregarEventos() {
    const apiFuncionando = await testarConexaoAPI();
    
    if (apiFuncionando) {
        try {
            const response = await fetch(`${API_BASE}/eventos`);
            const eventos = await response.json();
            estadoApp.eventos = eventos;
        } catch (error) {
            console.error('Erro ao carregar eventos da API, usando dados locais');
        }
    }
    
    exibirEventos(estadoApp.eventos);
}
// Funções de Navegação
function mudarTela(novaTela) {
    // Esconder todas as telas
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    
    // Mostrar nova tela
    document.getElementById(`tela-${novaTela}`).classList.add('ativa');
    estadoApp.telaAtual = novaTela;
    
    // Carregar dados específicos da tela
    if (novaTela === 'usuario-final') {
        carregarEventos();
        carregarCategorias();
    }
}

function mudarParaUsuarioFinal() {
    // Criar usuário temporário para demonstração
    estadoApp.usuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        pontos: 1250,
        nivel: 'Explorador'
    };
    mudarTela('usuario-final');
}

function mudarParaHome() {
    mudarTela('usuario-final');
}

function mudarParaPerfil() {
    if (estadoApp.usuario) {
        carregarPerfilUsuario();
        mudarTela('perfil-usuario');
    }
}

function mudarParaBusca() {
    alert('Funcionalidade de busca em desenvolvimento!');
}

function mudarParaFavoritos() {
    alert('Funcionalidade de favoritos em desenvolvimento!');
}

// Carregar Categorias
function carregarCategorias() {
    const container = document.getElementById('lista-categorias');
    if (!container) return;

    container.innerHTML = estadoApp.categorias.map(categoria => `
        <button class="categoria-btn ${categoria === estadoApp.categoriaAtiva ? 'ativa' : ''}" 
                onclick="filtrarPorCategoria('${categoria}')">
            ${categoria}
        </button>
    `).join('');
}

// Carregar Eventos
async function carregarEventos() {
    try {
        const response = await fetch(`${API_BASE}/eventos`);
        const eventos = await response.json();
        
        estadoApp.eventos = eventos;
        exibirEventos(eventos);
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        // Dados de fallback para demonstração
        exibirEventos([]);
    }
}

function exibirEventos(eventos) {
    const container = document.getElementById('lista-eventos');
    if (!container) return;

    if (eventos.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <p>Nenhum evento encontrado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card" onclick="abrirDetalhesEvento(${evento.id})">
            <div class="evento-imagem">
                ${evento.destaque ? '<span class="evento-destaque">🔥 Destaque</span>' : ''}
            </div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">${evento.titulo}</div>
                        <span class="evento-categoria">${evento.categoria}</span>
                    </div>
                    <span class="evento-favorito" onclick="event.stopPropagation(); toggleFavorito(this)">🤍</span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 ${formatarData(evento.data_evento)} • ${evento.hora_evento}</div>
                    <div class="evento-local">📍 ${evento.local}</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">R$ ${evento.preco.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); abrirDetalhesEvento(${evento.id})">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filtrar Eventos por Categoria
function filtrarPorCategoria(categoria) {
    estadoApp.categoriaAtiva = categoria;
    carregarCategorias();
    
    if (categoria === 'Todos') {
        exibirEventos(estadoApp.eventos);
    } else {
        const eventosFiltrados = estadoApp.eventos.filter(evento => 
            evento.categoria.toLowerCase() === categoria.toLowerCase()
        );
        exibirEventos(eventosFiltrados);
    }
}

// Abrir Detalhes do Evento
async function abrirDetalhesEvento(eventoId) {
    try {
        const response = await fetch(`${API_BASE}/eventos/${eventoId}`);
        const evento = await response.json();
        
        exibirDetalhesEvento(evento);
        mudarTela('detalhes-evento');
    } catch (error) {
        console.error('Erro ao carregar detalhes do evento:', error);
    }
}

function exibirDetalhesEvento(evento) {
    const tela = document.getElementById('tela-detalhes-evento');
    tela.innerHTML = `
        <div class="detalhes-header">
            <div class="detalhes-voltar" onclick="mudarParaHome()">←</div>
        </div>
        <div class="detalhes-conteudo">
            <h1 class="detalhes-titulo">${evento.titulo}</h1>
            
            <div class="detalhes-info">
                <div class="evento-data">📅 ${formatarData(evento.data_evento)} • ${evento.hora_evento}</div>
                <div class="evento-local">📍 ${evento.local}</div>
            </div>

            <div class="mb-6">
                <h2 class="secao-titulo">Sobre o Evento</h2>
                <p>${evento.descricao || 'Descrição não disponível.'}</p>
            </div>

            <div class="detalhes-mapa">
                <span>📍 Mapa do Local</span>
            </div>

            <div>
                <h2 class="comentarios-titulo">Comentários</h2>
                <div class="comentario-card">
                    <div class="comentario-avatar"></div>
                    <div class="comentario-conteudo">
                        <div class="comentario-nome">Maria Silva</div>
                        <p class="comentario-texto">Evento incrível! A organização foi perfeita e os artistas eram fantásticos. Recomendo muito!</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="detalhes-footer">
            <div class="preco-container">
                <div class="preco-label">Preço</div>
                <div class="preco-valor">R$ ${evento.preco.toFixed(2)}</div>
            </div>
            <div class="footer-botoes">
                <button class="btn btn-secondary">Comentar</button>
                <button class="btn btn-primary" onclick="fazerCheckin(${evento.id})">Fazer Check-in</button>
            </div>
        </div>
    `;
}

// Carregar Perfil do Usuário
async function carregarPerfilUsuario() {
    const tela = document.getElementById('tela-perfil-usuario');
    
    if (!estadoApp.usuario) return;

    // Carregar badges do usuário
    let badges = [];
    try {
        const response = await fetch(`${API_BASE}/usuarios/${estadoApp.usuario.id}/badges`);
        badges = await response.json();
    } catch (error) {
        console.error('Erro ao carregar badges:', error);
    }

    // Carregar recompensas
    let recompensas = [];
    try {
        const response = await fetch(`${API_BASE}/recompensas`);
        recompensas = await response.json();
    } catch (error) {
        console.error('Erro ao carregar recompensas:', error);
    }

    tela.innerHTML = `
        <div class="perfil-header">
            <div class="perfil-avatar"></div>
            <div class="perfil-nome">${estadoApp.usuario.nome}</div>
            <div class="perfil-registro">Membro desde Out 2024</div>
            <div class="perfil-metricas">
                <div class="metrica">
                    <div class="metrica-valor">${estadoApp.usuario.pontos}</div>
                    <div class="metrica-label">Pontos</div>
                </div>
                <div class="metrica">
                    <div class="metrica-valor">${badges.length}</div>
                    <div class="metrica-label">Badges</div>
                </div>
            </div>
        </div>

        <div class="conteudo">
            <h2 class="badges-titulo">Minhas Badges</h2>
            <div class="badges-grid">
                ${badges.length > 0 ? 
                    badges.slice(0, 8).map(badge => `
                        <div class="badge-item" title="${badge.descricao}">${badge.emoji}</div>
                    `).join('') : 
                    '<p>Nenhuma badge conquistada ainda</p>'
                }
            </div>

            <h2 class="secao-titulo">Recompensas Disponíveis</h2>
            ${recompensas.map(recompensa => `
                <div class="recompensa-card">
                    <div class="recompensa-info">
                        <div class="recompensa-titulo">${recompensa.nome}</div>
                        <div class="recompensa-pontos">${recompensa.custo_pontos} pontos</div>
                    </div>
                    <button class="btn btn-primary" onclick="resgatarRecompensa(${recompensa.id})" 
                            ${estadoApp.usuario.pontos < recompensa.custo_pontos ? 'disabled' : ''}>
                        Resgatar
                    </button>
                </div>
            `).join('')}

            <h2 class="secao-titulo">Eventos Participados</h2>
            <div class="card">
                <div style="margin-bottom: 8px;">Total: ${badges.length * 2} eventos</div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span>🎫</span>
                    <span>Festival de Jazz</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>🎫</span>
                    <span>Exposição de Arte</span>
                </div>
            </div>
        </div>

        <div class="bottom-nav">
            <div class="nav-item" onclick="mudarParaHome()">
                <span class="nav-icone">🏠</span>
                <span class="nav-texto">Início</span>
            </div>
            <div class="nav-item">
                <span class="nav-icone">🔍</span>
                <span class="nav-texto">Buscar</span>
            </div>
            <div class="nav-item">
                <span class="nav-icone">❤️</span>
                <span class="nav-texto">Favoritos</span>
            </div>
            <div class="nav-item ativa">
                <span class="nav-icone">👤</span>
                <span class="nav-texto">Perfil</span>
            </div>
        </div>
    `;
}

// Funções Auxiliares
function formatarData(dataString) {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

function toggleFavorito(elemento) {
    elemento.textContent = elemento.textContent === '🤍' ? '❤️' : '🤍';
}

async function fazerCheckin(eventoId) {
    if (!estadoApp.usuario) {
        alert('Você precisa estar logado para fazer check-in');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_id: estadoApp.usuario.id,
                evento_id: eventoId
            })
        });

        const resultado = await response.json();
        
        if (response.ok) {
            alert('✅ Check-in realizado! +50 pontos');
            estadoApp.usuario.pontos += 50;
        } else {
            alert('❌ ' + resultado.error);
        }
    } catch (error) {
        console.error('Erro ao fazer check-in:', error);
        alert('Erro ao fazer check-in');
    }
}

function resgatarRecompensa(recompensaId) {
    alert('Funcionalidade de resgate em desenvolvimento!');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agenda THE - Frontend carregado');
});