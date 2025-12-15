// detalhes-evento.js -- Tela de Detalhes do Evento
console.log('✅ Módulo Detalhes do Evento carregado');

let eventoDetalhes = null;

function abrirDetalhesEvento(eventoId) {
    console.log('🔍 Abrindo detalhes do evento:', eventoId);
    
    eventoDetalhes = {
        id: eventoId,
        titulo: 'Festival de Jazz',
        descricao: 'Um incrível festival de jazz com artistas locais e nacionais. Venha curtir uma noite de boa música, comida e drinks especiais.',
        categoria: 'Música',
        data: '15 de Novembro de 2024',
        hora: '20:00',
        local: 'Parque da Cidade, Teresina - PI',
        endereco: 'Av. Raul Lopes, 1000 - Centro',
        preco: 50.00,
        lotacao: 150,
        ingressosVendidos: 120,
        organizador: 'Produções Musicais LTDA',
        contato: 'contato@producoesmusicais.com',
        destaque: true,
        imagens: [
            'https://via.placeholder.com/400x200/9333ea/ffffff?text=Festival+Jazz',
            'https://via.placeholder.com/400x200/ec4899/ffffff?text=Show+Ao+Vivo'
        ]
    };
    
    carregarTelaDetalhes();
}

function carregarTelaDetalhes() {
    if (!eventoDetalhes) return;
    
    const tela = document.getElementById('tela-detalhes-evento');
    
    if (!tela) return;

    const percentualLotacao = Math.min(100, (eventoDetalhes.ingressosVendidos / eventoDetalhes.lotacao) * 100);
    
    tela.innerHTML = `
        <div class="header">
            <div class="header-topo">
                <button class="btn-voltar" onclick="voltarParaTelaAnterior()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="header-titulo">Detalhes do Evento</h1>
                <div class="header-icones">
                    <span class="icone" onclick="compartilharEvento(${eventoDetalhes.id})">
                        <i class="fas fa-share-alt"></i>
                    </span>
                    <span class="icone" onclick="alternarFavoritoEvento(${eventoDetalhes.id})">
                        <i class="far fa-heart"></i>
                    </span>
                </div>
            </div>
        </div>

        <div class="detalhes-conteudo">
            <!-- Imagem do Evento -->
            <div class="evento-imagem-grande">
                <div class="evento-destaque-modal">🔥 Destaque</div>
                <div class="lotacao-indicator" title="${eventoDetalhes.ingressosVendidos}/${eventoDetalhes.lotacao} ingressos vendidos">
                    <div class="lotacao-bar" style="width: ${percentualLotacao}%"></div>
                </div>
            </div>

            <!-- Informações Principais -->
            <div class="evento-info-detalhada">
                <h1 class="detalhes-titulo">${eventoDetalhes.titulo}</h1>
                
                <div class="info-item">
                    <div class="info-icone">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-conteudo">
                        <h3>Data e Hora</h3>
                        <p>${eventoDetalhes.data} às ${eventoDetalhes.hora}</p>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icone">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="info-conteudo">
                        <h3>Local</h3>
                        <p>${eventoDetalhes.local}</p>
                        <p class="texto-pequeno">${eventoDetalhes.endereco}</p>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icone">
                        <i class="fas fa-tag"></i>
                    </div>
                    <div class="info-conteudo">
                        <h3>Categoria</h3>
                        <p>${eventoDetalhes.categoria}</p>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icone">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="info-conteudo">
                        <h3>Lotacao</h3>
                        <p>${eventoDetalhes.ingressosVendidos}/${eventoDetalhes.lotacao} ingressos vendidos</p>
                        <div class="progresso-lotacao">
                            <div class="progresso-bar" style="width: ${percentualLotacao}%"></div>
                        </div>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icone">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="info-conteudo">
                        <h3>Organizador</h3>
                        <p>${eventoDetalhes.organizador}</p>
                        <p class="texto-pequeno">${eventoDetalhes.contato}</p>
                    </div>
                </div>
            </div>

            <!-- Descrição -->
            <div class="secao-detalhes">
                <h2 class="secao-titulo">Sobre o Evento</h2>
                <div class="descricao-evento">
                    <p>${eventoDetalhes.descricao}</p>
                </div>
            </div>

            <!-- Mapa (simulado) -->
            <div class="secao-detalhes">
                <h2 class="secao-titulo">Localização</h2>
                <div class="mapa-container">
                    <div class="mapa-simulado">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Mapa do local do evento</p>
                    </div>
                </div>
            </div>

            <!-- Comentários -->
            <div class="secao-detalhes">
                <h2 class="secao-titulo">Comentários (3)</h2>
                <div class="comentarios-lista">
                    <div class="comentario">
                        <div class="comentario-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="comentario-conteudo">
                            <div class="comentario-autor">Maria Silva</div>
                            <div class="comentario-data">Há 2 dias</div>
                            <div class="comentario-texto">
                                Evento incrível! A organização foi perfeita e os artistas eram fantásticos. Recomendo muito!
                            </div>
                        </div>
                    </div>

                    <div class="comentario">
                        <div class="comentario-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="comentario-conteudo">
                            <div class="comentario-autor">João Santos</div>
                            <div class="comentario-data">Há 1 semana</div>
                            <div class="comentario-texto">
                                Ambiente muito agradável e música de qualidade. Voltarei com certeza!
                            </div>
                        </div>
                    </div>
                </div>

                <div class="novo-comentario">
                    <textarea placeholder="Deixe seu comentário..." rows="2"></textarea>
                    <button class="btn btn-primary" onclick="adicionarComentario()">
                        <i class="fas fa-paper-plane"></i> Enviar
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer Fixo -->
        <div class="detalhes-footer">
            <div class="preco-container">
                <div class="preco-label">Preço do Ingresso</div>
                <div class="preco-valor">R$ ${eventoDetalhes.preco.toFixed(2)}</div>
            </div>
            <div class="footer-botoes">
                <button class="btn btn-secondary" onclick="mostrarMaisInformacoes()">
                    <i class="fas fa-info-circle"></i> Mais Info
                </button>
                <button class="btn btn-primary" onclick="comprarIngresso(${eventoDetalhes.id})">
                    <i class="fas fa-ticket-alt"></i> Comprar Ingresso
                </button>
            </div>
        </div>
    `;

    adicionarEstilosDetalhes();
    mudarTela('detalhes-evento');
}

function adicionarEstilosDetalhes() {
    const styleId = 'estilos-detalhes-evento';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #tela-detalhes-evento .btn-voltar {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                cursor: pointer;
            }
            .detalhes-conteudo {
                padding-bottom: 120px;
            }
            .evento-imagem-grande {
                height: 250px;
                background: linear-gradient(135deg, #9333ea, #ec4899);
                position: relative;
                display: flex;
                align-items: flex-end;
            }
            .evento-destaque-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                background: #f59e0b;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .lotacao-indicator {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.3);
            }
            .lotacao-bar {
                height: 100%;
                background: #10b981;
                transition: width 0.3s ease;
            }
            .evento-info-detalhada {
                background: white;
                border-radius: 16px;
                margin: -40px 20px 20px 20px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            .secao-detalhes {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin: 0 20px 20px 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .texto-pequeno {
                font-size: 0.85rem;
                color: #64748b;
                margin-top: 4px;
            }
            .progresso-lotacao {
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                margin-top: 8px;
                overflow: hidden;
            }
            .progresso-bar {
                height: 100%;
                background: #9333ea;
                border-radius: 4px;
            }
            .descricao-evento {
                color: #475569;
                line-height: 1.6;
                margin-top: 12px;
            }
            .mapa-container {
                margin-top: 12px;
            }
            .mapa-simulado {
                height: 150px;
                background: #f1f5f9;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #64748b;
            }
            .mapa-simulado i {
                font-size: 3rem;
                margin-bottom: 10px;
                color: #9333ea;
            }
            .comentarios-lista {
                margin-top: 16px;
            }
            .comentario {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #f1f5f9;
            }
            .comentario:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .comentario-avatar {
                width: 40px;
                height: 40px;
                background: #cbd5e1;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                flex-shrink: 0;
            }
            .comentario-conteudo {
                flex: 1;
            }
            .comentario-autor {
                font-weight: 600;
                color: #1e293b;
            }
            .comentario-data {
                font-size: 0.8rem;
                color: #94a3b8;
                margin-bottom: 6px;
            }
            .comentario-texto {
                color: #475569;
                line-height: 1.5;
            }
            .novo-comentario {
                margin-top: 20px;
                display: flex;
                gap: 12px;
            }
            .novo-comentario textarea {
                flex: 1;
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.9rem;
                resize: none;
            }
            .novo-comentario button {
                align-self: flex-end;
            }
            #tela-detalhes-evento .detalhes-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                padding: 16px 20px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 1000;
            }
            .preco-container {
                display: flex;
                flex-direction: column;
            }
            .preco-label {
                font-size: 0.8rem;
                color: #64748b;
            }
            .preco-valor {
                font-size: 1.5rem;
                font-weight: bold;
                color: #9333ea;
            }
            .footer-botoes {
                display: flex;
                gap: 12px;
            }
            .footer-botoes .btn {
                padding: 12px 20px;
            }
        `;
        document.head.appendChild(style);
    }
}

function voltarParaTelaAnterior() {
    mudarTela('usuario-final');
}

function alternarFavoritoEvento(eventoId) {
    const icone = document.querySelector('#tela-detalhes-evento .fa-heart, #tela-detalhes-evento .far');
    
    if (icone) {
        icone.classList.toggle('fas');
        icone.classList.toggle('far');
        mostrarToast(icone.classList.contains('fas') ? '❤️ Evento favoritado!' : '🤍 Evento removido dos favoritos');
    }
}

function compartilharEvento(eventoId) {
    if (navigator.share) {
        navigator.share({
            title: eventoDetalhes.titulo,
            text: `Confira o evento: ${eventoDetalhes.titulo}`,
            url: window.location.href
        });
    } else {
        mostrarToast('🔗 Link copiado para a área de transferência!');
    }
}

function comprarIngresso(eventoId) {
    mostrarToast(`🎫 Redirecionando para compra do ingresso...\nEvento: ${eventoDetalhes.titulo}\nValor: R$ ${eventoDetalhes.preco.toFixed(2)}`);
}

function mostrarMaisInformacoes() {
    alert(`Informações Adicionais:\n\n📞 Contato: ${eventoDetalhes.contato}\n🏢 Organizador: ${eventoDetalhes.organizador}\n🎫 Ingressos restantes: ${eventoDetalhes.lotacao - eventoDetalhes.ingressosVendidos}\n\nℹ️ Política de reembolso: Consulte o organizador.`);
}

function adicionarComentario() {
    const textarea = document.querySelector('#tela-detalhes-evento .novo-comentario textarea');
    
    if (textarea && textarea.value.trim()) {
        mostrarToast('💬 Comentário enviado!');
        textarea.value = '';
    }
}

// Funções globais
window.abrirDetalhesEvento = abrirDetalhesEvento;
window.voltarParaTelaAnterior = voltarParaTelaAnterior;
window.alternarFavoritoEvento = alternarFavoritoEvento;
window.compartilharEvento = compartilharEvento;
window.comprarIngresso = comprarIngresso;
window.mostrarMaisInformacoes = mostrarMaisInformacoes;
window.adicionarComentario = adicionarComentario;

console.log('✅ Módulo de detalhes do evento pronto');