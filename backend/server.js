const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuração do banco de dados
const dbPath = path.join(__dirname, 'database', 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

// Rota raiz - servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota de saúde da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API Agenda THE funcionando!',
        version: '1.0.0',
        endpoints: [
            '/api/eventos',
            '/api/eventos/:id', 
            '/api/badges',
            '/api/recompensas',
            '/api/usuarios',
            '/api/checkin'
        ]
    });
});

// GET - Listar todos os eventos
app.get('/api/eventos', (req, res) => {
    const { categoria, destaque } = req.query;
    
    let query = 'SELECT * FROM eventos WHERE 1=1';
    const params = [];

    if (categoria && categoria !== 'Todos') {
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

// GET - Buscar evento por ID
app.get('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM eventos WHERE id = ?', [id], (err, row) => {
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

// GET - Listar badges
app.get('/api/badges', (req, res) => {
    db.all('SELECT * FROM badges', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET - Listar recompensas
app.get('/api/recompensas', (req, res) => {
    db.all('SELECT * FROM recompensas WHERE ativa = 1', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST - Criar novo usuário
app.post('/api/usuarios', (req, res) => {
    const { nome, email, telefone } = req.body;
    
    db.run('INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)',
        [nome, email, telefone],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                id: this.lastID, 
                message: 'Usuário criado com sucesso',
                usuario: { id: this.lastID, nome, email, telefone, pontos: 0, nivel: 'Novato' }
            });
        });
});

// GET - Buscar usuário por ID
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
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

// GET - Badges do usuário
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

// POST - Fazer check-in em evento
app.post('/api/checkin', (req, res) => {
    const { usuario_id, evento_id } = req.body;
    
    // Verificar se já fez check-in
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

        // Fazer check-in e adicionar pontos
        db.serialize(() => {
            db.run('INSERT INTO checkins (usuario_id, evento_id) VALUES (?, ?)', 
                [usuario_id, evento_id]);
            
            db.run('UPDATE usuarios SET pontos = pontos + 50 WHERE id = ?', 
                [usuario_id]);
            
            res.json({ 
                message: 'Check-in realizado com sucesso! +50 pontos',
                pontos_ganhos: 50
            });
        });
    });
});

// Rota para servir arquivos estáticos do frontend
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Rota fallback para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📱 Agenda THE - Mobile First`);
    console.log(`🗄️ Banco de dados: SQLite`);
    console.log(`🔗 API disponível em http://localhost:${PORT}/api`);
});
// Rotas de Autenticação
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.get('SELECT * FROM usuarios WHERE email = ? AND ativo = 1', [email], (err, usuario) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!usuario) {
            res.status(401).json({ error: 'Usuário não encontrado' });
            return;
        }

        if (usuario.senha !== senha) {
            res.status(401).json({ error: 'Senha incorreta' });
            return;
        }

        // Login bem-sucedido
        res.json({
            message: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_perfil: usuario.tipo_perfil,
                pontos: usuario.pontos
            }
        });
    });
});

app.post('/api/cadastro', (req, res) => {
    const { nome, email, senha, tipo_perfil } = req.body;

    db.run('INSERT INTO usuarios (nome, email, senha, tipo_perfil) VALUES (?, ?, ?, ?)',
        [nome, email, senha, tipo_perfil || 'usuario_final'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    res.status(400).json({ error: 'Email já cadastrado' });
                } else {
                    res.status(500).json({ error: err.message });
                }
                return;
            }

            res.json({
                message: 'Usuário criado com sucesso',
                usuario: {
                    id: this.lastID,
                    nome,
                    email,
                    tipo_perfil: tipo_perfil || 'usuario_final',
                    pontos: 0
                }
            });
        });
});

// Middleware para verificar autenticação
function verificarAuth(req, res, next) {
    // Em produção, usar JWT tokens
    // Por enquanto, vamos simular
    next();
}