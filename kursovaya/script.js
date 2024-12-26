// Здесь хранятся основные данные игры
let gameData = JSON.parse(localStorage.getItem('currentGame')); // Загружаем сохраненные данные игры
let timer; // Для работы таймера
let timeLeft; // Сколько времени осталось
let currentLevelAttempts = 0; // Сколько попыток сделано на текущем уровне
const maxAttemptsPerLevel = 3; // Максимум попыток на уровень
let levelScores = [0, 0, 0]; // Очки за каждый уровень
let circuitElementsLevel2 = []; // Элементы схемы для второго уровня
let formulaElements = []; // Элементы формулы для первого уровня
let currentFormula = []; // Текущая собранная формула
let currentCircuitLayout; // Добавим переменную для хранения текущей схемы

// Добавляем объект для хранения попыток по уровням
let attemptsPerLevel = {
    1: 0,
    2: 0,
    3: 0
};

// Массив всех возможных формул для первого уровня
const FORMULAS = [
    {
        elements: ['R1', '+', 'R2', '=', 'U'],
        hint: 'Соберите формулу для последовательного соединения резисторов: R1 + R2 = U'
    },
    {
        elements: ['I', '*', 'R', '=', 'U'],
        hint: 'Соберите закон Ома: I * R = U'
    },
    {
        elements: ['P', '=', 'U', '*', 'I'],
        hint: 'Соберите формулу мощности: P = U * I'
    },
    {
        elements: ['R', '=', 'U', '/', 'I'],
        hint: 'Соберите формулу сопротивления: R = U / I'
    }
];

// Массив схем для второго уровня
const CIRCUIT_LAYOUTS = [
    {
        name: 'Последовательная цепь',
        hint: 'Соберите последовательную цепь: батарея (1, 2), резистор (3, 4), реле (5)',
        correctPositions: {
            'battery': ['1', '2'],
            'resistor': ['3', '4'],
            'relay': ['5']
        }
    },
    {
        name: 'Параллельная цепь',
        hint: 'Соберите параллельную цепь: батарея (1, 3), резистор (2, 5), реле (4)',
        correctPositions: {
            'battery': ['1', '3'],
            'resistor': ['2', '5'],
            'relay': ['4']
        }
    },
    {
        name: 'Смешанная цепь',
        hint: 'Соберите смешанную цепь: батарея (2, 3), резистор (1, 4), реле (5)',
        correctPositions: {
            'battery': ['2', '3'],
            'resistor': ['1', '4'],
            'relay': ['5']
        }
    }
];

// Массив заданий для третьего уровня
const COMPONENT_TASKS = [
    {
        task: 'Выберите компоненты для последовательной цепи (батарея, резистор, амперметр)',
        correctComponents: ['battery', 'resistor', 'ammeter'],
        components: [
            { id: 'battery', name: 'Батарея', correct: true },
            { id: 'resistor', name: 'Резистор', correct: true },
            { id: 'capacitor', name: 'Конденсатор', correct: false },
            { id: 'inductor', name: 'Катушка', correct: false },
            { id: 'ammeter', name: 'Амперметр', correct: true },
            { id: 'diode', name: 'Диод', correct: false }
        ]
    },
    {
        task: 'Выберите компоненты для параллельной цепи (батарея, вольтметр, выключатель)',
        correctComponents: ['battery', 'voltmeter', 'switch'],
        components: [
            { id: 'battery', name: 'Батарея', correct: true },
            { id: 'voltmeter', name: 'Вольтметр', correct: true },
            { id: 'resistor', name: 'Резистор', correct: false },
            { id: 'switch', name: 'Выключатель', correct: true },
            { id: 'capacitor', name: 'Конденсатор', correct: false },
            { id: 'transistor', name: 'Транзистор', correct: false }
        ]
    },
    {
        task: 'Выберите компоненты для измерительной цепи (вольтметр, амперметр, осциллограф)',
        correctComponents: ['voltmeter', 'ammeter', 'oscilloscope'],
        components: [
            { id: 'voltmeter', name: 'Вольтметр', correct: true },
            { id: 'ammeter', name: 'Амперметр', correct: true },
            { id: 'oscilloscope', name: 'Осциллограф', correct: true },
            { id: 'resistor', name: 'Резистор', correct: false },
            { id: 'relay', name: 'Реле', correct: false },
            { id: 'diode', name: 'Диод', correct: false }
        ]
    }
];

// Функция для получения случайного элемента из массива
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Запускает таймер обратного отсчета
function startTimer() {
    // Находим элемент для отображения таймера
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    // Если уже есть работающий таймер - останавливаем его
    if (timer) {
        clearInterval(timer);
    }

    // Запускаем новый таймер
    timer = setInterval(() => {
        // Уменьшаем оставшееся время на 1 секунду
        timeLeft -= 1000;
        
        // Обновляем отображение таймера
        timerElement.textContent = `Время: ${Math.ceil(timeLeft / 1000)}с`;

        // Если время закончилось
        if (timeLeft <= 0) {
            // Останавливаем таймер
            clearInterval(timer);
            
            // Показываем сообщение о конце игры
            alert('Время вышло! Игра окончена.');
            
            // Возвращаемся на стартовую страницу
            window.location.href = 'start.html';
        }
    }, 1000); // Обновляем каждую секунду
}

// Запускается при старте игры
function initGame() {
    if (!gameData) { // Если нет данных игры
        window.location.href = 'start.html'; // Отправляем на страницу начала
        return;
    }
    
    timeLeft = gameData.maxTime; // Устанавливаем время
    startTimer(); // Запускаем таймер
    showLevel('menu'); // Показываем меню
    addMenuHandlers(); // Добавляем обработчики кнопок
}

// Обновленная функция подсчета очков
function calculateLevelScore(level) {
    const baseScore = 100;
    const timeBonus = Math.floor(timeLeft / 1000) * 2;
    const attemptsBonus = (maxAttemptsPerLevel - attemptsPerLevel[level]) * 10;
    
    const difficultyMultipliers = {
        'easy': 1,
        'medium': 1.5,
        'hard': 2
    };
    
    // Используем попытки конкретного уровня
    const attemptsPenalty = Math.max(0.4, 1 - (attemptsPerLevel[level] * 0.2));
    
    const difficultyMultiplier = difficultyMultipliers[gameData.difficulty];
    const levelMultiplier = 1 + (level * 0.2);
    
    const totalScore = Math.floor(
        (baseScore + timeBonus + attemptsBonus) * 
        difficultyMultiplier * 
        levelMultiplier * 
        attemptsPenalty
    );
    
    return totalScore;
}

// Показывает нужный уровень или меню
function showLevel(level) {
    // Прячем все уровни
    document.querySelectorAll('.game-level').forEach(levelDiv => {
        levelDiv.style.display = 'none';
    });

    // Если выбрано меню - показываем его
    if (level === 'menu') {
        document.getElementById('main-menu').style.display = 'block';
        return;
    }

    // Проверяем, можно ли играть этот уровень
    if (level > gameData.currentLevel) {
        alert('Сначала пройдите предыдущий уровень!');
        document.getElementById('main-menu').style.display = 'block';
        return;
    }

    // Показываем выбранный уровень и запускаем его
    const levelElement = document.getElementById(`level${level}`);
    if (levelElement) {
        levelElement.style.display = 'block';
        if (level === 1) initLevel1();
        if (level === 2) initLevel2();
        if (level === 3) initLevel3();
    }
}

// Настраивает кнопки в меню
function addMenuHandlers() {
    const menuButtons = {
        'start-level1': () => showLevel(1), // Кнопка первого уровня
        'start-level2': () => showLevel(2), // Кнопка второго уровня
        'start-level3': () => showLevel(3), // Кнопка третьего уровня
        'back-to-menu-level1': () => showLevel('menu'), // Кнопка возврата в меню с первого уровня
        'back-to-menu-level2': () => showLevel('menu'), // Кнопка возврата в меню со второго уровня
        'back-to-menu-level3': () => showLevel('menu'), // Кнопка возврата в меню с третьего уровня
        'show-leaderboard': () => window.location.href = 'leaderboard.html' // Кнопка таблицы лидеров
    };

    // Добавляем обработчики для всех кнопок
    Object.entries(menuButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.onclick = handler;
            animations.pulse(button); // Добавляем пульсацию для кнопок
        }
    });
}

// Подготовка первого уровня
function initLevel1() {
    attemptsPerLevel[1] = 0; // Сбрасываем попытки первого уровня
    currentFormula = [];
    const randomFormula = getRandomItem(FORMULAS);
    formulaElements = randomFormula.elements;
    
    const hintElement = document.querySelector('.formula-hint');
    if (hintElement) {
        hintElement.textContent = randomFormula.hint;
    }
    
    // Создаем элементы формулы для перетаскивания
    const container = document.querySelector('.formula-container');
    if (container) {
        container.innerHTML = '';
        
        // Перемешиваем элементы в случайном порядке
        const shuffledElements = [...randomFormula.elements].sort(() => Math.random() - 0.5);
        
        // Создаем кнопки для каждого элемента
        shuffledElements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'formula-element';
            div.textContent = element;
            div.addEventListener('click', handleFormulaElementClick);
            container.appendChild(div);
        });
    }
    
    // Очищаем предыдущие результаты
    document.getElementById('current-formula').textContent = 'Формула: ';
    document.getElementById('level1-result').textContent = '';
    
    // Добавляем кнопку сброса
    const resetButton = document.getElementById('reset-formula');
    if (resetButton) {
        resetButton.onclick = resetFormula;
    }
}

// Обрабатывает клик по элементу формулы в первом уровне
function handleFormulaElementClick(event) {
    const element = event.target;
    
    // Если элемент еще не использован
    if (!element.classList.contains('used')) {
        currentFormula.push(element.textContent); // Добавляем элемент в формулу
        element.classList.add('used'); // Помечаем элемент как использованный
        
        // Показываем текущую формулу на экране
        const formulaDisplay = document.getElementById('current-formula');
        formulaDisplay.innerHTML = 'Формула: ' + currentFormula.map(el => 
            `<span class="formula-element-placed">${el}</span>`
        ).join(' ');

        // Если собрали все элементы формулы - проверяем правильность
        if (currentFormula.length === formulaElements.length) {
            if (currentFormula.join('') === formulaElements.join('')) {
                // Если формула правильная
                sounds.correct.play();
                createParticles(event.clientX, event.clientY, '#4CAF50'); // Зеленые частицы при успехе
                document.getElementById('level1-result').textContent = 'Формула собрана правильно!';
                handleLevelComplete(1);
            } else {
                attemptsPerLevel[1]++; // Увеличиваем счетчик для первого уровня
                sounds.wrong.play(); // Играем звук ошибки
                const formulaContainer = document.querySelector('.formula-container');
                animations.shake(formulaContainer); // Трясем контейнер при ошибке
                document.getElementById('level1-result').textContent = 'Формула неверна. Попробуйте еще раз!';
                setTimeout(resetFormula, 1500); // Через 1.5 секунды сбрасываем формулу
            }
        }
    }
}

// Сбрасывает формулу для повторной попытки
function resetFormula() {
    currentFormula = []; // Очищаем текущую формулу
    document.getElementById('current-formula').textContent = 'Формула: ';
    document.getElementById('level1-result').textContent = '';
    
    // Убираем пометку "использован" со всех элементов
    document.querySelectorAll('.formula-element').forEach(el => {
        el.classList.remove('used');
    });
}

// Обрабатывает завершение любого уровня
function handleLevelComplete(level) {
    // Считаем очки за уровень
    const levelScore = calculateLevelScore(level);
    levelScores[level - 1] = levelScore;
    
    // Обновляем прогресс игры
    gameData.currentLevel = Math.max(gameData.currentLevel, level + 1);
    gameData.score += levelScore;
    
    // Если прошли последний уровень
    if (level === 3) {
        sounds.levelComplete.play(); // Проигрываем звук завершения игры
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        
        // Добавляем результат в таблицу лидеров
        leaderboard.push({
            name: gameData.playerName,
            score: gameData.score,
            difficulty: gameData.difficulty,
            date: new Date().toISOString()
        });
        
        // Сортируем таблицу лидеров по очкам
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        
        // Показываем поздравление и переходим к таблице лидеров
        setTimeout(() => {
            alert(`Поздравляем! Вы прошли игру!\nВаш итоговый счет: ${gameData.score}`);
            window.location.href = 'leaderboard.html';
        }, 1000);
    } else {
        // Если прошли обычный уровень
        localStorage.setItem('currentGame', JSON.stringify(gameData));
        
        // Показываем информацию о набранных очках
        setTimeout(() => {
            const timeBonus = Math.floor(timeLeft / 1000) * 2;
            const attemptsBonus = (maxAttemptsPerLevel - attemptsPerLevel[level]) * 10;
            const difficultyMultiplier = {
                'easy': 1,
                'medium': 1.5,
                'hard': 2
            }[gameData.difficulty];
            const levelMultiplier = 1 + (level * 0.2);
            const attemptsPenalty = Math.max(0.4, 1 - (attemptsPerLevel[level] * 0.2));
            
            const message = `
                Уровень ${level} пройден!
                
                Базовые очки: 100
                Бонус за время: ${timeBonus}
                Бонус за попытки: ${attemptsBonus}
                Множитель сложности (${gameData.difficulty}): ×${difficultyMultiplier}
                Множитель уровня: ×${levelMultiplier.toFixed(1)}
                Штраф за количество попыток: ×${attemptsPenalty.toFixed(1)}
                
                Итоговые очки за уровень: ${levelScore}
                Общий счет: ${gameData.score}
            `;
            
            alert(message);
            showLevel('menu');
        }, 1000);
    }
}

// Подготовка второго уровня (со схемой)
function initLevel2() {
    attemptsPerLevel[2] = 0; // Сбрасываем попытки второго уровня
    circuitElementsLevel2 = [];
    const randomCircuit = getRandomItem(CIRCUIT_LAYOUTS);
    currentCircuitLayout = randomCircuit; // Сохраняем всю схему целиком
    
    const container = document.getElementById('circuit-container-level2');
    if (container) {
        container.innerHTML = '';
        
        // Размещаем точки
        const dropPoints = [
            { top: '30%', left: '20%', point: '1' },
            { top: '30%', left: '50%', point: '2' },
            { top: '60%', left: '35%', point: '3' },
            { top: '60%', left: '65%', point: '4' },
            { top: '45%', left: '80%', point: '5' }
        ];

        dropPoints.forEach(point => {
            const dropPoint = document.createElement('div');
            dropPoint.className = 'drop-point';
            dropPoint.dataset.point = point.point;
            dropPoint.style.top = point.top;
            dropPoint.style.left = point.left;
            container.appendChild(dropPoint);
        });

        // Добавляем подсказку для текущей схемы
        const hint = document.createElement('p');
        hint.className = 'circuit-hint';
        hint.textContent = currentCircuitLayout.hint;
        container.appendChild(hint);

        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDropLevel2);
    }

    // Создаем элементы для перетаскивания
    const elementsContainer = document.getElementById('elements-container-level2');
    if (elementsContainer) {
        elementsContainer.innerHTML = '';
        const elements = ['battery', 'resistor', 'relay'];
        elements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'circuit-element';
            div.id = element;
            div.draggable = true;
            div.textContent = element;
            div.addEventListener('dragstart', handleDragStart);
            elementsContainer.appendChild(div);
        });

        const checkButton = document.createElement('button');
        checkButton.id = 'check-circuit';
        checkButton.textContent = 'Проверить схему';
        checkButton.className = 'check-button';
        checkButton.onclick = checkCircuitLevel2;
        elementsContainer.appendChild(checkButton);
    }
}

// Обработчики для перетаскивания элементов
function handleDragStart(e) {
    // Запоминаем, какой элемент перетаскиваем
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault(); // Разрешаем бросить элемент
    e.dataTransfer.dropEffect = 'move';
}

// Обработка броска элемента на точку схемы
function handleDropLevel2(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain'); // Получаем ID перетаскиваемого элемента
    const dropPoint = e.target;

    // Проверяем, что бросили на точку и она пустая
    if (dropPoint.classList.contains('drop-point') && !dropPoint.hasChildNodes()) {
        const element = document.getElementById(id);
        const elementCopy = document.createElement('div');
        elementCopy.className = 'placed-element';
        elementCopy.textContent = element.textContent;
        elementCopy.dataset.elementId = id;
        
        // Добавляем возможность удалить элемент кликом
        elementCopy.addEventListener('click', function() {
            dropPoint.removeChild(elementCopy);
            // Удаляем элемент из списка размещенных
            circuitElementsLevel2 = circuitElementsLevel2.filter(item => 
                item.dropPoint !== dropPoint.dataset.point
            );
            updateCircuitStatus();
        });
        
        dropPoint.appendChild(elementCopy);
        
        // Запоминаем, где какой элемент разместили
        circuitElementsLevel2.push({
            elementId: id,
            dropPoint: dropPoint.dataset.point
        });

        updateCircuitStatus();
        createParticles(e.clientX, e.clientY, '#2196F3'); // Синие частицы при размещении элемента
    }
}

// Обновляет информацию о количестве размещенных элементов
function updateCircuitStatus() {
    const statusElement = document.getElementById('level2-result');
    if (statusElement) {
        statusElement.textContent = `Размещено элементов: ${circuitElementsLevel2.length}/5`;
    }
}

// Обновленная функция проверки схемы
function checkCircuitLevel2() {
    let isCorrect = true;
    let errors = [];

    // Проверяем каждый размещенный элемент
    circuitElementsLevel2.forEach(placement => {
        const correctPoints = currentCircuitLayout.correctPositions[placement.elementId];
        
        // Если элемент должен быть в этой точке
        if (!correctPoints || !correctPoints.includes(placement.dropPoint)) {
            isCorrect = false;
            errors.push(`${placement.elementId} размещен неправильно`);
        }
    });

    // Проверяем, все ли необходимые элементы размещены
    const requiredElements = Object.keys(currentCircuitLayout.correctPositions);
    const placedElements = circuitElementsLevel2.map(p => p.elementId);
    
    requiredElements.forEach(element => {
        if (!placedElements.includes(element)) {
            isCorrect = false;
            errors.push(`Не размещен элемент: ${element}`);
        }
    });

    const resultElement = document.getElementById('level2-result');
    if (isCorrect) {
        sounds.correct.play();
        createParticles(event.clientX, event.clientY, '#4CAF50');
        resultElement.textContent = 'Схема собрана правильно!';
        resultElement.style.color = 'green';
        handleLevelComplete(2);
    } else {
        attemptsPerLevel[2]++; // Увеличиваем счетчик для второго уровня
        sounds.wrong.play();
        animations.shake(document.getElementById('circuit-container-level2'));
        resultElement.textContent = 'Ошибка: ' + errors.join(', ');
        resultElement.style.color = 'red';
    }
}

// Подготовка третьего уровня
function initLevel3() {
    attemptsPerLevel[3] = 0; // Сбрасываем попытки третьего уровня
    const randomTask = getRandomItem(COMPONENT_TASKS);
    const selectionContainer = document.getElementById('selection-container');
    if (!selectionContainer) return;
    
    selectionContainer.innerHTML = `
        <div class="level3-task">
            <h3>${randomTask.task}</h3>
        </div>
        
        <div class="components-grid">
            ${randomTask.components.map(component => `
                <div class="component-card" data-correct="${component.correct}">
                    <img src="images/${component.id}.png" alt="${component.name}">
                    <p>${component.name}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="level3-controls">
            <button id="check-components">Проверить выбор</button>
            <div id="level3-result"></div>
        </div>
    `;

    // Добавляем обработчики для карточек компонентов
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected'); // При клике выделяем/снимаем выделение
        });
    });

    // Добавляем обработчик для кнопки проверки
    const checkButton = document.getElementById('check-components');
    if (checkButton) {
        checkButton.addEventListener('click', checkLevel3Components);
    }
}

// Проверяет правильность выбранных компонентов в третьем уровне
function checkLevel3Components() {
    const selectedCards = document.querySelectorAll('.component-card.selected'); // Выбранные компоненты
    const correctCards = document.querySelectorAll('.component-card[data-correct="true"]'); // Правильные компоненты
    const resultElement = document.getElementById('level3-result');
    
    let isCorrect = true;
    
    // Проверяем, что выбраны все правильные компоненты и только они
    selectedCards.forEach(card => {
        if (card.dataset.correct !== "true") {
            isCorrect = false;
        }
    });
    
    if (selectedCards.length !== correctCards.length) {
        isCorrect = false;
    }

    if (isCorrect) {
        // Если все выбрано правильно
        sounds.correct.play();
        createParticles(event.clientX, event.clientY, '#4CAF50');
        resultElement.textContent = 'Правильно! Вы выбрали все необходимые компоненты!';
        resultElement.style.color = 'green';
        handleLevelComplete(3);
    } else {
        attemptsPerLevel[3]++; // Увеличиваем счетчик для третьего уровня
        sounds.wrong.play();
        animations.shake(document.getElementById('selection-container'));
        resultElement.textContent = 'Неправильно! Попробуйте еще раз.';
        resultElement.style.color = 'red';
    }
}

// Запускаем игру при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);