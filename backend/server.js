const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuração do banco de dados
const dbPath = path.join(__dirname, 'database', 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

// ==================== INICIALIZAÇÃO DO BANCO ====================
function inicializarBanco() {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
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
        )
    `);

    // Tabela de eventos
    db.run(`
        CREATE TABLE IF NOT EXISTS eventos (
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
        )
    `);

    // Tabela de badges
    db.run(`
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            emoji TEXT,
            pontos_necessarios INTEGER DEFAULT 0
        )
    `);

    // Tabela de recompensas
    db.run(`
        CREATE TABLE IF NOT EXISTS recompensas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            custo_pontos INTEGER DEFAULT 0,
            ativa INTEGER DEFAULT 1
        )
    `);

    // Tabela de check-ins
    db.run(`
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            evento_id INTEGER,
            data_checkin DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (evento_id) REFERENCES eventos(id)
        )
    `);

    // Tabela de usuário_badges
    db.run(`
        CREATE TABLE IF NOT EXISTS usuario_badges (
            usuario_id INTEGER,
            badge_id INTEGER,
            data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (usuario_id, badge_id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (badge_id) REFERENCES badges(id)
        )
    `);

    inserirDadosIniciais();
}

function inserirDadosIniciais() {
    const senhaHash = bcrypt.hashSync('123456', 10);
    
    db.get('SELECT COUNT(*) as count FROM usuarios', (err, row) => {
        if (err) return;
        
        if (row.count === 0) {
            const usuariosDemo = [
                ['João Silva', 'usuario@email.com', senhaHash, 'usuario_final', 1250],
                ['Maria Produtora', 'produtor@email.com', senhaHash, 'produtor', 500],
                ['Carlos Curador', 'curador@email.com', senhaHash, 'curador', 2000],
                ['Ana Parceira', 'parceiro@email.com', senhaHash, 'parceiro', 800]
            ];

            usuariosDemo.forEach(usuario => {
                db.run(
                    'INSERT INTO usuarios (nome, email, senha, tipo_perfil, pontos) VALUES (?, ?, ?, ?, ?)',
                    usuario
                );
            });

            const eventosDemo = [
                ['Festival de Jazz', 'Um incrível festival de jazz com artistas locais e nacionais.', 'musica', '2024-11-15', '20:00', 'Parque da Cidade', 50.00, 1, 150, 120],
                ['Exposição de Arte Moderna', 'Exposição com obras de artistas contemporâneos renomados.', 'arte', '2024-11-20', '14:00', 'Museu de Arte Contemporânea', 30.00, 1, 100, 85],
                ['Peça Teatral: Corpos Dizeres', 'Entre gestos que escavam camadas, um corpo afirma pela dança sua voz.', 'teatro', '2025-12-03', '19:30', 'Theatro 4 de setembro', 40.00, 0, 200, 45],
                ['Feira Gastronômica Regional', 'Degustação de comidas típicas do Piauí e região Nordeste.', 'gastronomia', '2024-11-25', '18:00', 'Parque da Cidadania', 20.00, 1, 300, 250],
                ['Show de Música Popular', 'Show com grandes nomes da música popular brasileira.', 'musica', '2024-12-05', '21:00', 'Arena do Rio Poty', 60.00, 1, 500, 320]
            ];

            eventosDemo.forEach(evento => {
                db.run(
                    'INSERT INTO eventos (titulo, descricao, categoria, data_evento, hora_evento, local, preco, destaque, lotacao, ingressos_vendidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    evento
                );
            });

            console.log('✅ Dados iniciais inseridos');
        }
    });
}

// ==================== ROTAS DA API ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api', (req, res) => {
    res.json({
        message: 'API Agenda THE funcionando!',
        version: '1.0.0',
        endpoints: [
            '/api/login',
            '/api/cadastro',
            '/api/eventos',
            '/api/eventos/:id',
            '/api/badges',
            '/api/recompensas',
            '/api/usuarios',
            '/api/checkin'
        ]
    });
});

// ==================== AUTENTICAÇÃO ====================
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!usuario) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        
        if (usuario.ativo !== 1) {
            return res.status(401).json({ error: 'Conta desativada' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        res.json({
            message: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                tipo_perfil: usuario.tipo_perfil,
                pontos: usuario.pontos,
                nivel: usuario.nivel
            }
        });
    });
});

app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha, tipo_perfil, telefone } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    if (senha.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        
        db.run(
            'INSERT INTO usuarios (nome, email, senha, tipo_perfil, telefone) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senhaHash, tipo_perfil || 'usuario_final', telefone || ''],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email já cadastrado' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                
                res.json({
                    message: 'Usuário criado com sucesso',
                    usuario: {
                        id: this.lastID,
                        nome,
                        email,
                        telefone: telefone || '',
                        tipo_perfil: tipo_perfil || 'usuario_final',
                        pontos: 0,
                        nivel: 'Novato'
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar cadastro' });
    }
});

// ==================== EVENTOS ====================
app.get('/api/eventos', (req, res) => {
    const { categoria, destaque } = req.query;
    let query = 'SELECT * FROM eventos WHERE ativo = 1';
    const params = [];
    
    if (categoria && categoria !== 'todos' && categoria !== 'Todos') {
        query += ' AND categoria = ?';
        params.push(categoria);
    }
    
    if (destaque) {
        query += ' AND destaque = ?';
        params.push(1);
    }
    
    query += ' ORDER BY data_evento, hora_evento';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM eventos WHERE id = ? AND ativo = 1', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!row) {
            res.status(404).json({ error: 'Evento não encontrado' });
            return;
        }
        
        res.json(row);
    });
});

// ==================== BADGES E RECOMPENSAS ====================
app.get('/api/badges', (req, res) => {
    db.all('SELECT * FROM badges', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/recompensas', (req, res) => {
    db.all('SELECT * FROM recompensas WHERE ativa = 1 ORDER BY custo_pontos', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ==================== USUÁRIOS ====================
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT id, nome, email, telefone, tipo_perfil, pontos, nivel FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!row) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        
        res.json(row);
    });
});

app.get('/api/usuarios/:id/badges', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT b.*, ub.data_conquista
        FROM badges b
        JOIN usuario_badges ub ON b.id = ub.badge_id
        WHERE ub.usuario_id = ?
    `;
    
    db.all(query, [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ==================== CHECK-IN ====================
app.post('/api/checkin', (req, res) => {
    const { usuario_id, evento_id } = req.body;
    
    if (!usuario_id || !evento_id) {
        return res.status(400).json({ error: 'ID do usuário e evento são obrigatórios' });
    }

    db.get('SELECT * FROM checkins WHERE usuario_id = ? AND evento_id = ?', 
        [usuario_id, evento_id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (row) {
                res.status(400).json({ error: 'Check-in já realizado para este evento' });
                return;
            }

            db.serialize(() => {
                db.run('INSERT INTO checkins (usuario_id, evento_id) VALUES (?, ?)', 
                    [usuario_id, evento_id]);
                
                db.run('UPDATE usuarios SET pontos = pontos + 50 WHERE id = ?', 
                    [usuario_id]);
                
                res.json({
                    success: true,
                    message: 'Check-in realizado com sucesso! +50 pontos',
                    pontos_ganhos: 50
                });
            });
        }
    );
});

// ==================== ROTAS ESTÁTICAS ====================
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ==================== INICIALIZAÇÃO ====================
inicializarBanco();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Agenda THE -- Mobile First`);
    console.log(`️ Banco de dados: SQLite (${dbPath})`);
    console.log(`API disponível em http://localhost:${PORT}/api`);
    console.log(`Usuários demo: <usuario@email.com> / 123456`);
    console.log(`‍ Produtor demo: <produtor@email.com> / 123456`);
    console.log(`Curador demo: <curador@email.com> / 123456`);
    console.log(`Parceiro demo: <parceiro@email.com> / 123456`);
});