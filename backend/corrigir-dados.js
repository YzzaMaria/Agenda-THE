const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'agenda_the.db');
const db = new sqlite3.Database(dbPath);

console.log('Corrigindo dados do banco...');

db.serialize(() => {
    // Atualizar eventos
    db.run(`UPDATE eventos SET
        titulo = 'Festival de Jazz',
        categoria = 'musica',
        hora_evento = '20:00',
        local = 'Parque da Cidade',
        descricao = 'Um incrível festival de jazz com artistas locais e nacionais. Venha curtir uma noite inesquecível!'
        WHERE id = 1`);
    
    db.run(`UPDATE eventos SET
        titulo = 'Exposição de Arte Moderna',
        categoria = 'arte',
        local = 'Museu de Arte Contemporânea',
        descricao = 'Exposição com obras de artistas contemporâneos renomados.'
        WHERE id = 2`);
    
    db.run(`UPDATE eventos SET
        titulo = 'Peça Teatral: Romeu e Julieta',
        categoria = 'teatro',
        local = 'Teatro Municipal',
        descricao = 'Clássico de Shakespeare com direção moderna.'
        WHERE id = 3`);

    // Corrigir badges (adicionar emojis)
    const badgesCorrigidas = [
        { id: 1, emoji: '🎵' },
        { id: 2, emoji: '🎨' },
        { id: 3, emoji: '🎭' },
        { id: 4, emoji: '🍽️' },
        { id: 5, emoji: '⭐' },
        { id: 6, emoji: '🔥' },
        { id: 7, emoji: '🎪' },
        { id: 8, emoji: '🤝' }
    ];

    badgesCorrigidas.forEach(badge => {
        db.run('UPDATE badges SET emoji = ? WHERE id = ?', [badge.emoji, badge.id]);
    });

    // Corrigir recompensas
    db.run(`UPDATE recompensas SET
        nome = '10% OFF em Ingressos',
        descricao = 'Desconto de 10% na próxima compra',
        custo_pontos = 500
        WHERE id = 1`);
    
    db.run(`UPDATE recompensas SET
        nome = '15% OFF VIP',
        descricao = 'Desconto especial de 15%',
        custo_pontos = 800
        WHERE id = 2`);

    console.log('✅ Dados corrigidos com sucesso!');
});

db.close();