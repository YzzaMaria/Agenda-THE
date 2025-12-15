// produtor.js -- Módulo do Produtor
console.log('✅ Módulo Produtor carregado');

const estadoProdutor = {
    abaAtiva: 'meus-eventos',
    eventos: [],
    estatisticas: {
        eventosCriados: 0,
        ingressosVendidos: 0,
        faturamento: 0
    }
};

function inicializarProdutor() {
    console.log('🚀 Inicializando módulo do produtor');
    configurarAbasProdutor();
    carregarEventosProdutor();
    carregarEstatisticas();
    configurarFormularioEvento();
    console.log('✅ Produtor inicializado');
}

function configurarAbasProdutor() {
    const abas = document.querySelectorAll('#abas-produtor .aba');
    
    abas.forEach(aba => {
        aba.addEventListener('click', function() {
            const abaId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            mudarAbaProdutor(abaId);
        });
    });
}

function mudarAbaProdutor(abaId) {
    console.log(`📁 Mudando para aba: ${abaId}`);
    estadoProdutor.abaAtiva = abaId;

    document.querySelectorAll('#abas-produtor .aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    document.querySelector(`#abas-produtor .aba[onclick*="${abaId}"]`)?.classList.add('ativa');

    document.querySelectorAll('.conteudo-produtor .aba-conteudo').forEach(conteudo => {
        conteudo.classList.remove('ativa');
    });
    
    document.getElementById(`aba-${abaId}`)?.classList.add('ativa');
}

async function carregarEventosProdutor() {
    try {
        estadoProdutor.eventos = [
            {
                id: 1,
                titulo: 'Festival de Jazz',
                categoria: 'musica',
                data: '15/11/2024',
                local: 'Parque da Cidade',
                preco: 50,
                ingressosVendidos: 120,
                lotacao: 150,
                status: 'ativo'
            },
            {
                id: 2,
                titulo: 'Workshop de Arte',
                categoria: 'arte',
                data: '22/11/2024',
                local: 'Centro Cultural',
                preco: 30,
                ingressosVendidos: 45,
                lotacao: 60,
                status: 'ativo'
            }
        ];
        
        exibirEventosProdutor();
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
    }
}

function exibirEventosProdutor() {
    const container = document.getElementById('lista-eventos-produtor');
    
    if (!container) return;

    if (estadoProdutor.eventos.length === 0) {
        container.innerHTML = `
            <div class="sem-eventos">
                <p>📭 Você ainda não criou eventos</p>
                <p class="texto-secundario">Clique em "Criar Evento" para começar!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = estadoProdutor.eventos.map(evento => `
        <div class="evento-card" onclick="verDetalhesEventoProdutor(${evento.id})">
            <div class="evento-imagem" style="background: linear-gradient(135deg, #9333ea, #ec4899)"></div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">${evento.titulo}</div>
                        <span class="evento-categoria">${evento.categoria}</span>
                        <span class="evento-status ${evento.status}">${evento.status}</span>
                    </div>
                    <span class="evento-favorito"><i class="fas fa-ellipsis-v"></i></span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 ${evento.data}</div>
                    <div class="evento-local">📍 ${evento.local}</div>
                </div>
                <div class="evento-rodape">
                    <div class="evento-preco">R$ ${evento.preco.toFixed(2)}</div>
                    <div class="evento-vendas">
                        <small>${evento.ingressosVendidos}/${evento.lotacao} ingressos</small>
                    </div>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); editarEvento(${evento.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function configurarFormularioEvento() {
    const form = document.getElementById('form-criar-evento');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            criarNovoEvento(this);
        });
    }
}

function criarNovoEvento(form) {
    const formData = new FormData(form);
    
    const novoEvento = {
        titulo: formData.get('titulo') || 'Novo Evento',
        descricao: formData.get('descricao') || '',
        categoria: formData.get('categoria') || 'musica',
        data: formData.get('data') || new Date().toISOString().split('T')[0],
        hora: formData.get('hora') || '19:00',
        local: formData.get('local') || 'Local a definir',
        preco: parseFloat(formData.get('preco')) || 0,
        lotacao: parseInt(formData.get('lotacao')) || 100
    };

    console.log('🎉 Criando novo evento:', novoEvento);

    estadoProdutor.eventos.unshift({
        id: estadoProdutor.eventos.length + 1,
        ...novoEvento,
        ingressosVendidos: 0,
        status: 'rascunho'
    });

    estadoProdutor.estatisticas.eventosCriados++;
    form.reset();
    mudarAbaProdutor('meus-eventos');
    exibirEventosProdutor();
    atualizarEstatisticas();
    mostrarToast('✅ Evento criado com sucesso!');
}

function carregarEstatisticas() {
    estadoProdutor.estatisticas = {
        eventosCriados: estadoProdutor.eventos.length,
        ingressosVendidos: estadoProdutor.eventos.reduce((total, evento) => total + evento.ingressosVendidos, 0),
        faturamento: estadoProdutor.eventos.reduce((total, evento) => total + (evento.ingressosVendidos * evento.preco), 0)
    };
    
    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    const estatisticas = estadoProdutor.estatisticas;
    
    document.querySelectorAll('.card-estatistica .estatistica-valor').forEach((el, index) => {
        switch(index) {
            case 0:
                el.textContent = estatisticas.eventosCriados;
                break;
            case 1:
                el.textContent = estatisticas.ingressosVendidos.toLocaleString();
                break;
            case 2:
                el.textContent = `R$ ${estatisticas.faturamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
                break;
        }
    });
}

function verDetalhesEventoProdutor(eventoId) {
    const evento = estadoProdutor.eventos.find(e => e.id === eventoId);
    
    if (evento) {
        console.log('🔍 Visualizando evento do produtor:', evento.titulo);
        
        alert(`Detalhes do Evento:\n\n${evento.titulo}\n📅 ${evento.data}\n📍 ${evento.local}\n💰 R$ ${evento.preco.toFixed(2)}\n🎫 ${evento.ingressosVendidos}/${evento.lotacao} ingressos`);
    }
}

function editarEvento(eventoId) {
    const evento = estadoProdutor.eventos.find(e => e.id === eventoId);
    
    if (evento) {
        console.log('✏️ Editando evento:', evento.titulo);
        mudarAbaProdutor('criar-evento');
        
        const form = document.getElementById('form-criar-evento');
        
        if (form) {
            form.querySelector('input[type="text"]').value = evento.titulo;
            const btnSubmit = form.querySelector('button[type="submit"]');
            
            if (btnSubmit) {
                btnSubmit.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
                btnSubmit.onclick = function() { salvarEdicaoEvento(eventoId); };
            }
        }
    }
}

function salvarEdicaoEvento(eventoId) {
    console.log('💾 Salvando edição do evento:', eventoId);
    mostrarToast('✅ Evento atualizado com sucesso!');
    mudarAbaProdutor('meus-eventos');
}

// Funções globais
window.mudarAbaProdutor = mudarAbaProdutor;
window.verDetalhesEventoProdutor = verDetalhesEventoProdutor;
window.editarEvento = editarEvento;
window.criarNovoEvento = criarNovoEvento;
window.inicializarProdutor = inicializarProdutor;

console.log('✅ Módulo do produtor pronto');