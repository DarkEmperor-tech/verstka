// Инициализация хранилища
if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}

let isAdminMode = false;

document.getElementById('adminMode').addEventListener('click', () => {
    isAdminMode = !isAdminMode;
    const button = document.getElementById('adminMode');
    button.classList.toggle('admin-mode-active');
    
    // Сохраняем состояние режима администратора
    if (isAdminMode) {
        button.textContent = 'Выключить режим администратора';
    } else {
        button.textContent = 'Режим администратора';
    }
});

document.getElementById('startGame').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    
    if (playerName) {
        const gameData = {
            playerName,
            difficulty,
            score: 0,
            currentLevel: 1,
            startTime: Date.now(),
            maxTime: difficulty === 'easy' ? 300000 : 
                     difficulty === 'medium' ? 240000 : 
                     180000,
            isAdminMode: isAdminMode
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