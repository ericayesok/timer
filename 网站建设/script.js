let timerInterval;
let elapsedTime = 0;

const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

startBtn.style.backgroundColor = '#4CAF50'; // Green
startBtn.style.color = 'white';
pauseBtn.style.backgroundColor = '#f44336'; // Red 
pauseBtn.style.color = 'white';
resetBtn.style.backgroundColor = '#000000'; // Black
resetBtn.style.color = 'white';
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

function updateTimer() {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    timerElement.textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            elapsedTime++;
            updateTimer();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    elapsedTime = 0;
    updateTimer();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateTimer(); 