// usuario-final.js - Módulo especializado para funcionalidades do usuário final
console.log('✅ Módulo Usuário Final carregado');

const USUARIO_API_BASE = window.location.origin + '/api';

const estadoUsuarioFinal = {
    categoriaAtiva: 'todos',
    eventos: [],
    favoritos: JSON.parse(localStorage.getItem('favoritos_usuario') || '[]'),
    buscaAtiva: false,
    termoBusca: ''
};

function inicializarUsuarioFinal() {
    console.log('🚀 Inicializando módulo do usuário final');
    carregarEventosUsuario();
    configurarBusca();
    configurarCategorias();
    configurarNavegacao();
    console.log('✅ Módulo do usuário final inicializado');
}

async function carregarEventosUsuario() {
    console.log('📡 Carregando eventos específicos do usuário...');
    
    try {
        const response = await fetch(`${USUARIO_API_BASE}/eventos`);
        
        if (response.ok) {
            const eventos = await response.json();
            estadoUsuarioFinal.eventos = eventos;
            console.log(`✅ ${eventos.length} eventos carregados`);
        } else {
            console.warn('⚠️ API offline, usando dados locais');
            usarEventosDemo();
        }
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        usarEventosDemo();
    }

    exibirEventosUsuario();
}

function usarEventosDemo() {
    console.log('🎪 Usando eventos de demonstração');
    
    estadoUsuarioFinal.eventos = [
        {
            id: 1,
            titulo: "Festival de Jazz",
            categoria: "musica",
            data_evento: "2024-11-15",
            hora_evento: "20:00",
            local: "Praça Saraiva",
            preco: 50.00,
            descricao: "Um incrível festival de jazz com artistas locais e nacionais.",
            destaque: true,
            lotacao: 150,
            ingressos_vendidos: 120
        },
        {
            id: 2,
            titulo: "Exposição de Arte Moderna",
            categoria: "arte",
            data_evento: "2024-11-20",
            hora_evento: "14:00",
            local: "Museu Dom Avelar Brandão Vilela",
            preco: 30.00,
            descricao: "Exposição com obras de artistas contemporâneos renomados.",
            destaque: true,
            lotacao: 100,
            ingressos_vendidos: 85
        },
        {
            id: 3,
            titulo: "Peça Teatral: Corpos Dizeres",
            categoria: "teatro",
            data_evento: "2025-12-03",
            hora_evento: "19:30",
            local: "Theatro 4 de setembro",
            preco: 40.00,
            descricao: "Entre gestos que escavam camadas, um corpo afirma pela dança sua voz.",
            destaque: false,
            lotacao: 200,
            ingressos_vendidos: 45
        },
        {
            id: 4,
            titulo: "Feira Gastronômica Regional",
            categoria: "gastronomia",
            data_evento: "2024-11-25",
            hora_evento: "18:00",
            local: "Parque da Cidadania",
            preco: 20.00,
            descricao: "Degustação de comidas típicas do Piauí e região Nordeste.",
            destaque: true,
            lotacao: 300,
            ingressos_vendidos: 250
        },
        {
            id: 5,
            titulo: "Show de Música Popular",
            categoria: "musica",
            data_evento: "2024-12-05",
            hora_evento: "21:00",
            local: "Arena do Rio Poty",
            preco: 60.00,
            descricao: "Show com grandes nomes da música popular brasileira.",
            destaque: true,
            lotacao: 500,
            ingressos_vendidos: 320
        }
    ];
}

function exibirEventosUsuario() {
    const container = document.getElementById('lista-eventos-usuario');
    
    if (!container) {
        console.error('❌ Container de eventos não encontrado');
        return;
    }

    let eventosFiltrados = estadoUsuarioFinal.eventos;

    if (estadoUsuarioFinal.categoriaAtiva !== 'todos') {
        eventosFiltrados = eventosFiltrados.filter(evento => 
            evento.categoria === estadoUsuarioFinal.categoriaAtiva
        );
    }

    if (estadoUsuarioFinal.buscaAtiva && estadoUsuarioFinal.termoBusca) {
        const termo = estadoUsuarioFinal.termoBusca.toLowerCase();
        eventosFiltrados = eventosFiltrados.filter(evento =>
            evento.titulo.toLowerCase().includes(termo) ||
            (evento.descricao && evento.descricao.toLowerCase().includes(termo)) ||
            evento.local.toLowerCase().includes(termo)
        );
    }

    if (!eventosFiltrados || eventosFiltrados.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">🎭 Nenhum evento encontrado</p>
                <p style="font-size: 0.9rem;">${estadoUsuarioFinal.buscaAtiva ? 'Tente outro termo de busca.' : 'Tente outra categoria ou volte mais tarde!'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = eventosFiltrados.map(evento => {
        const percentualLotacao = Math.min(100, (evento.ingressos_vendidos / evento.lotacao) * 100);
        const isFavorito = estadoUsuarioFinal.favoritos.includes(evento.id);

        return `
            <div class="evento-card" onclick="verDetalhesEventoCompleto(${evento.id})">
                <div class="evento-imagem" style="background: linear-gradient(135deg, 
                    #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')},
                    #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')})">
                    ${evento.destaque ? '<span class="evento-destaque">🔥 Destaque</span>' : ''}
                    <div class="lotacao-indicator" title="${evento.ingressos_vendidos}/${evento.lotacao} ingressos vendidos">
                        <div class="lotacao-bar" style="width: ${percentualLotacao}%"></div>
                    </div>
                </div>
                <div class="evento-conteudo">
                    <div class="evento-cabecalho">
                        <div>
                            <div class="evento-titulo">${evento.titulo}</div>
                            <span class="evento-categoria">${formatarCategoria(evento.categoria)}</span>
                        </div>
                        <span class="evento-favorito ${isFavorito ? 'ativo' : ''}"
                            onclick="event.stopPropagation(); alternarFavoritoUsuario(${evento.id}, this)">
                            ${isFavorito ? '❤️' : '🤍'}
                        </span>
                    </div>
                    <div class="evento-info">
                        <div class="evento-data">📅 ${formatarDataUsuario(evento.data_evento)} • ${evento.hora_evento}</div>
                        <div class="evento-local">📍 ${evento.local}</div>
                    </div>
                    <div class="evento-rodape">
                        <div class="evento-preco">${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}</div>
                        <div class="lotacao-info">
                            <small>${evento.ingressos_vendidos}/${evento.lotacao} ingressos</small>
                        </div>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); verDetalhesEventoCompleto(${evento.id})">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    console.log(`✅ ${eventosFiltrados.length} eventos exibidos`);
    adicionarEstiloLotacao();
}

function adicionarEstiloLotacao() {
    const styleId = 'estilo-lotacao-usuario';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .lotacao-indicator {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                overflow: hidden;
            }
            .lotacao-bar {
                height: 100%;
                background: ${estadoUsuarioFinal.categoriaAtiva === 'todos' ? '#9333ea' :
                           estadoUsuarioFinal.categoriaAtiva === 'musica' ? '#ec4899' :
                           estadoUsuarioFinal.categoriaAtiva === 'arte' ? '#4f46e5' :
                           estadoUsuarioFinal.categoriaAtiva === 'teatro' ? '#ea580c' :
                           estadoUsuarioFinal.categoriaAtiva === 'gastronomia' ? '#10b981' : '#6366f1'};
                transition: width 0.3s ease;
            }
            .lotacao-info {
                font-size: 0.75rem;
                color: #64748b;
            }
        `;
        document.head.appendChild(style);
    }
}

function configurarCategorias() {
    const container = document.getElementById('lista-categorias-usuario');
    
    if (!container) {
        console.error('❌ Container de categorias não encontrado');
        return;
    }

    const categorias = [
        { id: 'todos', nome: 'Todos', icone: '🌟' },
        { id: 'musica', nome: 'Música', icone: '🎵' },
        { id: 'arte', nome: 'Arte', icone: '🎨' },
        { id: 'teatro', nome: 'Teatro', icone: '🎭' },
        { id: 'gastronomia', nome: 'Gastronomia', icone: '🍴' },
        { id: 'esportes', nome: 'Esportes', icone: '⚽' }
    ];

    container.innerHTML = categorias.map(categoria => `
        <button class="categoria-btn ${estadoUsuarioFinal.categoriaAtiva === categoria.id ? 'ativa' : ''}"
                onclick="filtrarPorCategoriaUsuario('${categoria.id}')"
                title="${categoria.nome}">
            <span class="categoria-icone">${categoria.icone}</span>
            <span class="categoria-nome">${categoria.nome}</span>
        </button>
    `).join('');

    console.log('✅ Categorias configuradas');
}

function filtrarPorCategoriaUsuario(categoriaId) {
    console.log(`🎯 Filtrando por categoria: ${categoriaId}`);
    estadoUsuarioFinal.categoriaAtiva = categoriaId;

    document.querySelectorAll('#lista-categorias-usuario .categoria-btn').forEach(btn => {
        btn.classList.remove('ativa');
    });
    
    const btnAtivo = document.querySelector(`button[onclick*="filtrarPorCategoriaUsuario('${categoriaId}')"]`);
    if (btnAtivo) btnAtivo.classList.add('ativa');

    exibirEventosUsuario();
}

function configurarBusca() {
    const campoBusca = document.getElementById('campo-busca-usuario');
    
    if (!campoBusca) {
        console.error('❌ Campo de busca não encontrado');
        return;
    }

    campoBusca.value = '';
    estadoUsuarioFinal.buscaAtiva = false;
    estadoUsuarioFinal.termoBusca = '';

    campoBusca.addEventListener('input', (e) => {
        const termo = e.target.value.trim();
        estadoUsuarioFinal.buscaAtiva = termo.length > 0;
        estadoUsuarioFinal.termoBusca = termo;
        
        if (termo.length >= 2 || termo.length === 0) {
            exibirEventosUsuario();
        }
    });

    console.log('✅ Busca configurada');
}

function alternarFavoritoUsuario(eventoId, elemento) {
    const index = estadoUsuarioFinal.favoritos.indexOf(eventoId);
    const evento = estadoUsuarioFinal.eventos.find(e => e.id === eventoId);
    
    if (index === -1) {
        estadoUsuarioFinal.favoritos.push(eventoId);
        elemento.textContent = '❤️';
        elemento.classList.add('ativo');
        console.log('❤️ Evento favoritado:', evento?.titulo || eventoId);
        mostrarToast(`"${evento?.titulo || 'Evento'}" adicionado aos favoritos!`);
    } else {
        estadoUsuarioFinal.favoritos.splice(index, 1);
        elemento.textContent = '🤍';
        elemento.classList.remove('ativo');
        console.log('🤍 Evento removido dos favoritos:', evento?.titulo || eventoId);
        mostrarToast(`"${evento?.titulo || 'Evento'}" removido dos favoritos!`);
    }

    localStorage.setItem('favoritos_usuario', JSON.stringify(estadoUsuarioFinal.favoritos));
}

function verDetalhesEventoCompleto(eventoId) {
    const evento = estadoUsuarioFinal.eventos.find(e => e.id === eventoId);
    
    if (!evento) {
        alert('Evento não encontrado!');
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" onclick="fecharModalUsuario()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>${evento.titulo}</h2>
                    <button class="modal-close" onclick="fecharModalUsuario()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="evento-imagem-modal" style="background: linear-gradient(135deg, 
                        #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')},
                        #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')})">
                        ${evento.destaque ? '<span class="evento-destaque-modal">🔥 Destaque</span>' : ''}
                    </div>
                    <div class="evento-info-modal">
                        <div class="info-item">
                            <span class="info-label">📅 Data e Hora:</span>
                            <span class="info-value">${formatarDataUsuario(evento.data_evento)} às ${evento.hora_evento}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📍 Local:</span>
                            <span class="info-value">${evento.local}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">💰 Preço:</span>
                            <span class="info-value">${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">🏷️ Categoria:</span>
                            <span class="info-value">${formatarCategoria(evento.categoria)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">🎫 Ingressos:</span>
                            <span class="info-value">${evento.ingressos_vendidos}/${evento.lotacao} vendidos</span>
                        </div>
                    </div>
                    ${evento.descricao ? `
                    <div class="evento-descricao-modal">
                        <h3>Sobre o Evento</h3>
                        <p>${evento.descricao}</p>
                    </div>
                    ` : ''}
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="fecharModalUsuario()">
                            Voltar
                        </button>
                        <button class="btn btn-primary" onclick="comprarIngressoUsuario(${evento.id})">
                            🎫 Comprar Ingresso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'modal-detalhes-usuario';
    document.body.appendChild(modal);

    adicionarEstilosModalUsuario();
}

function fecharModalUsuario() {
    const modal = document.getElementById('modal-detalhes-usuario');
    if (modal) {
        modal.remove();
    }
}

function adicionarEstilosModalUsuario() {
    const styleId = 'estilos-modal-usuario';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                padding: 20px;
            }
            .modal-content {
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e2e8f0;
                position: sticky;
                top: 0;
                background: white;
                z-index: 1;
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
                padding: 5px;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close:hover {
                background: #f1f5f9;
            }
            .modal-body {
                padding: 0;
            }
            .evento-imagem-modal {
                height: 200px;
                position: relative;
                border-radius: 16px 16px 0 0;
            }
            .evento-destaque-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                background: #f59e0b;
                color: white;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .evento-info-modal {
                padding: 20px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .info-item:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #334155;
            }
            .info-value {
                color: #64748b;
                text-align: right;
            }
            .evento-descricao-modal {
                padding: 20px;
                background: #f8fafc;
                margin: 20px;
                border-radius: 12px;
            }
            .evento-descricao-modal h3 {
                margin: 0 0 10px 0;
                color: #1e293b;
            }
            .evento-descricao-modal p {
                margin: 0;
                color: #475569;
                line-height: 1.6;
            }
            .modal-actions {
                display: flex;
                gap: 10px;
                padding: 20px;
                border-top: 1px solid #e2e8f0;
            }
            .modal-actions .btn {
                flex: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

function comprarIngressoUsuario(eventoId) {
    const evento = estadoUsuarioFinal.eventos.find(e => e.id === eventoId);
    
    if (!evento) return;

    alert(`🎫 Compra de Ingresso\n\nEvento: ${evento.titulo}\nPreço:${evento.preco ? `R$ ${parseFloat(evento.preco).toFixed(2)}` : 'Gratuito'}\n\nEsta funcionalidade será implementada em breve!`);
    fecharModalUsuario();
}

function configurarNavegacao() {
    console.log('✅ Navegação interna configurada');
}

function navegarParaFavoritosUsuario() {
    const favoritos = estadoUsuarioFinal.favoritos;
    
    if (favoritos.length === 0) {
        mostrarToast('Você ainda não tem eventos favoritados!');
        return;
    }

    const eventosFavoritos = estadoUsuarioFinal.eventos.filter(evento => 
        favoritos.includes(evento.id)
    );

    const modalHTML = `
        <div class="modal-overlay" onclick="fecharModalUsuario()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>❤️ Meus Favoritos</h2>
                    <button class="modal-close" onclick="fecharModalUsuario()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="favoritos-lista">
                        ${eventosFavoritos.map(evento => `
                            <div class="favorito-item">
                                <div class="favorito-info">
                                    <h4>${evento.titulo}</h4>
                                    <p>${formatarDataUsuario(evento.data_evento)} • ${evento.local}</p>
                                </div>
                                <button class="btn btn-secondary btn-sm" onclick="verDetalhesEventoCompleto(${evento.id})">
                                    Ver
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'modal-favoritos-usuario';
    document.body.appendChild(modal);
}

function navegarParaPerfilUsuario() {
    mostrarToast('👤 Perfil do usuário em desenvolvimento!');
}

function formatarCategoria(categoria) {
    const categoriasMap = {
        'musica': 'Música',
        'arte': 'Arte',
        'teatro': 'Teatro',
        'gastronomia': 'Gastronomia',
        'esportes': 'Esportes'
    };
    
    return categoriasMap[categoria] || categoria;
}

function formatarDataUsuario(dataString) {
    if (!dataString) return 'Data não informada';
    
    try {
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace('.', '').replace('-feira', '');
    } catch (error) {
        return dataString;
    }
}

function mostrarToast(mensagem) {
    const toastAnterior = document.getElementById('toast-usuario');
    if (toastAnterior) toastAnterior.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-usuario';
    toast.innerHTML = `<div class="toast-content">${mensagem}</div>`;
    document.body.appendChild(toast);

    if (!document.getElementById('estilo-toast-usuario')) {
        const style = document.createElement('style');
        style.id = 'estilo-toast-usuario';
        style.textContent = `
            #toast-usuario {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: #334155;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 4000;
                animation: slideUpToast 0.3s ease, fadeOutToast 0.3s ease 2.7s forwards;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            @keyframes slideUpToast {
                from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes fadeOutToast {
                to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
            .toast-content {
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Exportar funções
window.inicializarUsuarioFinal = inicializarUsuarioFinal;
window.filtrarPorCategoriaUsuario = filtrarPorCategoriaUsuario;
window.verDetalhesEventoCompleto = verDetalhesEventoCompleto;
window.alternarFavoritoUsuario = alternarFavoritoUsuario;
window.fecharModalUsuario = fecharModalUsuario;
window.comprarIngressoUsuario = comprarIngressoUsuario;
window.navegarParaFavoritosUsuario = navegarParaFavoritosUsuario;
window.navegarParaPerfilUsuario = navegarParaPerfilUsuario;

window.mostrarNotificacoes = function() {
    mostrarToast('🔔 Você tem 3 novas notificações!');
};

console.log('✅ Módulo do usuário final pronto para uso');
