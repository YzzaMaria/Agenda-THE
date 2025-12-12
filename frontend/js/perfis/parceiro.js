// parceiro.js - Módulo do Parceiro
console.log('✅ Módulo Parceiro carregado');

const estadoParceiro = {
    abaAtiva: 'campanhas',
    campanhas: [],
    eventosDisponiveis: [],
    estatisticas: {
        campanhasAtivas: 0,
        investimentoTotal: 0,
        visualizacoes: 0
    }
};

function inicializarParceiro() {
    console.log('🚀 Inicializando módulo do parceiro');
    
    configurarAbasParceiro();
    carregarCampanhas();
    carregarEventosDisponiveis();
    carregarEstatisticasParceiro();
    
    console.log('✅ Parceiro inicializado');
}

function configurarAbasParceiro() {
    const abas = document.querySelectorAll('#abas-parceiro .aba');
    abas.forEach(aba => {
        aba.addEventListener('click', function() {
            const abaId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            mudarAbaParceiro(abaId);
        });
    });
}

function mudarAbaParceiro(abaId) {
    console.log(`📁 Mudando para aba: ${abaId}`);
    estadoParceiro.abaAtiva = abaId;
    
    document.querySelectorAll('#abas-parceiro .aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    document.querySelector(`#abas-parceiro .aba[onclick*="${abaId}"]`)?.classList.add('ativa');
    
    document.querySelectorAll('.conteudo-parceiro .aba-conteudo').forEach(conteudo => {
        conteudo.classList.remove('ativa');
    });
    
    document.getElementById(`aba-${abaId}`)?.classList.add('ativa');
}

async function carregarCampanhas() {
    try {
        // Campanhas simuladas
        estadoParceiro.campanhas = [
            {
                id: 1,
                titulo: 'Patrocínio Festival de Jazz',
                evento: 'Festival de Jazz',
                status: 'ativa',
                orcamento: 5000,
                investido: 3200,
                inicio: '01/11/2024',
                fim: '30/11/2024',
                visualizacoes: 12500,
                cliques: 342
            },
            {
                id: 2,
                titulo: 'Apoio Exposição de Arte',
                evento: 'Exposição de Arte Moderna',
                status: 'concluida',
                orcamento: 3000,
                investido: 3000,
                inicio: '01/10/2024',
                fim: '31/10/2024',
                visualizacoes: 8500,
                cliques: 210
            },
            {
                id: 3,
                titulo: 'Sponsorship Show MPB',
                evento: 'Show de Música Popular',
                status: 'planejada',
                orcamento: 8000,
                investido: 0,
                inicio: '01/12/2024',
                fim: '31/12/2024',
                visualizacoes: 0,
                cliques: 0
            }
        ];
        
        exibirCampanhas();
    } catch (error) {
        console.error('❌ Erro ao carregar campanhas:', error);
    }
}

function exibirCampanhas() {
    const container = document.getElementById('lista-campanhas');
    if (!container) return;
    
    if (estadoParceiro.campanhas.length === 0) {
        container.innerHTML = `
            <div class="sem-campanhas">
                <p>🎯 Você ainda não tem campanhas</p>
                <p class="texto-secundario">Clique em "Nova Campanha" para começar!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = estadoParceiro.campanhas.map(campanha => {
        const progresso = campanha.orcamento > 0 ? (campanha.investido / campanha.orcamento) * 100 : 0;
        const progressoTexto = progresso.toFixed(0);
        
        return `
            <div class="campanha-card">
                <div class="campanha-header">
                    <div class="campanha-titulo">${campanha.titulo}</div>
                    <span class="campanha-status status-${campanha.status}">${campanha.status}</span>
                </div>
                <div class="campanha-info">
                    <div>
                        <i class="fas fa-calendar-alt"></i>
                        <span>Evento: ${campanha.evento}</span>
                    </div>
                    <div>
                        <i class="fas fa-calendar"></i>
                        <span>${campanha.inicio} → ${campanha.fim}</span>
                    </div>
                </div>
                <div class="campanha-orcamento">
                    <strong>Investimento:</strong> R$ ${campanha.investido.toLocaleString('pt-BR', {minimumFractionDigits: 2})} / R$ ${campanha.orcamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </div>
                <div class="campanha-progresso">
                    <div class="campanha-progresso-bar" style="width: ${progresso}%"></div>
                </div>
                <div class="campanha-metrics">
                    <div class="metric">
                        <i class="fas fa-eye"></i>
                        <span>${campanha.visualizacoes.toLocaleString()} visualizações</span>
                    </div>
                    <div class="metric">
                        <i class="fas fa-mouse-pointer"></i>
                        <span>${campanha.cliques} cliques</span>
                    </div>
                </div>
                <div class="campanha-actions">
                    <button class="btn btn-secondary" onclick="editarCampanha(${campanha.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-primary" onclick="verDetalhesCampanha(${campanha.id})">
                        <i class="fas fa-chart-line"></i> Detalhes
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function carregarEventosDisponiveis() {
    try {
        // Eventos disponíveis para patrocínio
        estadoParceiro.eventosDisponiveis = [
            {
                id: 1,
                titulo: 'Festival de Jazz',
                categoria: 'musica',
                data: '15/11/2024',
                local: 'Parque da Cidade',
                publicoEstimado: 150,
                orcamentoNecessario: 5000,
                beneficios: ['Logo no material', 'Redes sociais', 'Stand no evento']
            },
            {
                id: 2,
                titulo: 'Exposição de Arte Moderna',
                categoria: 'arte',
                data: '20/11/2024',
                local: 'Museu de Arte',
                publicoEstimado: 100,
                orcamentoNecessario: 3000,
                beneficios: ['Logo na entrada', 'Catálogo', 'Menção na mídia']
            },
            {
                id: 3,
                titulo: 'Feira Gastronômica',
                categoria: 'gastronomia',
                data: '25/11/2024',
                local: 'Parque da Cidadania',
                publicoEstimado: 300,
                orcamentoNecessario: 4000,
                beneficios: ['Stand premium', 'Degustação', 'Material gráfico']
            }
        ];
        
        exibirEventosDisponiveis();
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
    }
}

function exibirEventosDisponiveis() {
    const container = document.getElementById('lista-eventos-parceiro');
    if (!container) return;
    
    container.innerHTML = estadoParceiro.eventosDisponiveis.map(evento => `
        <div class="evento-card">
            <div class="evento-imagem" style="background: linear-gradient(135deg, #4f46e5, #6366f1)"></div>
            <div class="evento-conteudo">
                <div class="evento-cabecalho">
                    <div>
                        <div class="evento-titulo">${evento.titulo}</div>
                        <span class="evento-categoria">${evento.categoria}</span>
                        <span class="evento-destaque-parceiro">🏆 Disponível para patrocínio</span>
                    </div>
                    <span class="evento-favorito"><i class="fas fa-handshake"></i></span>
                </div>
                <div class="evento-info">
                    <div class="evento-data">📅 ${evento.data}</div>
                    <div class="evento-local">📍 ${evento.local}</div>
                    <div class="evento-publico">👥 Público estimado: ${evento.publicoEstimado}</div>
                </div>
                <div class="evento-beneficios">
                    <strong>Benefícios incluídos:</strong>
                    <ul>
                        ${evento.beneficios.map(beneficio => `<li>${beneficio}</li>`).join('')}
                    </ul>
                </div>
                <div class="evento-rodape">
                    <div class="evento-orcamento">
                        <strong>Investimento:</strong> R$ ${evento.orcamentoNecessario.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <button class="btn btn-primary" onclick="proporPatrocinio(${evento.id})">
                        <i class="fas fa-handshake"></i> Propor Patrocínio
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function criarNovaCampanha() {
    console.log('🆕 Criando nova campanha');
    
    const modalHTML = `
        <div class="modal-overlay" onclick="fecharModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Nova Campanha de Patrocínio</h2>
                    <button class="modal-close" onclick="fecharModal()">✕</button>
                </div>
                <div class="modal-body">
                    <form id="form-nova-campanha">
                        <div class="form-group">
                            <label for="campanha-titulo">Título da Campanha</label>
                            <input type="text" id="campanha-titulo" placeholder="Ex: Patrocínio Festival de Jazz" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="campanha-evento">Evento</label>
                            <select id="campanha-evento" required>
                                <option value="">Selecione um evento</option>
                                ${estadoParceiro.eventosDisponiveis.map(evento => 
                                    `<option value="${evento.id}">${evento.titulo}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="campanha-inicio">Data de Início</label>
                                <input type="date" id="campanha-inicio" required>
                            </div>
                            <div class="form-group">
                                <label for="campanha-fim">Data de Término</label>
                                <input type="date" id="campanha-fim" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="campanha-orcamento">Orçamento Total (R$)</label>
                            <input type="number" id="campanha-orcamento" min="0" step="0.01" placeholder="5000.00" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="campanha-objetivos">Objetivos da Campanha</label>
                            <textarea id="campanha-objetivos" rows="3" placeholder="Descreva os objetivos desta campanha..."></textarea>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Criar Campanha</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'modal-nova-campanha';
    document.body.appendChild(modal);
    
    // Configurar formulário
    const form = document.getElementById('form-nova-campanha');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarNovaCampanha(this);
    });
    
    // Definir datas padrão
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    document.getElementById('campanha-inicio').valueAsDate = amanha;
    document.getElementById('campanha-fim').valueAsDate = new Date(amanha);
    document.getElementById('campanha-fim').valueAsDate.setMonth(amanha.getMonth() + 1);
}

function salvarNovaCampanha(form) {
    const formData = new FormData(form);
    
    const novaCampanha = {
        id: estadoParceiro.campanhas.length + 1,
        titulo: formData.get('titulo') || 'Nova Campanha',
        evento: 'Festival de Jazz', // Buscar do select
        status: 'planejada',
        orcamento: parseFloat(formData.get('orcamento')) || 0,
        investido: 0,
        inicio: formData.get('inicio') || new Date().toISOString().split('T')[0],
        fim: formData.get('fim') || new Date().toISOString().split('T')[0],
        visualizacoes: 0,
        cliques: 0
    };
    
    estadoParceiro.campanhas.unshift(novaCampanha);
    exibirCampanhas();
    atualizarEstatisticasParceiro();
    fecharModal();
    mostrarToast('✅ Campanha criada com sucesso!');
}

function editarCampanha(campanhaId) {
    console.log('✏️ Editando campanha:', campanhaId);
    mostrarToast('✏️ Funcionalidade de edição em desenvolvimento!');
}

function verDetalhesCampanha(campanhaId) {
    const campanha = estadoParceiro.campanhas.find(c => c.id === campanhaId);
    if (campanha) {
        alert(`Detalhes da Campanha:\n\n${campanha.titulo}\n📅 ${campanha.inicio} → ${campanha.fim}\n💰 R$ ${campanha.investido.toFixed(2)} / R$ ${campanha.orcamento.toFixed(2)}\n👁️ ${campanha.visualizacoes} visualizações\n🖱️ ${campanha.cliques} cliques`);
    }
}

function proporPatrocinio(eventoId) {
    const evento = estadoParceiro.eventosDisponiveis.find(e => e.id === eventoId);
    if (evento) {
        const valor = prompt(`Propor patrocínio para "${evento.titulo}"\n\nValor do investimento (R$):`);
        if (valor && !isNaN(valor)) {
            mostrarToast(`✅ Proposta de patrocínio enviada!\nEvento: ${evento.titulo}\nValor: R$ ${parseFloat(valor).toFixed(2)}`);
        }
    }
}

function carregarEstatisticasParceiro() {
    // Calcular estatísticas
    estadoParceiro.estatisticas.campanhasAtivas = estadoParceiro.campanhas.filter(c => c.status === 'ativa').length;
    estadoParceiro.estatisticas.investimentoTotal = estadoParceiro.campanhas.reduce((total, campanha) => total + campanha.investido, 0);
    estadoParceiro.estatisticas.visualizacoes = estadoParceiro.campanhas.reduce((total, campanha) => total + campanha.visualizacoes, 0);
    
    atualizarEstatisticasParceiro();
}

function atualizarEstatisticasParceiro() {
    const estatisticas = estadoParceiro.estatisticas;
    
    document.querySelectorAll('#aba-relatorios .card-estatistica .estatistica-valor').forEach((el, index) => {
        switch(index) {
            case 0:
                el.textContent = estatisticas.campanhasAtivas;
                break;
            case 1:
                el.textContent = `R$ ${estatisticas.investimentoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
                break;
            case 2:
                el.textContent = estatisticas.visualizacoes.toLocaleString();
                break;
        }
    });
}

// Funções auxiliares
function fecharModal() {
    const modal = document.getElementById('modal-nova-campanha');
    if (modal) modal.remove();
}

// Funções globais
window.mudarAbaParceiro = mudarAbaParceiro;
window.criarNovaCampanha = criarNovaCampanha;
window.editarCampanha = editarCampanha;
window.verDetalhesCampanha = verDetalhesCampanha;
window.proporPatrocinio = proporPatrocinio;
window.inicializarParceiro = inicializarParceiro;

console.log('✅ Módulo do parceiro pronto');