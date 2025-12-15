// app.js - Funções específicas da aplicação (sem autenticação)
const API_BASE = '/api';

const estadoApp = {
    usuario: null,
    eventos: [],
    categorias: [
        { id: 'todos', nome: 'Todos' },
        { id: 'musica', nome: 'Música' },
        { id: 'arte', nome: 'Arte' },
        { id: 'teatro', nome: 'Teatro' },
        { id: 'gastronomia', nome: 'Gastronomia' },
        { id: 'esportes', nome: 'Esportes' }
    ],
    categoriaAtiva: 'todos'
};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 App.js inicializado');
    await testarConexaoAPI();
    
    if (window.location.href.includes('usuario-final')) {
        await inicializarUsuarioFinal();
    }
});

// ==================== CONEXÃO COM API ====================
async function testarConexaoAPI() {
    try {
        const response = await fetch(`${API_BASE}/`);
        const data = await response.json();
        console.log('✅ API conectada:', data.message);
        return true;
    } catch (error) {
        console.warn('⚠️ API offline, usando dados locais');
        
        estadoApp.eventos = [
            {
                id: 1,
                titulo: "Festival de Jazz",
                categoria: "musica",
                data_evento: "2024-11-15",
                hora_evento: "20:00",
                local: "Parque da Cidade",
                preco: 50.00,
                descricao: "Um incrível festival de jazz com artistas locais e nacionais.",
                destaque: true
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
                destaque: true
            },
            {
                id: 3,
                titulo: "Peça de Teatro: Hamlet",
                categoria: "teatro",
                data_evento: "2024-11-25",
                hora_evento: "19:30",
                local: "Teatro Municipal",
                preco: 40.00,
                descricao: "Clássico de Shakespeare com direção moderna.",
                destaque: false
            },
            {
                id: 4,
                titulo: "Festival Gastronômico",
                categoria: "gastronomia",
                data_evento: "2024-11-30",
                hora_evento: "18:00",
                local: "Centro de Convenções",
                preco: 25.00,
                descricao: "Degustação de comidas típicas de várias regiões.",
                destaque: true
            }
        ];
        
        return false;
    }
}

// ==================== TELA USUÁRIO FINAL ====================
async function inicializarUsuarioFinal() {
    console.log('👤 Inicializando módulo do usuário final');
    await carregarEventos();
    inicializarCategorias();
    inicializarBusca();
    inicializarNavegacao();
}

async function carregarEventos() {
    console.log('📡 Carregando eventos...');
    
    try {
        const response = await fetch(`${API_BASE}/eventos`);
        if (response.ok) {
            estadoApp.eventos = await response.json();
            console.log(`✅ ${estadoApp.eventos.length} eventos carregados`);
        } else {
            console.warn('⚠️ API de eventos não disponível');
        }
    } catch (error) {
        console.warn('⚠️ Usando eventos locais');
    }

    const eventosFiltrados = estadoApp.categoriaAtiva === 'todos'
        ? estadoApp.eventos
        : estadoApp.eventos.filter(e => e.categoria === estadoApp.categoriaAtiva);

    exibirEventos(eventosFiltrados);
}

function exibirEventos(eventos) {
    const container = document.getElementById('lista-eventos-usuario');
    
    if (!container) {
        console.error('❌ Container de eventos não encontrado');
        return;
    }

    if (!eventos || eventos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <p>🎭 Nenhum evento encontrado</p>
                <p style="font-size: 0.9rem;">Tente outra categoria ou volte mais tarde!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card" onclick="verDetalhesEvento(${evento.id})">
            <div class="evento-imagem" style="background: linear-gradient(135deg, 
                #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')},
                #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')})">
                ${evento.destaque ? '<span class="evento-destaque">🔥 Destaque</span>' : ''}
            </div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">${evento.titulo || 'Evento'}</div>
                        <span class="evento-categoria">${estadoApp.categorias.find(c => c.id === evento.categoria)?.nome || 'Geral'}</span>
                    </div>
                    <span class="evento-favorito" onclick="event.stopPropagation(); alternarFavorito(this, ${evento.id})">🤍</span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 ${formatarData(evento.data_evento)} • ${evento.hora_evento || '19:00'}</div>
                    <div class="evento-local">📍 ${evento.local || 'Local a definir'}</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}</div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); verDetalhesEvento(${evento.id})">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    console.log(`✅ ${eventos.length} eventos exibidos`);
}

function inicializarCategorias() {
    const container = document.getElementById('lista-categorias-usuario');
    
    if (!container) {
        console.error('❌ Container de categorias não encontrado');
        return;
    }

    container.innerHTML = estadoApp.categorias.map(categoria => `
        <button class="categoria-btn ${estadoApp.categoriaAtiva === categoria.id ? 'ativa' : ''}"
                onclick="filtrarPorCategoria('${categoria.id}')">
            ${categoria.nome}
        </button>
    `).join('');

    console.log('✅ Categorias inicializadas');
}

function inicializarBusca() {
    const campoBusca = document.getElementById('campo-busca-usuario');
    
    if (campoBusca) {
        campoBusca.addEventListener('input', (e) => {
            buscarEventos(e.target.value);
        });
        console.log('✅ Busca inicializada');
    }
}

function inicializarNavegacao() {
    console.log('✅ Navegação do usuário inicializada');
}

// ==================== FILTROS E BUSCA ====================
function filtrarPorCategoria(categoriaId) {
    console.log(`🎯 Filtrando por categoria: ${categoriaId}`);
    estadoApp.categoriaAtiva = categoriaId;

    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('ativa');
    });
    
    document.querySelector(`button[onclick*="${categoriaId}"]`)?.classList.add('ativa');

    const eventosFiltrados = categoriaId === 'todos'
        ? estadoApp.eventos
        : estadoApp.eventos.filter(e => e.categoria === categoriaId);
    
    exibirEventos(eventosFiltrados);
}

function buscarEventos(termo) {
    console.log(`🔍 Buscando: "${termo}"`);
    
    const eventosFiltrados = estadoApp.eventos.filter(evento =>
        evento.titulo.toLowerCase().includes(termo.toLowerCase()) ||
        (evento.descricao && evento.descricao.toLowerCase().includes(termo.toLowerCase())) ||
        evento.local.toLowerCase().includes(termo.toLowerCase())
    );
    
    exibirEventos(eventosFiltrados);
}

// ==================== FUNÇÕES DE EVENTOS ====================
function verDetalhesEvento(eventoId) {
    console.log(`🔍 Visualizando evento ID: ${eventoId}`);
    
    const evento = estadoApp.eventos.find(e => e.id === eventoId);
    
    if (!evento) {
        alert('Evento não encontrado!');
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" onclick="fecharModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>${evento.titulo}</h2>
                    <button class="modal-close" onclick="fecharModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="evento-info-modal">
                        <p><strong>📅 Data:</strong> ${formatarData(evento.data_evento)} • ${evento.hora_evento}</p>
                        <p><strong>📍 Local:</strong> ${evento.local}</p>
                        <p><strong>💰 Preço:</strong> ${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}</p>
                        <p><strong>🏷️ Categoria:</strong> ${estadoApp.categorias.find(c => c.id === evento.categoria)?.nome || 'Geral'}</p>
                    </div>
                    ${evento.descricao ? `<div class="evento-descricao"><p>${evento.descricao}</p></div>` : ''}
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="fecharModal()">Voltar</button>
                        <button class="btn btn-primary" onclick="comprarIngresso(${evento.id})">Comprar Ingresso</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'modal-detalhes';
    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #1e293b;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
        }
        .modal-body {
            padding: 20px;
        }
        .evento-info-modal p {
            margin: 10px 0;
            color: #334155;
        }
        .evento-descricao {
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(style);
}

function fecharModal() {
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        modal.remove();
    }
}

function alternarFavorito(elemento, eventoId) {
    const isFavorito = elemento.textContent === '❤️';
    elemento.textContent = isFavorito ? '🤍' : '❤️';
    elemento.classList.toggle('ativo', !isFavorito);
    
    console.log(`${isFavorito ? '❌ Removido' : '✅ Adicionado'} favorito: ${eventoId}`);

    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (isFavorito) {
        const index = favoritos.indexOf(eventoId);
        if (index > -1) favoritos.splice(index, 1);
    } else {
        favoritos.push(eventoId);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function comprarIngresso(eventoId) {
    alert(`🎫 Compra de ingresso para evento ID: ${eventoId}\n\nEsta funcionalidade será implementada em breve!`);
}

// ==================== FUNÇÕES AUXILIARES ====================
function formatarData(dataString) {
    if (!dataString) return 'Data não informada';
    
    try {
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace('.', '');
    } catch (error) {
        return dataString;
    }
}

// ==================== NAVEGAÇÃO INTERNA ====================
function mudarParaHomeUsuario() {
    console.log('🏠 Mudando para Home (usuário)');
}

function mudarParaBuscaUsuario() {
    console.log('🔍 Mudando para Busca (usuário)');
}

function mudarParaFavoritosUsuario() {
    console.log('❤️ Mudando para Favoritos (usuário)');
    alert('📋 Lista de favoritos em desenvolvimento!');
    
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (favoritos.length > 0) {
        alert(`Você tem ${favoritos.length} eventos favoritados!`);
    } else {
        alert('Você ainda não favoritou nenhum evento.');
    }
}

function mudarParaPerfilUsuario() {
    console.log('👤 Mudando para Perfil (usuário)');
    alert('👤 Perfil do usuário em desenvolvimento!');
}

function mostrarNotificacoes() {
    console.log('🔔 Mostrando notificações');
    alert('📬 Notificações:\n\n• Novo evento: Festival de Música\n• Seu check-in foi registrado\n• Promoção: 20% off em ingressos');
}

console.log('✅ App.js carregado');