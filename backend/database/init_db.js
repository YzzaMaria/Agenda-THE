const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

// Criar tabelas
db.serialize(() => {
    // Tabela de Usuários
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        pontos INTEGER DEFAULT 0,
        nivel TEXT DEFAULT 'Novato',  
        senha TEXT, 
        tipo_perfil TEXT DEFAULT 'usuario_final', 
        ativo BOOLEAN DEFAULT 1,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Eventos
    db.run(`CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        data_evento TEXT NOT NULL,
        hora_evento TEXT NOT NULL,
        local TEXT NOT NULL,
        preco REAL NOT NULL,
        descricao TEXT,
        imagem_url TEXT,
        destaque BOOLEAN DEFAULT 0,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Badges
    db.run(`CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        emoji TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT,
        requisito INTEGER DEFAULT 1
    )`);

    // Tabela de Recompensas
    db.run(`CREATE TABLE IF NOT EXISTS recompensas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        custo_pontos INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        ativa BOOLEAN DEFAULT 1
    )`);

    // Tabela de Usuário_Badges
    db.run(`CREATE TABLE IF NOT EXISTS usuario_badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        badge_id INTEGER,
        data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (badge_id) REFERENCES badges(id)
    )`);

    // Tabela de Check-ins
    db.run(`CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        evento_id INTEGER,
        data_checkin DATETIME DEFAULT CURRENT_TIMESTAMP,
        pontos_ganhos INTEGER DEFAULT 50,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (evento_id) REFERENCES eventos(id)
    )`);

    // Inserir dados iniciais
    console.log('Inserindo dados iniciais...');

    // Badges padrão
    const badges = [
        { nome: 'Melômano', emoji: '🎵', descricao: 'Participou de 5 eventos de música', categoria: 'música', requisito: 5 },
        { nome: 'Artista', emoji: '🎨', descricao: 'Participou de 5 eventos de arte', categoria: 'arte', requisito: 5 },
        { nome: 'Dramaturgo', emoji: '🎭', descricao: 'Participou de 3 eventos de teatro', categoria: 'teatro', requisito: 3 },
        { nome: 'Gourmet', emoji: '🍽️', descricao: 'Participou de 4 eventos gastronômicos', categoria: 'gastronomia', requisito: 4 },
        { nome: 'Iniciante', emoji: '⭐', descricao: 'Primeiro evento participado', categoria: 'geral', requisito: 1 },
        { nome: 'Entusiasta', emoji: '🔥', descricao: 'Participou de 10 eventos', categoria: 'geral', requisito: 10 },
        { nome: 'Frequentador', emoji: '🎪', descricao: 'Participou de 25 eventos', categoria: 'geral', requisito: 25 },
        { nome: 'Social', emoji: '🤝', descricao: 'Convidou 5 amigos', categoria: 'social', requisito: 5 }
    ];

    badges.forEach(badge => {
        db.run(`INSERT OR IGNORE INTO badges (nome, emoji, descricao, categoria, requisito) VALUES (?, ?, ?, ?, ?)`,
            [badge.nome, badge.emoji, badge.descricao, badge.categoria, badge.requisito]);
    });

    // Recompensas padrão
    const recompensas = [
        { nome: '10% OFF em Ingressos', descricao: 'Desconto de 10% na próxima compra', custo_pontos: 500, tipo: 'desconto' },
        { nome: '15% OFF VIP', descricao: 'Desconto especial de 15%', custo_pontos: 800, tipo: 'desconto' },
        { nome: 'Ingresso Grátis', descricao: 'Um ingresso gratuito para qualquer evento', custo_pontos: 1000, tipo: 'ingresso_gratis' },
        { nome: 'Acesso VIP', descricao: 'Upgrade para área VIP', custo_pontos: 1500, tipo: 'vip' },
        { nome: 'Estacionamento Cortesia', descricao: 'Estacionamento gratuito no evento', custo_pontos: 300, tipo: 'beneficio' }
    ];

    recompensas.forEach(recompensa => {
        db.run(`INSERT OR IGNORE INTO recompensas (nome, descricao, custo_pontos, tipo) VALUES (?, ?, ?, ?)`,
            [recompensa.nome, recompensa.descricao, recompensa.custo_pontos, recompensa.tipo]);
    });

    // Eventos de exemplo
    const eventos = [
        {
            titulo: 'Festival de Jazz',
            categoria: 'música',
            data_evento: '2024-11-15',
            hora_evento: '20:00',
            local: 'Praça Saraiva',
            preco: 50.00,
            descricao: 'Um incrível festival de jazz com artistas locais e nacionais. Venha curtir uma noite inesquecível!',
            destaque: 1
        },
        {
            titulo: 'Exposição de Arte Moderna',
            categoria: 'arte',
            data_evento: '2024-11-20',
            hora_evento: '14:00',
            local: 'Museu de Arte Contemporânea',
            preco: 30.00,
            descricao: 'Exposição com obras de artistas contemporâneos renomados.',
            destaque: 1
        },
        {
            titulo: 'Peça Teatral: Romeu e Julieta',
            categoria: 'teatro',
            data_evento: '2024-11-25',
            hora_evento: '19:30',
            local: 'Teatro Municipal',
            preco: 40.00,
            descricao: 'Clássico de Shakespeare com direção moderna.',
            destaque: 0
        }
    ];

    eventos.forEach(evento => {
        db.run(`INSERT OR IGNORE INTO eventos (titulo, categoria, data_evento, hora_evento, local, preco, descricao, destaque) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [evento.titulo, evento.categoria, evento.data_evento, evento.hora_evento, evento.local, evento.preco, evento.descricao, evento.destaque]);
    });

    console.log('Banco de dados inicializado com sucesso!');
});

db.close();