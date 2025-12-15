// curador.js - Módulo do Curador
console.log('✅ Módulo Curador carregado');

const estadoCurador = {
    abaAtiva: 'pendentes',
    eventosPendentes: [],
    eventosAprovados: [],
    eventosRejeitados: []
};

function inicializarCurador() {
    console.log('🚀 Inicializando módulo do curador');
    configurarAbasCurador();
    carregarEventosCurador();
    console.log('✅ Curador inicializado');
}

function configurarAbasCurador() {
    const abas = document.querySelectorAll('#abas-curador .aba');
    
    abas.forEach(aba => {
        aba.addEventListener('click', function() {
            const abaId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            mudarAbaCurador(abaId);
        });
    });
}

function mudarAbaCurador(abaId) {
    console.log(`📁 Mudando para aba: ${abaId}`);
    estadoCurador.abaAtiva = abaId;

    document.querySelectorAll('#abas-curador .aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    document.querySelector(`#abas-curador .aba[onclick*="${abaId}"]`)?.classList.add('ativa');

    document.querySelectorAll('.conteudo-curador .aba-conteudo').forEach(conteudo => {
        conteudo.classList.remove('ativa');
    });
    
    document.getElementById(`aba-${abaId}`)?.classList.add('ativa');
}

async function carregarEventosCurador() {
    try {
        // Eventos pendentes (simulação)
        estadoCurador.eventosPendentes = [
            {
                id: 101,
                titulo: 'Festa Eletrônica',
                categoria: 'musica',
                data: '10/12/2024',
                local: 'Clube Noturno',
                produtor: 'DJ Marcos',
                descricao: 'Festa com DJs locais e nacionais.',
                preco: 40,
                dataEnvio: '02/12/2024'
            },
            {
                id: 102,
                titulo: 'Oficina de Pintura',
                categoria: 'arte',
                data: '18/12/2024',
                local: 'Ateliê Central',
                produtor: 'Arte Viva',
                descricao: 'Oficina para iniciantes em pintura.',
                preco: 25,
                dataEnvio: '01/12/2024'
            }
        ];

        // Eventos aprovados
        estadoCurador.eventosAprovados = [
            {
                id: 1,
                titulo: 'Festival de Jazz',
                categoria: 'musica',
                data: '15/11/2024',
                local: 'Parque da Cidade',
                produtor: 'Produções Musicais',
                preco: 50,
                dataAprovacao: '25/11/2024'
            }
        ];

        exibirEventosCurador();
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
    }
}

function exibirEventosCurador() {
    exibirListaEventos('pendentes', estadoCurador.eventosPendentes);
    exibirListaEventos('aprovados', estadoCurador.eventosAprovados);
    exibirListaEventos('rejeitados', estadoCurador.eventosRejeitados);

    const badge = document.querySelector('#abas-curador .aba[onclick*="pendentes"] .badge');
    
    if (badge) {
        badge.textContent = estadoCurador.eventosPendentes.length;
    }
}

function exibirListaEventos(tipo, eventos) {
    const container = document.getElementById(`lista-eventos-${tipo}`);
    
    if (!container) return;

    if (eventos.length === 0) {
        container.innerHTML = `
            <div class="sem-eventos">
                <p>📭 Nenhum evento ${tipo === 'pendentes' ? 'pendente' : tipo}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card-curador">
            <div class="evento-header">
                <div>
                    <div class="evento-titulo">${evento.titulo}</div>
                    <span class="evento-categoria">${evento.categoria}</span>
                </div>
                <span class="evento-status status-${tipo}">${tipo === 'pendentes' ? 'Pendente' : tipo === 'aprovados' ? 'Aprovado' : 'Rejeitado'}</span>
            </div>
            <div class="evento-conteudo">
                <div class="evento-info">
                    <p><strong>📅 Data:</strong> ${evento.data}</p>
                    <p><strong>📍 Local:</strong> ${evento.local}</p>
                    <p><strong>👤 Produtor:</strong> ${evento.produtor}</p>
                    <p><strong>💰 Preço:</strong> R$ ${evento.preco?.toFixed(2) || 'Gratuito'}</p>
                    ${evento.descricao ? `<p><strong>📝 Descrição:</strong> ${evento.descricao}</p>` : ''}
                </div>
            </div>
            ${tipo === 'pendentes' ? `
            <div class="evento-acoes">
                <button class="btn btn-secondary" onclick="rejeitarEvento(${evento.id})">
                    <i class="fas fa-times"></i> Rejeitar
                </button>
                <button class="btn btn-primary" onclick="aprovarEvento(${evento.id})">
                    <i class="fas fa-check"></i> Aprovar
                </button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function aprovarEvento(eventoId) {
    const eventoIndex = estadoCurador.eventosPendentes.findIndex(e => e.id === eventoId);
    
    if (eventoIndex !== -1) {
        const evento = estadoCurador.eventosPendentes[eventoIndex];
        evento.dataAprovacao = new Date().toLocaleDateString('pt-BR');
        
        estadoCurador.eventosAprovados.unshift(evento);
        estadoCurador.eventosPendentes.splice(eventoIndex, 1);
        
        exibirEventosCurador();
        mostrarToast('✅ Evento aprovado com sucesso!');
    }
}

function rejeitarEvento(eventoId) {
    const eventoIndex = estadoCurador.eventosPendentes.findIndex(e => e.id === eventoId);
    
    if (eventoIndex !== -1) {
        const evento = estadoCurador.eventosPendentes[eventoIndex];
        evento.dataRejeicao = new Date().toLocaleDateString('pt-BR');
        evento.motivoRejeicao = prompt('Informe o motivo da rejeição:') || 'Não especificado';
        
        estadoCurador.eventosRejeitados.unshift(evento);
        estadoCurador.eventosPendentes.splice(eventoIndex, 1);
        
        exibirEventosCurador();
        mostrarToast('⚠️ Evento rejeitado');
    }
}

// Funções globais
window.mudarAbaCurador = mudarAbaCurador;
window.aprovarEvento = aprovarEvento;
window.rejeitarEvento = rejeitarEvento;
window.inicializarCurador = inicializarCurador;

console.log('✅ Módulo do curador pronto');