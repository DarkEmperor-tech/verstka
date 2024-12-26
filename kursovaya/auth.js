// Инициализация хранилища
if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}

document.getElementById('startGame').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    
    if (playerName) {
        // Сохраняем данные игрока
        const gameData = {
            playerName,
            difficulty,
            score: 0,
            currentLevel: 1,
            startTime: Date.now(),
            maxTime: difficulty === 'easy' ? 300000 : // 5 минут
                     difficulty === 'medium' ? 240000 : // 4 минуты
                     180000 // 3 минуты для сложного уровня
        };
        
        localStorage.setItem('currentGame', JSON.stringify(gameData));
        window.location.href = 'index.html';
    } else {
        alert('Пожалуйста, введите имя!');
    }
});

document.getElementById('showLeaderboard').addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
}); 