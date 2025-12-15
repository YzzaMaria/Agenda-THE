// busca-avancada.js - Tela de Busca Avançada
console.log('✅ Módulo Busca Avançada carregado');

const estadoBusca = {
    termo: '',
    categoria: 'todos',
    dataInicio: '',
    dataFim: '',
    precoMin: '',
    precoMax: '',
    local: '',
    resultados: [],
    filtrosAplicados: false
};

function abrirBuscaAvancada() {
    console.log('🔍 Abrindo busca avançada');
    carregarTelaBusca();
}

function carregarTelaBusca() {
    const tela = document.getElementById('tela-busca-avancada');
    
    if (!tela) return;

    tela.innerHTML = `
        <!-- Header -->
        <div class="header">
            <div class="header-topo">
                <button class="btn-voltar" onclick="voltarParaHomeBusca()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="header-titulo">Busca Avançada</h1>
                <div class="header-icones">
                    <span class="icone" onclick="limparFiltros()">
                        <i class="fas fa-redo"></i>
                    </span>
                </div>
            </div>
            <div class="busca-container">
                <span class="busca-icone"><i class="fas fa-search"></i></span>
                <input type="text" class="busca-input" placeholder="Buscar eventos..." id="campo-busca-avancada"
                       value="${estadoBusca.termo}" oninput="atualizarTermoBusca(this.value)">
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-container">
            <div class="filtros-header">
                <h3><i class="fas fa-filter"></i> Filtros</h3>
                <button class="btn-filtros-toggle" onclick="toggleFiltros()">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="filtros-conteudo" id="filtros-conteudo">
                <!-- Categoria -->
                <div class="filtro-grupo">
                    <label for="filtro-categoria">Categoria</label>
                    <select id="filtro-categoria" onchange="atualizarCategoria(this.value)">
                        <option value="todos" ${estadoBusca.categoria === 'todos' ? 'selected' : ''}>Todas as categorias</option>
                        <option value="musica" ${estadoBusca.categoria === 'musica' ? 'selected' : ''}>Música</option>
                        <option value="arte" ${estadoBusca.categoria === 'arte' ? 'selected' : ''}>Arte</option>
                        <option value="teatro" ${estadoBusca.categoria === 'teatro' ? 'selected' : ''}>Teatro</option>
                        <option value="gastronomia" ${estadoBusca.categoria === 'gastronomia' ? 'selected' : ''}>Gastronomia</option>
                        <option value="esportes" ${estadoBusca.categoria === 'esportes' ? 'selected' : ''}>Esportes</option>
                    </select>
                </div>

                <!-- Data -->
                <div class="filtro-grupo">
                    <label>Data</label>
                    <div class="filtro-duplo">
                        <div>
                            <input type="date" placeholder="Data inicial" id="filtro-data-inicio"
                                   value="${estadoBusca.dataInicio}" onchange="atualizarDataInicio(this.value)">
                        </div>
                        <div>
                            <input type="date" placeholder="Data final" id="filtro-data-fim"
                                   value="${estadoBusca.dataFim}" onchange="atualizarDataFim(this.value)">
                        </div>
                    </div>
                </div>

                <!-- Preço -->
                <div class="filtro-grupo">
                    <label>Preço (R$)</label>
                    <div class="filtro-duplo">
                        <div>
                            <input type="number" placeholder="Mínimo" id="filtro-preco-min"
                                   value="${estadoBusca.precoMin}" oninput="atualizarPrecoMin(this.value)">
                        </div>
                        <div>
                            <input type="number" placeholder="Máximo" id="filtro-preco-max"
                                   value="${estadoBusca.precoMax}" oninput="atualizarPrecoMax(this.value)">
                        </div>
                    </div>
                </div>

                <!-- Local -->
                <div class="filtro-grupo">
                    <label for="filtro-local">Local</label>
                    <input type="text" id="filtro-local" placeholder="Cidade, bairro..."
                           value="${estadoBusca.local}" oninput="atualizarLocal(this.value)">
                </div>

                <!-- Botões -->
                <div class="filtro-botoes">
                    <button class="btn btn-secondary" onclick="limparFiltros()">
                        <i class="fas fa-times"></i> Limpar
                    </button>
                    <button class="btn btn-primary" onclick="aplicarFiltros()">
                        <i class="fas fa-check"></i> Aplicar
                    </button>
                </div>
            </div>
        </div>

        <!-- Resultados -->
        <div class="resultados-container">
            <div class="resultados-header">
                <h3 id="contador-resultados">Resultados (${estadoBusca.resultados.length})</h3>
                <div class="ordenacao">
                    <select id="ordenacao" onchange="ordenarResultados(this.value)">
                        <option value="relevancia">Mais relevantes</option>
                        <option value="data">Mais próximos</option>
                        <option value="preco-asc">Preço: menor primeiro</option>
                        <option value="preco-desc">Preço: maior primeiro</option>
                        <option value="popularidade">Mais populares</option>
                    </select>
                </div>
            </div>
            <div id="lista-resultados-busca" class="eventos-lista">
                ${estadoBusca.resultados.length > 0 ? '' : `
                    <div class="sem-resultados">
                        <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 16px;"></i>
                        <p>Nenhum evento encontrado</p>
                        <p class="texto-secundario">Tente ajustar os filtros ou buscar por outro termo</p>
                    </div>
                `}
            </div>
        </div>
    `;

    adicionarEstilosBusca();

    if (estadoBusca.filtrosAplicados) {
        buscarEventos();
    } else {
        carregarTodosEventos();
    }

    mudarTela('busca-avancada');
}

function adicionarEstilosBusca() {
    const styleId = 'estilos-busca-avancada';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .filtros-container {
                background: white;
                margin: 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .filtros-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #f1f5f9;
            }
            .filtros-header h3 {
                margin: 0;
                font-size: 1rem;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .btn-filtros-toggle {
                background: none;
                border: none;
                color: #64748b;
                font-size: 1rem;
                cursor: pointer;
                padding: 4px;
            }
            .filtros-conteudo {
                padding: 20px;
                display: block;
            }
            .filtros-conteudo.contraido {
                display: none;
            }
            .filtro-grupo {
                margin-bottom: 20px;
            }
            .filtro-grupo label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #334155;
                font-size: 0.9rem;
            }
            .filtro-grupo select,
            .filtro-grupo input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.9rem;
                transition: border-color 0.3s ease;
            }
            .filtro-grupo select:focus,
            .filtro-grupo input:focus {
                outline: none;
                border-color: #9333ea;
            }
            .filtro-duplo {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            .filtro-botoes {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            .filtro-botoes .btn {
                flex: 1;
                padding: 12px;
            }
            .resultados-container {
                margin: 16px;
            }
            .resultados-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .resultados-header h3 {
                margin: 0;
                font-size: 1.1rem;
                color: #1e293b;
            }
            .ordenacao select {
                padding: 8px 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.85rem;
                color: #64748b;
                background: white;
            }
            .sem-resultados {
                text-align: center;
                padding: 60px 20px;
                color: #64748b;
            }
            .texto-secundario {
                font-size: 0.9rem;
                margin-top: 8px;
                opacity: 0.8;
            }
            /* Cards de resultado específicos */
            .evento-card-busca {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 16px;
                transition: transform 0.3s ease;
            }
            .evento-card-busca:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }
            .evento-card-busca .evento-header-busca {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 16px;
            }
            .evento-card-busca .evento-titulo-busca {
                font-size: 1.1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 8px;
            }
            .evento-card-busca .evento-categoria-busca {
                font-size: 0.8rem;
                color: #9333ea;
                background: #f3e8ff;
                padding: 4px 8px;
                border-radius: 20px;
                display: inline-block;
            }
            .evento-card-busca .evento-info-busca {
                padding: 0 16px 16px 16px;
                color: #64748b;
                font-size: 0.9rem;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .evento-card-busca .evento-rodape-busca {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-top: 1px solid #f1f5f9;
            }
            .evento-card-busca .evento-preco-busca {
                font-size: 1.2rem;
                font-weight: bold;
                color: #9333ea;
            }
        `;
        document.head.appendChild(style);
    }
}

function toggleFiltros() {
    const filtros = document.getElementById('filtros-conteudo');
    const toggleIcon = document.querySelector('.btn-filtros-toggle i');
    
    if (filtros) {
        filtros.classList.toggle('contraido');
        toggleIcon.classList.toggle('fa-chevron-down');
        toggleIcon.classList.toggle('fa-chevron-up');
    }
}

function atualizarTermoBusca(termo) {
    estadoBusca.termo = termo;
    
    if (termo.length >= 2 || termo.length === 0) {
        buscarEventos();
    }
}

function atualizarCategoria(categoria) {
    estadoBusca.categoria = categoria;
}

function atualizarDataInicio(data) {
    estadoBusca.dataInicio = data;
}

function atualizarDataFim(data) {
    estadoBusca.dataFim = data;
}

function atualizarPrecoMin(preco) {
    estadoBusca.precoMin = preco;
}

function atualizarPrecoMax(preco) {
    estadoBusca.precoMax = preco;
}

function atualizarLocal(local) {
    estadoBusca.local = local;
}

function aplicarFiltros() {
    estadoBusca.filtrosAplicados = true;
    buscarEventos();
    mostrarToast('✅ Filtros aplicados!');
}

function limparFiltros() {
    estadoBusca.termo = '';
    estadoBusca.categoria = 'todos';
    estadoBusca.dataInicio = '';
    estadoBusca.dataFim = '';
    estadoBusca.precoMin = '';
    estadoBusca.precoMax = '';
    estadoBusca.local = '';
    estadoBusca.filtrosAplicados = false;

    const inputs = {
        'campo-busca-avancada': estadoBusca.termo,
        'filtro-categoria': estadoBusca.categoria,
        'filtro-data-inicio': estadoBusca.dataInicio,
        'filtro-data-fim': estadoBusca.dataFim,
        'filtro-preco-min': estadoBusca.precoMin,
        'filtro-preco-max': estadoBusca.precoMax,
        'filtro-local': estadoBusca.local
    };

    for (const [id, value] of Object.entries(inputs)) {
        const element = document.getElementById(id);
        if (element) element.value = value;
    }

    carregarTodosEventos();
    mostrarToast('🧹 Filtros limpos!');
}

async function buscarEventos() {
    console.log('🔍 Buscando eventos com filtros:', estadoBusca);
    
    const todosEventos = await obterTodosEventos();
    let resultados = [...todosEventos];

    if (estadoBusca.termo) {
        const termoLower = estadoBusca.termo.toLowerCase();
        resultados = resultados.filter(evento =>
            evento.titulo.toLowerCase().includes(termoLower) ||
            evento.descricao?.toLowerCase().includes(termoLower) ||
            evento.local.toLowerCase().includes(termoLower)
        );
    }

    if (estadoBusca.categoria !== 'todos') {
        resultados = resultados.filter(evento => evento.categoria === estadoBusca.categoria);
    }

    if (estadoBusca.dataInicio) {
        resultados = resultados.filter(evento => evento.data_evento >= estadoBusca.dataInicio);
    }

    if (estadoBusca.dataFim) {
        resultados = resultados.filter(evento => evento.data_evento <= estadoBusca.dataFim);
    }

    if (estadoBusca.precoMin) {
        resultados = resultados.filter(evento => evento.preco >= parseFloat(estadoBusca.precoMin));
    }

    if (estadoBusca.precoMax) {
        resultados = resultados.filter(evento => evento.preco <= parseFloat(estadoBusca.precoMax));
    }

    if (estadoBusca.local) {
        const localLower = estadoBusca.local.toLowerCase();
        resultados = resultados.filter(evento =>
            evento.local.toLowerCase().includes(localLower)
        );
    }

    estadoBusca.resultados = resultados;
    exibirResultados();
}

async function carregarTodosEventos() {
    estadoBusca.resultados = await obterTodosEventos();
    exibirResultados();
}

async function obterTodosEventos() {
    return [
        {
            id: 1,
            titulo: 'Festival de Jazz',
            descricao: 'Festival com artistas locais e nacionais',
            categoria: 'musica',
            data_evento: '2024-11-15',
            hora_evento: '20:00',
            local: 'Parque da Cidade, Teresina',
            preco: 50.00,
            destaque: true
        },
        {
            id: 2,
            titulo: 'Exposição de Arte Moderna',
            descricao: 'Exposição de arte contemporânea',
            categoria: 'arte',
            data_evento: '2024-11-20',
            hora_evento: '14:00',
            local: 'Museu de Arte, Teresina',
            preco: 30.00,
            destaque: true
        },
        {
            id: 3,
            titulo: 'Peça Teatral: Hamlet',
            descricao: 'Clássico de Shakespeare',
            categoria: 'teatro',
            data_evento: '2024-11-25',
            hora_evento: '19:30',
            local: 'Teatro Municipal, Teresina',
            preco: 40.00,
            destaque: false
        }
    ];
}

function exibirResultados() {
    const container = document.getElementById('lista-resultados-busca');
    const contador = document.getElementById('contador-resultados');
    
    if (!container || !contador) return;

    contador.textContent = `Resultados (${estadoBusca.resultados.length})`;

    if (estadoBusca.resultados.length === 0) {
        container.innerHTML = `
            <div class="sem-resultados">
                <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 16px;"></i>
                <p>Nenhum evento encontrado</p>
                <p class="texto-secundario">Tente ajustar os filtros ou buscar por outro termo</p>
            </div>
        `;
        return;
    }

    container.innerHTML = estadoBusca.resultados.map(evento => `
        <div class="evento-card-busca" onclick="verDetalhesEventoBusca(${evento.id})">
            <div class="evento-header-busca">
                <div>
                    <div class="evento-titulo-busca">${evento.titulo}</div>
                    <span class="evento-categoria-busca">${evento.categoria}</span>
                </div>
                ${evento.destaque ? '<span class="evento-destaque-busca">🔥</span>' : ''}
            </div>
            <div class="evento-info-busca">
                <div><i class="fas fa-calendar-alt"></i> ${formatarData(evento.data_evento)} • ${evento.hora_evento}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${evento.local}</div>
                ${evento.descricao ? `<div><i class="fas fa-align-left"></i> ${evento.descricao.substring(0, 60)}...</div>` : ''}
            </div>
            <div class="evento-rodape-busca">
                <div class="evento-preco-busca">R$ ${evento.preco.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="event.stopPropagation(); verDetalhesEventoBusca(${evento.id})">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');
}

function verDetalhesEventoBusca(eventoId) {
    if (typeof abrirDetalhesEvento === 'function') {
        abrirDetalhesEvento(eventoId);
    } else {
        mostrarToast('🔍 Redirecionando para detalhes do evento...');
        voltarParaHomeBusca();
    }
}

function ordenarResultados(criterio) {
    console.log('📊 Ordenando por:', criterio);
    
    switch(criterio) {
        case 'data':
            estadoBusca.resultados.sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
            break;
        case 'preco-asc':
            estadoBusca.resultados.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            estadoBusca.resultados.sort((a, b) => b.preco - a.preco);
            break;
        case 'popularidade':
            estadoBusca.resultados.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
            break;
        default:
            estadoBusca.resultados.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }

    exibirResultados();
    mostrarToast(`📊 Ordenado por: ${criterio}`);
}

function formatarData(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

function voltarParaHomeBusca() {
    mudarTela('usuario-final');
}

// Funções globais
window.abrirBuscaAvancada = abrirBuscaAvancada;
window.voltarParaHomeBusca = voltarParaHomeBusca;
window.toggleFiltros = toggleFiltros;
window.atualizarTermoBusca = atualizarTermoBusca;
window.atualizarCategoria = atualizarCategoria;
window.atualizarDataInicio = atualizarDataInicio;
window.atualizarDataFim = atualizarDataFim;
window.atualizarPrecoMin = atualizarPrecoMin;
window.atualizarPrecoMax = atualizarPrecoMax;
window.atualizarLocal = atualizarLocal;
window.aplicarFiltros = aplicarFiltros;
window.limparFiltros = limparFiltros;
window.verDetalhesEventoBusca = verDetalhesEventoBusca;
window.ordenarResultados = ordenarResultados;

console.log('✅ Módulo de busca avançada pronto');