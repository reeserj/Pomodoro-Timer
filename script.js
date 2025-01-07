let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const quoteElement = document.getElementById('quote');
const attributionElement = document.getElementById('attribution');
const progressBar = document.querySelector('.progress');
let totalTime;

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds
const chillButton = document.getElementById('chill');
const CHILL_TIME = 5 * 60; // 5 minutes in seconds
let chillTimeoutId = null;
let chillIntervalId = null;
let chillTimeLeft = CHILL_TIME;

const quotes = [
    "The best way out is always through.",
    "Do what you can, with what you have, where you are.",
    "Even if you're on the right track, you'll get run over if you just sit there.",
    "Don't let yesterday use up too much of today.",
    "The only way to do great work is to love what you do.",
    "Your time is limited, don't waste it living someone else's life.",
    "The only way to get better is to practice.",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "Worrying is like paying a debt that may never come due",
    "Be thankful we're not getting all the government we're paying for",

];

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    updateTitle();
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    totalTime = timeLeft;
    modeText.textContent = isWorkTime ? 'Get it' : 'Chill';
    updateDisplay();
    updateProgress();
}

function startTimer() {
    if (timerId === null) {
        // Clear any active chill timer when starting main timer
        if (chillTimeoutId) {
            clearTimeout(chillTimeoutId);
            clearInterval(chillIntervalId);
            chillTimeoutId = null;
            chillIntervalId = null;
            chillTimeLeft = CHILL_TIME;
            chillButton.querySelector('span').textContent = 'Chill (5:00)';
            chillButton.classList.remove('chill-active');
            chillButton.style.background = '';
        }

        // Reset the timer to full work/break time when starting
        timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
        totalTime = timeLeft;
        modeText.textContent = isWorkTime ? 'Get it' : 'Chill';
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            updateProgress();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                switchMode();
                startTimer();
            }
        }, 1000);
        startButton.textContent = 'Stop';
        startButton.classList.add('stop');
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        startButton.classList.remove('stop');
    }
}

function resetTimer() {
    clearInterval(timerId);
    clearInterval(chillIntervalId);
    timerId = null;
    chillIntervalId = null;
    if (chillTimeoutId) {
        clearTimeout(chillTimeoutId);
        chillTimeoutId = null;
        chillTimeLeft = CHILL_TIME;
        chillButton.querySelector('span').textContent = 'Chill (5:00)';
        chillButton.classList.remove('chill-active');
        chillButton.style.background = '';
    }
    isWorkTime = true;
    timeLeft = WORK_TIME;
    totalTime = WORK_TIME;
    modeText.textContent = 'Get it';
    startButton.textContent = 'Start';
    startButton.classList.remove('stop');
    updateDisplay();
    updateProgress();
    document.title = '25:00 - Work';
}

function rotateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.style.opacity = '0';
    attributionElement.style.opacity = '0';
    
    setTimeout(() => {
        quoteElement.textContent = `"${quotes[randomIndex]}"`;
        attributionElement.textContent = "- Will Rogers";
        quoteElement.style.opacity = '1';
        attributionElement.style.opacity = '1';
    }, 500);
}

function updateProgress() {
    const progress = (totalTime - timeLeft) / totalTime;
    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset;
}

function updateChillDisplay() {
    const minutes = Math.floor(chillTimeLeft / 60);
    const seconds = chillTimeLeft % 60;
    const progressPercent = (chillTimeLeft / CHILL_TIME) * 100;
    chillButton.querySelector('span').textContent = `Chill (${minutes}:${seconds.toString().padStart(2, '0')})`;
    
    // Update title with chill time
    document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Chilling`;
    
    // Update progress bar
    if (chillTimeoutId) {
        chillButton.style.setProperty('--progress', `${progressPercent}%`);
        chillButton.style.background = `linear-gradient(90deg, 
            #9b59b6 ${progressPercent}%, 
            #8e44ad ${progressPercent}%
        )`;
    } else {
        chillButton.style.background = '';
    }
}

function startChill() {
    if (chillTimeoutId) {
        clearTimeout(chillTimeoutId);
        clearInterval(chillIntervalId);
        chillTimeoutId = null;
        chillIntervalId = null;
        chillTimeLeft = CHILL_TIME;
        chillButton.querySelector('span').textContent = 'Chill (5:00)';
        chillButton.classList.remove('chill-active');
        chillButton.style.background = '';
        modeText.textContent = isWorkTime ? 'Get it' : 'Chill';
        // Reset work/break timer to full time
        timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
        totalTime = timeLeft;
        startTimer();
        return;
    }

    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        startButton.classList.remove('stop');
    }

    chillTimeLeft = CHILL_TIME;
    chillButton.classList.add('chill-active');
    modeText.textContent = 'Chill';
    updateChillDisplay();
    
    chillIntervalId = setInterval(() => {
        if (chillTimeLeft <= 0) {
            clearInterval(chillIntervalId);
            clearTimeout(chillTimeoutId);
            chillIntervalId = null;
            chillTimeoutId = null;
            chillTimeLeft = CHILL_TIME;
            chillButton.querySelector('span').textContent = 'Chill (5:00)';
            chillButton.classList.remove('chill-active');
            startTimer();
            return;
        }
        chillTimeLeft--;
        updateChillDisplay();
    }, 1000);
    
    chillTimeoutId = setTimeout(() => {
        clearInterval(chillIntervalId);
        chillIntervalId = null;
        chillTimeoutId = null;
        chillTimeLeft = CHILL_TIME;
        chillButton.querySelector('span').textContent = 'Chill (5:00)';
        chillButton.classList.remove('chill-active');
        modeText.textContent = isWorkTime ? 'Get it' : 'Chill';
        startTimer();
    }, CHILL_TIME * 1000);
}

function updateTitle() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (chillTimeoutId) {
        document.title = `${timeString} - Chilling`;
    } else {
        document.title = `${timeString} - ${isWorkTime ? 'Get It' : 'Chill'}`;
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
chillButton.addEventListener('click', startChill);

// Initialize the display
resetTimer(); 

// Rotate quotes every 30 seconds
rotateQuote();
setInterval(rotateQuote, 30000); 

// Initialize the chill button text
chillButton.innerHTML = '<span>Chill (5:00)</span>'; 