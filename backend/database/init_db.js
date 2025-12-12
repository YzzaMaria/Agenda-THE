const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // Adicione esta dependência

// Caminho do banco de dados - MESMO DO SERVER.JS
const dbPath = path.join(__dirname, 'database', 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

// Função para criar tabelas
async function criarBanco() {
    console.log('🗄️  Criando banco de dados...');
    
    db.serialize(() => {
        // ==================== TABELA DE USUÁRIOS ====================
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            tipo_perfil TEXT DEFAULT 'usuario_final',
            pontos INTEGER DEFAULT 0,
            nivel TEXT DEFAULT 'Novato',
            ativo INTEGER DEFAULT 1,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // ==================== TABELA DE EVENTOS ====================
        db.run(`CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            categoria TEXT,
            data_evento DATE,
            hora_evento TIME,
            local TEXT,
            preco REAL DEFAULT 0,
            destaque INTEGER DEFAULT 0,
            lotacao INTEGER DEFAULT 100,
            ingressos_vendidos INTEGER DEFAULT 0,
            ativo INTEGER DEFAULT 1,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // ==================== TABELA DE BADGES ====================
        db.run(`CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            emoji TEXT,
            pontos_necessarios INTEGER DEFAULT 0,
            categoria TEXT,
            requisito INTEGER DEFAULT 1
        )`);

        // ==================== TABELA DE RECOMPENSAS ====================
        db.run(`CREATE TABLE IF NOT EXISTS recompensas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            custo_pontos INTEGER DEFAULT 0,
            ativa INTEGER DEFAULT 1,
            tipo TEXT
        )`);

        // ==================== TABELA DE CHECK-INS ====================
        db.run(`CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            evento_id INTEGER,
            data_checkin DATETIME DEFAULT CURRENT_TIMESTAMP,
            pontos_ganhos INTEGER DEFAULT 50,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (evento_id) REFERENCES eventos(id)
        )`);

        // ==================== TABELA DE USUÁRIO_BADGES ====================
        db.run(`CREATE TABLE IF NOT EXISTS usuario_badges (
            usuario_id INTEGER,
            badge_id INTEGER,
            data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (usuario_id, badge_id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (badge_id) REFERENCES badges(id)
        )`);

        console.log('✅ Tabelas criadas com sucesso!');
        
        // Inserir dados iniciais
        inserirDadosIniciais();
    });
}

// Função para inserir dados iniciais
async function inserirDadosIniciais() {
    console.log('📥 Inserindo dados iniciais...');
    
    try {
        // Hash da senha padrão (123456)
        const senhaHash = await bcrypt.hash('123456', 10);
        
        // ==================== USUÁRIOS DE DEMONSTRAÇÃO ====================
        const usuarios = [
            ['João Silva', 'usuario@email.com', senhaHash, 'usuario_final', 1250],
            ['Maria Produtora', 'produtor@email.com', senhaHash, 'produtor', 500],
            ['Carlos Curador', 'curador@email.com', senhaHash, 'curador', 2000],
            ['Ana Parceira', 'parceiro@email.com', senhaHash, 'parceiro', 800]
        ];
        
        usuarios.forEach(usuario => {
            db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo_perfil, pontos) VALUES (?, ?, ?, ?, ?)`,
                usuario, function(err) {
                    if (err) {
                        console.error('❌ Erro ao inserir usuário:', err.message);
                    } else if (this.changes > 0) {
                        console.log(`✅ Usuário criado: ${usuario[0]}`);
                    }
                });
        });

        // ==================== EVENTOS DE DEMONSTRAÇÃO ====================
        const eventos = [
            ['Festival de Jazz', 'Um incrível festival de jazz com artistas locais e nacionais.', 'musica', '2024-11-15', '20:00', 'Parque da Cidade', 50.00, 1, 150, 120],
            ['Exposição de Arte Moderna', 'Exposição com obras de artistas contemporâneos renomados.', 'arte', '2024-11-20', '14:00', 'Museu de Arte Contemporânea', 30.00, 1, 100, 85],
            ['Peça Teatral: Corpos Dizeres', 'Entre gestos que escavam camadas, um corpo afirma pela dança sua voz.', 'teatro', '2025-12-03', '19:30', 'Theatro 4 de setembro', 40.00, 0, 200, 45],
            ['Feira Gastronômica Regional', 'Degustação de comidas típicas do Piauí e região Nordeste.', 'gastronomia', '2024-11-25', '18:00', 'Parque da Cidadania', 20.00, 1, 300, 250],
            ['Show de Música Popular', 'Show com grandes nomes da música popular brasileira.', 'musica', '2024-12-05', '21:00', 'Arena do Rio Poty', 60.00, 1, 500, 320]
        ];

        eventos.forEach(evento => {
            db.run(`INSERT OR IGNORE INTO eventos (titulo, descricao, categoria, data_evento, hora_evento, local, preco, destaque, lotacao, ingressos_vendidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                evento, function(err) {
                    if (err) {
                        console.error('❌ Erro ao inserir evento:', err.message);
                    } else if (this.changes > 0) {
                        console.log(`✅ Evento criado: ${evento[0]}`);
                    }
                });
        });

        // ==================== BADGES ====================
        const badges = [
            ['Melômano', 'Participou de 5 eventos de música', '🎵', 100, 'musica', 5],
            ['Artista', 'Participou de 5 eventos de arte', '🎨', 150, 'arte', 5],
            ['Dramaturgo', 'Participou de 3 eventos de teatro', '🎭', 120, 'teatro', 3],
            ['Gourmet', 'Participou de 4 eventos gastronômicos', '🍽️', 130, 'gastronomia', 4],
            ['Iniciante', 'Primeiro evento participado', '⭐', 10, 'geral', 1],
            ['Entusiasta', 'Participou de 10 eventos', '🔥', 200, 'geral', 10],
            ['Frequentador', 'Participou de 25 eventos', '🎪', 500, 'geral', 25],
            ['Social', 'Convidou 5 amigos', '🤝', 80, 'social', 5]
        ];

        badges.forEach(badge => {
            db.run(`INSERT OR IGNORE INTO badges (nome, descricao, emoji, pontos_necessarios, categoria, requisito) VALUES (?, ?, ?, ?, ?, ?)`,
                badge, function(err) {
                    if (err) {
                        console.error('❌ Erro ao inserir badge:', err.message);
                    } else if (this.changes > 0) {
                        console.log(`✅ Badge criada: ${badge[0]}`);
                    }
                });
        });

        // ==================== RECOMPENSAS ====================
        const recompensas = [
            ['Ingresso Gratuito', 'Ingresso gratuito para qualquer evento de até R$ 50', 500, 1, 'ingresso'],
            ['Desconto de 50%', 'Desconto de 50% em qualquer evento', 300, 1, 'desconto'],
            ['Camiseta Exclusiva', 'Camiseta exclusiva da Agenda THE', 750, 1, 'produto'],
            ['Experiência VIP', 'Acesso VIP a um evento (com direito a meet & greet)', 1000, 1, 'experiencia'],
            ['Brinde Surpresa', 'Brinde surpresa dos parceiros', 150, 1, 'brinde']
        ];

        recompensas.forEach(recompensa => {
            db.run(`INSERT OR IGNORE INTO recompensas (nome, descricao, custo_pontos, ativa, tipo) VALUES (?, ?, ?, ?, ?)`,
                recompensa, function(err) {
                    if (err) {
                        console.error('❌ Erro ao inserir recompensa:', err.message);
                    } else if (this.changes > 0) {
                        console.log(`✅ Recompensa criada: ${recompensa[0]}`);
                    }
                });
        });

        // ==================== CHECK-INS DE DEMONSTRAÇÃO ====================
        // Adicionar alguns check-ins para o usuário demo
        db.run(`INSERT OR IGNORE INTO checkins (usuario_id, evento_id) VALUES (1, 1)`);
        db.run(`INSERT OR IGNORE INTO checkins (usuario_id, evento_id) VALUES (1, 2)`);
        db.run(`INSERT OR IGNORE INTO checkins (usuario_id, evento_id) VALUES (1, 4)`);

        console.log('==========================================');
        console.log('✅ BANCO DE DADOS INICIALIZADO COM SUCESSO!');
        console.log('==========================================');
        console.log('👤 Usuários demo criados (senha: 123456):');
        console.log('   • usuario@email.com (Usuário Final)');
        console.log('   • produtor@email.com (Produtor)');
        console.log('   • curador@email.com (Curador)');
        console.log('   • parceiro@email.com (Parceiro)');
        console.log('');
        console.log('🎭 Eventos demo criados: 5 eventos');
        console.log('🏆 Badges disponíveis: 8 badges');
        console.log('🎁 Recompensas: 5 recompensas');
        console.log('');
        console.log(`📂 Banco de dados: ${dbPath}`);
        console.log('==========================================');

    } catch (error) {
        console.error('❌ Erro ao inserir dados iniciais:', error);
    }
}

// Verificar se já existe um banco
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'", (err, row) => {
    if (err) {
        console.error('❌ Erro ao verificar banco:', err.message);
        process.exit(1);
    }

    if (row) {
        console.log('⚠️  Banco de dados já existe. Deseja recriar? (s/N)');
        
        // Para execução automática, vamos apenas recriar
        console.log('🔄 Recriando banco de dados...');
        
        // Remover tabelas existentes
        const tabelas = ['checkins', 'usuario_badges', 'recompensas', 'badges', 'eventos', 'usuarios'];
        
        db.serialize(() => {
            tabelas.forEach(tabela => {
                db.run(`DROP TABLE IF EXISTS ${tabela}`);
            });
            
            // Criar novo banco
            criarBanco();
        });
    } else {
        // Criar novo banco
        criarBanco();
    }
});

// Fechar banco quando terminar
db.close((err) => {
    if (err) {
        console.error('❌ Erro ao fechar banco:', err.message);
    } else {
        console.log('🔒 Banco de dados fechado com sucesso');
    }
});