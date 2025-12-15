// perfil-usuario.js - Tela de Perfil do Usuário
console.log('✅ Módulo Perfil do Usuário carregado');

let usuarioPerfil = null;

function abrirPerfilUsuario() {
    console.log('👤 Abrindo perfil do usuário');
    
    usuarioPerfil = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(86) 99999-9999',
        tipoPerfil: 'usuario_final',
        nivel: 'Explorador',
        pontos: 1250,
        dataCadastro: '15/10/2024',
        eventosParticipados: 8,
        checkinsRealizados: 12,
        badges: 4,
        bio: 'Apaixonado por música e eventos culturais. Sempre em busca de novas experiências!'
    };
    
    carregarTelaPerfil();
}

function carregarTelaPerfil() {
    if (!usuarioPerfil) return;
    
    const tela = document.getElementById('tela-perfil-usuario');
    
    if (!tela) return;

    const proximoNivel = usuarioPerfil.pontos >= 2000 ? 'Mestre' :
                        usuarioPerfil.pontos >= 1000 ? 'Explorador' : 'Novato';
    
    const progressoNivel = usuarioPerfil.pontos >= 2000 ? 100 :
                          usuarioPerfil.pontos >= 1000 ? ((usuarioPerfil.pontos - 1000) / 1000) * 100 :
                          (usuarioPerfil.pontos / 1000) * 100;

    tela.innerHTML = `
        <!-- Header do Perfil -->
        <div class="perfil-header-completo">
            <button class="btn-voltar-perfil" onclick="voltarParaHomePerfil()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div class="perfil-avatar-grande">
                <i class="fas fa-user" style="font-size: 3rem; color: #9333ea; line-height: 100px;"></i>
            </div>
            <h1 class="perfil-nome">${usuarioPerfil.nome}</h1>
            <p class="perfil-nivel">${usuarioPerfil.nivel} • ${usuarioPerfil.pontos} pontos</p>
        </div>

        <!-- Conteúdo do Perfil -->
        <div class="conteudo-perfil">
            <div class="perfil-info-completa">
                <!-- Barra de Progresso -->
                <div class="progresso-nivel">
                    <div class="progresso-info">
                        <span>Nível atual: ${usuarioPerfil.nivel}</span>
                        <span>Próximo: ${proximoNivel}</span>
                    </div>
                    <div class="progresso-bar-nivel">
                        <div class="progresso-fill" style="width: ${progressoNivel}%"></div>
                    </div>
                    <div class="progresso-pontos">
                        <span>${usuarioPerfil.pontos} / ${usuarioPerfil.pontos >= 1000 ? '2000' : '1000'} pontos</span>
                    </div>
                </div>

                <!-- Estatísticas -->
                <div class="perfil-stats">
                    <div class="perfil-stat">
                        <div class="perfil-stat-valor">${usuarioPerfil.eventosParticipados}</div>
                        <div class="perfil-stat-label">Eventos</div>
                    </div>
                    <div class="perfil-stat">
                        <div class="perfil-stat-valor">${usuarioPerfil.checkinsRealizados}</div>
                        <div class="perfil-stat-label">Check-ins</div>
                    </div>
                    <div class="perfil-stat">
                        <div class="perfil-stat-valor">${usuarioPerfil.badges}</div>
                        <div class="perfil-stat-label">Badges</div>
                    </div>
                </div>

                <!-- Biografia -->
                <div class="perfil-bio">
                    <h3>Sobre mim</h3>
                    <p>${usuarioPerfil.bio}</p>
                </div>

                <!-- Informações de Contato -->
                <div class="perfil-contato">
                    <h3>Informações de Contato</h3>
                    <div class="contato-item">
                        <i class="fas fa-envelope"></i>
                        <span>${usuarioPerfil.email}</span>
                    </div>
                    <div class="contato-item">
                        <i class="fas fa-phone"></i>
                        <span>${usuarioPerfil.telefone}</span>
                    </div>
                    <div class="contato-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Membro desde ${usuarioPerfil.dataCadastro}</span>
                    </div>
                </div>

                <!-- Badges -->
                <div class="perfil-badges">
                    <h3>Minhas Badges</h3>
                    <div class="perfil-badges-grid">
                        <div class="perfil-badge-item" title="Primeiro Evento">
                            <i class="fas fa-star"></i>
                            <small>Iniciante</small>
                        </div>
                        <div class="perfil-badge-item" title="5 Eventos de Música">
                            <i class="fas fa-music"></i>
                            <small>Melômano</small>
                        </div>
                        <div class="perfil-badge-item" title="10 Check-ins">
                            <i class="fas fa-check-circle"></i>
                            <small>Frequente</small>
                        </div>
                        <div class="perfil-badge-item" title="Primeira Compra">
                            <i class="fas fa-shopping-cart"></i>
                            <small>Comprador</small>
                        </div>
                    </div>
                </div>

                <!-- Histórico de Eventos -->
                <div class="perfil-historico">
                    <h3>Últimos Eventos Participados</h3>
                    <div class="eventos-recentes">
                        <div class="evento-recente">
                            <div class="evento-recente-info">
                                <div class="evento-recente-titulo">Festival de Jazz</div>
                                <div class="evento-recente-data">15/11/2024</div>
                            </div>
                            <div class="evento-recente-status">
                                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                Participou
                            </div>
                        </div>
                        <div class="evento-recente">
                            <div class="evento-recente-info">
                                <div class="evento-recente-titulo">Exposição de Arte</div>
                                <div class="evento-recente-data">10/11/2024</div>
                            </div>
                            <div class="evento-recente-status">
                                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                Participou
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Configurações -->
                <div class="perfil-configuracoes">
                    <h3>Configurações</h3>
                    <div class="configuracoes-lista">
                        <button class="configuracao-item" onclick="editarPerfil()">
                            <i class="fas fa-user-edit"></i>
                            <span>Editar Perfil</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="configuracao-item" onclick="alterarSenha()">
                            <i class="fas fa-lock"></i>
                            <span>Alterar Senha</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="configuracao-item" onclick="configurarNotificacoes()">
                            <i class="fas fa-bell"></i>
                            <span>Notificações</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="configuracao-item" onclick="ajudaSuporte()">
                            <i class="fas fa-question-circle"></i>
                            <span>Ajuda e Suporte</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="configuracao-item configuracao-sair" onclick="sairDaConta()">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Sair da Conta</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
            <div class="nav-item" onclick="voltarParaHomePerfil()">
                <span class="nav-icone"><i class="fas fa-home"></i></span>
                <span class="nav-texto">Início</span>
            </div>
            <div class="nav-item">
                <span class="nav-icone"><i class="fas fa-search"></i></span>
                <span class="nav-texto">Buscar</span>
            </div>
            <div class="nav-item">
                <span class="nav-icone"><i class="fas fa-heart"></i></span>
                <span class="nav-texto">Favoritos</span>
            </div>
            <div class="nav-item ativa">
                <span class="nav-icone"><i class="fas fa-user"></i></span>
                <span class="nav-texto">Perfil</span>
            </div>
        </div>
    `;

    adicionarEstilosPerfil();
    mudarTela('perfil-usuario');
}

function adicionarEstilosPerfil() {
    const styleId = 'estilos-perfil-usuario';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .perfil-header-completo {
                background: linear-gradient(135deg, #9333ea, #ec4899);
                color: white;
                padding: 60px 20px 30px 20px;
                text-align: center;
                position: relative;
            }
            .btn-voltar-perfil {
                position: absolute;
                top: 20px;
                left: 20px;
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
            .perfil-avatar-grande {
                width: 100px;
                height: 100px;
                background: white;
                border-radius: 50%;
                margin: 0 auto 20px auto;
                border: 4px solid white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .perfil-nome {
                margin: 0;
                font-size: 1.5rem;
                font-weight: bold;
            }
            .perfil-nivel {
                margin: 8px 0 0 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
            .conteudo-perfil {
                padding-bottom: 80px;
            }
            .perfil-info-completa {
                background: white;
                border-radius: 24px;
                margin: -30px 16px 20px 16px;
                padding: 30px 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .progresso-nivel {
                margin-bottom: 30px;
            }
            .progresso-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 0.9rem;
                color: #64748b;
            }
            .progresso-bar-nivel {
                height: 10px;
                background: #e2e8f0;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .progresso-fill {
                height: 100%;
                background: linear-gradient(90deg, #9333ea, #ec4899);
                border-radius: 5px;
                transition: width 0.3s ease;
            }
            .progresso-pontos {
                text-align: center;
                font-size: 0.8rem;
                color: #64748b;
            }
            .perfil-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin: 30px 0;
                text-align: center;
            }
            .perfil-stat-valor {
                font-size: 1.8rem;
                font-weight: bold;
                color: #9333ea;
                margin-bottom: 4px;
            }
            .perfil-stat-label {
                color: #64748b;
                font-size: 0.85rem;
            }
            .perfil-bio {
                margin: 30px 0;
                padding: 20px;
                background: #f8fafc;
                border-radius: 12px;
            }
            .perfil-bio h3 {
                margin: 0 0 12px 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .perfil-bio p {
                margin: 0;
                color: #475569;
                line-height: 1.6;
            }
            .perfil-contato {
                margin: 30px 0;
            }
            .perfil-contato h3 {
                margin: 0 0 16px 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .contato-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .contato-item:last-child {
                border-bottom: none;
            }
            .contato-item i {
                width: 24px;
                color: #9333ea;
            }
            .perfil-badges {
                margin: 30px 0;
            }
            .perfil-badges h3 {
                margin: 0 0 16px 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .perfil-badges-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
            }
            .perfil-badge-item {
                aspect-ratio: 1;
                background: linear-gradient(135deg, #9333ea, #ec4899);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .perfil-badge-item:hover {
                transform: scale(1.05);
            }
            .perfil-badge-item small {
                font-size: 0.7rem;
                margin-top: 4px;
                opacity: 0.9;
            }
            .perfil-historico {
                margin: 30px 0;
            }
            .perfil-historico h3 {
                margin: 0 0 16px 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .eventos-recentes {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .evento-recente {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #f8fafc;
                border-radius: 8px;
            }
            .evento-recente-info {
                flex: 1;
            }
            .evento-recente-titulo {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 4px;
            }
            .evento-recente-data {
                font-size: 0.85rem;
                color: #64748b;
            }
            .evento-recente-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                color: #64748b;
            }
            .perfil-configuracoes {
                margin: 30px 0 0 0;
            }
            .perfil-configuracoes h3 {
                margin: 0 0 16px 0;
                color: #1e293b;
                font-size: 1.1rem;
            }
            .configuracoes-lista {
                display: flex;
                flex-direction: column;
                gap: 1px;
                background: #f8fafc;
                border-radius: 8px;
                overflow: hidden;
            }
            .configuracao-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 20px;
                background: white;
                border: none;
                text-align: left;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .configuracao-item:hover {
                background: #f8fafc;
            }
            .configuracao-item i:first-child {
                width: 24px;
                color: #9333ea;
            }
            .configuracao-item span {
                flex: 1;
                color: #334155;
                font-size: 0.95rem;
            }
            .configuracao-item i:last-child {
                color: #cbd5e1;
            }
            .configuracao-sair {
                color: #ef4444;
            }
            .configuracao-sair i:first-child {
                color: #ef4444;
            }
            .configuracao-sair span {
                color: #ef4444;
            }
        `;
        document.head.appendChild(style);
    }
}

function voltarParaHomePerfil() {
    mudarTela('usuario-final');
}

function editarPerfil() {
    mostrarToast('✏️ Funcionalidade de edição de perfil em desenvolvimento!');
}

function alterarSenha() {
    mostrarToast('🔐 Funcionalidade de alteração de senha em desenvolvimento!');
}

function configurarNotificacoes() {
    mostrarToast('🔔 Configurações de notificação em desenvolvimento!');
}

function ajudaSuporte() {
    mostrarToast('❓ Ajuda e suporte em desenvolvimento!');
}

function sairDaConta() {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
        fazerLogout();
    }
}

// Funções globais
window.abrirPerfilUsuario = abrirPerfilUsuario;
window.voltarParaHomePerfil = voltarParaHomePerfil;
window.editarPerfil = editarPerfil;
window.alterarSenha = alterarSenha;
window.configurarNotificacoes = configurarNotificacoes;
window.ajudaSuporte = ajudaSuporte;
window.sairDaConta = sairDaConta;

console.log('✅ Módulo de perfil do usuário pronto');
