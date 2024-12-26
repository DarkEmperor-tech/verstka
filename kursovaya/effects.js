// Звуковые эффекты
const sounds = {
    correct: new Audio('sounds/correct.mp3'),
    wrong: new Audio('sounds/wrong.mp3'),
    levelComplete: new Audio('sounds/level-complete.mp3'),
    gameOver: new Audio('sounds/game-over.mp3')
};

// Анимации элементов
const animations = {
    shake: (element) => {
        element.style.animation = 'shake 0.2s';
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        });
    },
    
    float: (element) => {
        element.style.animation = 'float 1s infinite';
    },
    
    pulse: (element) => {
        element.style.animation = 'pulse 2s infinite';
    }
};

// Визуальные эффекты
function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
} 