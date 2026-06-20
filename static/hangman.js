/**
 * Hangman Game - Frontend Logic
 */

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

let gameState = {
    displayWord: '',
    guessedLetters: [],
    wrongGuesses: [],
    wrongCount: 0,
    remaining: 6,
    gameOver: false,
    won: false
};

// DOM Elements
const wordDisplay = document.getElementById('word');
const wordLength = document.getElementById('word-length');
const letterButtons = document.getElementById('letter-buttons');
const guessedLettersDisplay = document.getElementById('guessed-letters');
const wrongCountDisplay = document.getElementById('wrong-count');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message');
const gameStatus = document.getElementById('game-status');
const statusTitle = document.getElementById('status-title');
const statusWord = document.getElementById('status-word');
const newGameBtn = document.getElementById('new-game-btn');
const resetBtn = document.getElementById('reset-btn');

// Initialize Game
window.addEventListener('load', () => {
    createKeyboard();
    startNewGame();
});

// Event Listeners
newGameBtn.addEventListener('click', startNewGame);
resetBtn.addEventListener('click', () => location.reload());

// Create Keyboard
function createKeyboard() {
    letterButtons.innerHTML = '';
    LETTERS.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.className = 'letter-btn';
        btn.id = `btn-${letter}`;
        btn.addEventListener('click', () => guessLetter(letter, btn));
        letterButtons.appendChild(btn);
    });
}

// Start New Game
async function startNewGame() {
    try {
        const response = await fetch('/api/new-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            gameState = data.state;
            updateDisplay();
            resetKeyboard();
            clearMessages();
            gameStatus.classList.add('hidden');
        }
    } catch (error) {
        showMessage('Error starting new game!', 'error');
    }
}

// Guess Letter
async function guessLetter(letter, btn) {
    if (gameState.gameOver || !btn) return;

    btn.disabled = true;

    try {
        const response = await fetch('/api/guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ letter: letter })
        });

        const data = await response.json();
        gameState = data.state;

        // Update button appearance
        if (data.state.wrong_guesses.includes(letter)) {
            btn.classList.add('wrong');
        } else if (data.state.guessed_letters.includes(letter)) {
            btn.classList.add('correct');
        }

        updateDisplay();
        showMessage(data.message);

        // Check if game is over
        if (gameState.gameOver) {
            disableAllButtons();
            showGameStatus(gameState.won);
        }
    } catch (error) {
        showMessage('Error making guess!', 'error');
        btn.disabled = false;
    }
}

// Update Display
function updateDisplay() {
    // Word Display
    wordDisplay.textContent = gameState.display_word || '_ _ _ _ _ _';
    wordLength.textContent = gameState.word_length || '6';

    // Guessed Letters
    if (gameState.guessed_letters && gameState.guessed_letters.length > 0) {
        guessedLettersDisplay.innerHTML = gameState.guessed_letters
            .map(letter => `<span>${letter}</span>`)
            .join('');
    } else {
        guessedLettersDisplay.innerHTML = '<span class="placeholder">None yet</span>';
    }

    // Wrong Count & Hangman Drawing
    const wrongCount = gameState.wrong_guesses ? gameState.wrong_guesses.length : 0;
    wrongCountDisplay.textContent = wrongCount;
    updateHangman(wrongCount);
}

// Update Hangman Drawing
function updateHangman(wrongCount) {
    hangmanParts.forEach((part, index) => {
        const element = document.getElementById(part);
        if (index < wrongCount) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

// Show Message
function showMessage(message, type = 'info') {
    messageText.textContent = message;
    messageText.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
    messageBox.classList.remove('hidden');
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// Clear Messages
function clearMessages() {
    messageBox.classList.add('hidden');
    messageText.textContent = '';
}

// Show Game Status
function showGameStatus(won) {
    gameStatus.classList.remove('hidden');
    gameStatus.classList.remove('won', 'lost');
    
    if (won) {
        gameStatus.classList.add('won');
        statusTitle.textContent = '🎉 YOU WON!';
        statusTitle.style.color = '#27ae60';
    } else {
        gameStatus.classList.add('lost');
        statusTitle.textContent = '💀 GAME OVER!';
        statusTitle.style.color = '#e74c3c';
    }
}

// Disable All Buttons
function disableAllButtons() {
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = true;
    });
}

// Reset Keyboard
function resetKeyboard() {
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

// Load Game Status on Page Load
async function loadGameStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.status === 'active') {
            gameState = data.state;
            updateDisplay();
            disableAlreadyGuessed();
        }
    } catch (error) {
        console.log('No active game');
    }
}

// Disable Already Guessed Letters
function disableAlreadyGuessed() {
    const allGuessed = [...(gameState.guessed_letters || []), ...(gameState.wrong_guesses || [])];
    allGuessed.forEach(letter => {
        const btn = document.getElementById(`btn-${letter}`);
        if (btn) {
            btn.disabled = true;
            if (gameState.guessed_letters.includes(letter)) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
            }
        }
    });
}
