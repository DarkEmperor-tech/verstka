document.addEventListener('DOMContentLoaded', () => {
    displayLeaderboard();
    
    document.getElementById('backToStart').addEventListener('click', () => {
        window.location.href = 'start.html';
    });
});

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboardList');
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p>Пока нет результатов</p>';
        return;
    }

    // Сортируем по убыванию очков
    leaderboard.sort((a, b) => b.score - a.score);

    // Создаем таблицу
    const table = document.createElement('table');
    table.className = 'leaderboard-table';
    
    // Заголовок таблицы
    table.innerHTML = `
        <thead>
            <tr>
                <th>Место</th>
                <th>Имя</th>
                <th>Очки</th>
                <th>Сложность</th>
                <th>Дата</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    // Заполняем таблицу данными
    const tbody = table.querySelector('tbody');
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        const date = new Date(entry.date).toLocaleDateString();
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.difficulty}</td>
            <td>${date}</td>
        `;
        
        tbody.appendChild(row);
    });

    leaderboardList.appendChild(table);
} 