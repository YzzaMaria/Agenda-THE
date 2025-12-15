// favoritos.js - Tela de Favoritos
console.log('✅ Módulo Favoritos carregado');

const estadoFavoritos = {
    eventos: [],
    categoriasFavoritas: []
};

function abrirFavoritos() {
    console.log('❤️ Abrindo tela de favoritos');
    carregarFavoritos();
    carregarTelaFavoritos();
}

async function carregarFavoritos() {
    try {
        const favoritosIds = JSON.parse(localStorage.getItem('favoritos_usuario') || '[]');
        
        if (favoritosIds.length === 0) {
            estadoFavoritos.eventos = [];
            return;
        }

        const todosEventos = await obterTodosEventosFavoritos();
        estadoFavoritos.eventos = todosEventos.filter(evento => 
            favoritosIds.includes(evento.id)
        );

        const categoriasCount = {};
        estadoFavoritos.eventos.forEach(evento => {
            categoriasCount[evento.categoria] = (categoriasCount[evento.categoria] || 0) + 1;
        });

        estadoFavoritos.categoriasFavoritas = Object.entries(categoriasCount)
            .sort((a, b) => b[1] - a[1])
            .map(([categoria]) => categoria);
            
    } catch (error) {
        console.error('❌ Erro ao carregar favoritos:', error);
    }
}

function carregarTelaFavoritos() {
    const tela = document.getElementById('tela-favoritos');
    
    if (!tela) return;

    tela.innerHTML = `
        <!-- Header -->
        <div class="header">
            <div class="header-topo">
                <button class="btn-voltar" onclick="voltarParaHomeFavoritos()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="header-titulo">Meus Favoritos</h1>
                <div class="header-icones">
                    <span class="icone" onclick="organizarFavoritos()">
                        <i class="fas fa-sort"></i>
                    </span>
                </div>
            </div>
        </div>

        <!-- Conteúdo -->
        <div class="conteudo-favoritos">
            <!-- Estatísticas -->
            <div class="estatisticas-favoritos">
                <div class="card-estatistica-favoritos">
                    <div class="estatistica-valor">${estadoFavoritos.eventos.length}</div>
                    <div class="estatistica-label">Eventos favoritados</div>
                </div>
                
                ${estadoFavoritos.categoriasFavoritas.length > 0 ? `
                <div class="categorias-favoritas">
                    <h3>Categorias favoritas</h3>
                    <div class="categorias-tags">
                        ${estadoFavoritos.categoriasFavoritas.map(categoria => `
                            <span class="categoria-tag">${categoria}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Lista de Favoritos -->
            <div class="favoritos-lista-container">
                <div class="favoritos-header">
                    <h3>Meus Eventos Favoritos</h3>
                    ${estadoFavoritos.eventos.length > 0 ? `
                    <button class="btn-limpar-favoritos" onclick="limparTodosFavoritos()">
                        <i class="fas fa-trash"></i> Limpar tudo
                    </button>
                    ` : ''}
                </div>
                
                <div id="lista-favoritos" class="eventos-lista">
                    ${estadoFavoritos.eventos.length === 0 ? `
                    <div class="sem-favoritos">
                        <i class="fas fa-heart" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 16px;"></i>
                        <p>Você ainda não tem eventos favoritados</p>
                        <p class="texto-secundario">Explore eventos e clique no ❤️ para adicionar aos favoritos</p>
                        <button class="btn btn-primary" onclick="voltarParaHomeFavoritos()">
                            <i class="fas fa-compass"></i> Explorar Eventos
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    adicionarEstilosFavoritos();
    exibirFavoritos();
    mudarTela('favoritos');
}

function adicionarEstilosFavoritos() {
    const styleId = 'estilos-favoritos';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .conteudo-favoritos {
                padding: 16px;
                padding-bottom: 80px;
            }
            .estatisticas-favoritos {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .card-estatistica-favoritos {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #9333ea, #ec4899);
                color: white;
                border-radius: 12px;
                margin-bottom: 20px;
            }
            .card-estatistica-favoritos .estatistica-valor {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .card-estatistica-favoritos .estatistica-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            .categorias-favoritas h3 {
                margin: 0 0 12px 0;
                color: #1e293b;
                font-size: 1rem;
            }
            .categorias-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .categoria-tag {
                background: #f3e8ff;
                color: #9333ea;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }
            .favoritos-lista-container {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .favoritos-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .favoritos-header h3 {
                margin: 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .btn-limpar-favoritos {
                background: #fee2e2;
                color: #dc2626;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.85rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background 0.2s ease;
            }
            .btn-limpar-favoritos:hover {
                background: #fecaca;
            }
            .sem-favoritos {
                text-align: center;
                padding: 40px 20px;
                color: #64748b;
            }
            .sem-favoritos .btn {
                margin-top: 16px;
            }
            /* Cards de favoritos específicos */
            .evento-card-favorito {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 16px;
                border: 2px solid #f3e8ff;
                position: relative;
            }
            .evento-card-favorito:hover {
                border-color: #9333ea;
            }
            .evento-card-favorito .favorito-remover {
                position: absolute;
                top: 12px;
                right: 12px;
                background: white;
                color: #ef4444;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 2;
                transition: all 0.3s ease;
            }
            .evento-card-favorito .favorito-remover:hover {
                background: #fee2e2;
                transform: scale(1.1);
            }
            .evento-card-favorito .evento-imagem-favorito {
                height: 120px;
                background: linear-gradient(135deg, #9333ea, #ec4899);
                position: relative;
            }
            .evento-card-favorito .evento-conteudo-favorito {
                padding: 16px;
            }
            .evento-card-favorito .evento-cabecalho-favorito {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
            }
            .evento-card-favorito .evento-titulo-favorito {
                font-size: 1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 4px;
            }
            .evento-card-favorito .evento-categoria-favorito {
                font-size: 0.75rem;
                color: #9333ea;
                background: #f3e8ff;
                padding: 2px 8px;
                border-radius: 10px;
                display: inline-block;
            }
            .evento-card-favorito .evento-info-favorito {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 16px;
                color: #64748b;
                font-size: 0.875rem;
            }
            .evento-card-favorito .evento-rodape-favorito {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .evento-card-favorito .evento-preco-favorito {
                font-size: 1.125rem;
                font-weight: bold;
                color: #9333ea;
            }
        `;
        document.head.appendChild(style);
    }
}

async function obterTodosEventosFavoritos() {
    return [
        {
            id: 1,
            titulo: 'Festival de Jazz',
            categoria: 'musica',
            data_evento: '2024-11-15',
            hora_evento: '20:00',
            local: 'Parque da Cidade',
            preco: 50.00,
            descricao: 'Festival com artistas locais e nacionais'
        },
        {
            id: 2,
            titulo: 'Exposição de Arte Moderna',
            categoria: 'arte',
            data_evento: '2024-11-20',
            hora_evento: '14:00',
            local: 'Museu de Arte',
            preco: 30.00,
            descricao: 'Exposição de arte contemporânea'
        },
        {
            id: 3,
            titulo: 'Show de MPB',
            categoria: 'musica',
            data_evento: '2024-12-05',
            hora_evento: '21:00',
            local: 'Arena do Rio Poty',
            preco: 60.00,
            descricao: 'Show com grandes nomes da MPB'
        }
    ];
}

function exibirFavoritos() {
    const container = document.getElementById('lista-favoritos');
    
    if (!container || estadoFavoritos.eventos.length === 0) return;

    container.innerHTML = estadoFavoritos.eventos.map(evento => `
        <div class="evento-card-favorito" onclick="verDetalhesFavorito(${evento.id})">
            <div class="favorito-remover" onclick="event.stopPropagation(); removerFavorito(${evento.id})">
                <i class="fas fa-times"></i>
            </div>
            <div class="evento-imagem-favorito"></div>
            <div class="evento-conteudo-favorito">
                <div class="evento-cabecalho-favorito">
                    <div>
                        <div class="evento-titulo-favorito">${evento.titulo}</div>
                        <span class="evento-categoria-favorito">${evento.categoria}</span>
                    </div>
                </div>
                <div class="evento-info-favorito">
                    <div><i class="fas fa-calendar-alt"></i> ${formatarDataFavorito(evento.data_evento)} • ${evento.hora_evento}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${evento.local}</div>
                    ${evento.descricao ? `<div>${evento.descricao.substring(0, 50)}...</div>` : ''}
                </div>
                <div class="evento-rodape-favorito">
                    <div class="evento-preco-favorito">R$ ${evento.preco.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); verDetalhesFavorito(${evento.id})">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function formatarDataFavorito(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
    }).replace('.', '');
}

function verDetalhesFavorito(eventoId) {
    if (typeof abrirDetalhesEvento === 'function') {
        abrirDetalhesEvento(eventoId);
    } else {
        mostrarToast('🔍 Abrindo detalhes do evento...');
    }
}

function removerFavorito(eventoId) {
    if (confirm('Remover este evento dos favoritos?')) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos_usuario') || '[]');
        const index = favoritos.indexOf(eventoId);
        
        if (index > -1) {
            favoritos.splice(index, 1);
            localStorage.setItem('favoritos_usuario', JSON.stringify(favoritos));
        }

        estadoFavoritos.eventos = estadoFavoritos.eventos.filter(evento => evento.id !== eventoId);
        exibirFavoritos();
        carregarTelaFavoritos();
        mostrarToast('🤍 Evento removido dos favoritos');
    }
}

function limparTodosFavoritos() {
    if (estadoFavoritos.eventos.length === 0) return;
    
    if (confirm('Tem certeza que deseja remover TODOS os eventos dos favoritos?')) {
        localStorage.removeItem('favoritos_usuario');
        estadoFavoritos.eventos = [];
        estadoFavoritos.categoriasFavoritas = [];
        carregarTelaFavoritos();
        mostrarToast('🧹 Todos os favoritos foram removidos');
    }
}

function organizarFavoritos() {
    const opcoes = ['Data', 'Categoria', 'Preço', 'Local'];
    const escolha = prompt(`Organizar favoritos por:\n\n${opcoes.map((opcao, i) => `${i + 1}. ${opcao}`).join('\n')}\n\nDigite o número:`);
    
    if (escolha) {
        const index = parseInt(escolha) - 1;
        
        if (index >= 0 && index < opcoes.length) {
            const criterio = opcoes[index].toLowerCase();
            
            switch(criterio) {
                case 'data':
                    estadoFavoritos.eventos.sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
                    break;
                case 'categoria':
                    estadoFavoritos.eventos.sort((a, b) => a.categoria.localeCompare(b.categoria));
                    break;
                case 'preço':
                    estadoFavoritos.eventos.sort((a, b) => a.preco - b.preco);
                    break;
                case 'local':
                    estadoFavoritos.eventos.sort((a, b) => a.local.localeCompare(b.local));
                    break;
            }
            
            exibirFavoritos();
            mostrarToast(`📊 Organizado por: ${opcoes[index]}`);
        }
    }
}

function voltarParaHomeFavoritos() {
    mudarTela('usuario-final');
}

// Funções globais
window.abrirFavoritos = abrirFavoritos;
window.voltarParaHomeFavoritos = voltarParaHomeFavoritos;
window.verDetalhesFavorito = verDetalhesFavorito;
window.removerFavorito = removerFavorito;
window.limparTodosFavoritos = limparTodosFavoritos;
window.organizarFavoritos = organizarFavoritos;

console.log('✅ Módulo de favoritos pronto');
