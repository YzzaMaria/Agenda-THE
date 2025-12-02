const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

console.log('🔐 Adicionando sistema de autenticação...');

db.serialize(() => {
    // Adicionar colunas de autenticação na tabela usuarios
    db.run(`ALTER TABLE usuarios ADD COLUMN senha TEXT`);
    db.run(`ALTER TABLE usuarios ADD COLUMN tipo_perfil TEXT DEFAULT 'usuario_final'`);
    db.run(`ALTER TABLE usuarios ADD COLUMN ativo BOOLEAN DEFAULT 1`); 
    db.get("PRAGMA table_info(usuarios") , (err, result) => { 
        if (err) { 
            console.error('Error ao verificar tabela:',err);
            return;
        }
    }

    // Criar usuários de exemplo para cada perfil
    const usuariosExemplo = [
        {
            nome: 'João Silva - Usuário',
            email: 'usuario@email.com',
            senha: '123456',
            tipo_perfil: 'usuario_final',
            pontos: 1250
        },
        {
            nome: 'Maria Santos - Produtora',
            email: 'produtor@email.com', 
            senha: '123456',
            tipo_perfil: 'produtor',
            pontos: 0
        },
        {
            nome: 'Carlos Lima - Curador',
            email: 'curador@email.com',
            senha: '123456', 
            tipo_perfil: 'curador',
            pontos: 0
        },
        {
            nome: 'Ana Costa - Parceira',
            email: 'parceiro@email.com',
            senha: '123456',
            tipo_perfil: 'parceiro',
            pontos: 0
        }
    ];

    usuariosExemplo.forEach(usuario => {
        db.run(`INSERT OR REPLACE INTO usuarios (nome, email, senha, tipo_perfil, pontos) VALUES (?, ?, ?, ?, ?)`,
            [usuario.nome, usuario.email, usuario.senha, usuario.tipo_perfil, usuario.pontos]);
    });

    console.log('✅ Sistema de autenticação adicionado!');
    console.log('👥 Usuários de exemplo criados:');
    console.log(' - usuario@email.com (senha: 123456) - Usuário Final');
    console.log(' - produtor@email.com (senha: 123456) - Produtor');
    console.log(' - curador@email.com (senha: 123456) - Curador');
    console.log(' - parceiro@email.com (senha: 123456) - Parceiro');
});

db.close();
