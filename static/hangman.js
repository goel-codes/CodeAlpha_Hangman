/**
 * Hangman Game - Final JavaScript
 * Works with final Flask API
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
    won: false,
    hintsUsed: 0,
    hintsRemaining: 2,
    maxHints: 2,
    difficulty: 'easy'
};

// DOM Elements
const rulesModal = document.getElementById('rulesModal');
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
const statusHints = document.getElementById('status-hints');
const newGameBtn = document.getElementById('new-game-btn');
const resetBtn = document.getElementById('reset-btn');
const hintBtn = document.getElementById('hint-btn');
const hintMessage = document.getElementById('hint-message');
const hintsRemaining = document.getElementById('hints-remaining');
const maxHints = document.getElementById('max-hints');
const hintsGivenDiv = document.getElementById('hints-given');
const difficultyText = document.getElementById('difficulty-text');

// Initialize
window.addEventListener('load', () => {
    createKeyboard();
    showRulesModal();
});

// Event Listeners
newGameBtn.addEventListener('click', startNewGame);
resetBtn.addEventListener('click', () => location.reload());

// Show Rules Modal
function showRulesModal() {
    rulesModal.style.display = 'flex';
}

// Start Game
function startGame() {
    rulesModal.style.display = 'none';
    startNewGame();
}

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
            
            // Update difficulty display
            const diffClass = gameState.difficulty === 'easy' ? 'Easy' : 'Hard';
            difficultyText.textContent = `Difficulty: ${diffClass} (${gameState.max_hints} hint${gameState.max_hints > 1 ? 's' : ''})`;
            
            updateDisplay();
            resetKeyboard();
            clearMessages();
            gameStatus.classList.add('hidden');
            hintBtn.disabled = false;
            hintsGivenDiv.innerHTML = '';
            updateHintButton();
        }
    } catch (error) {
        showMessage('Error starting new game!', 'error');
        console.error(error);
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
        
        if (data.status === 'success') {
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
        } else {
            showMessage(data.message, 'error');
            btn.disabled = false;
        }
    } catch (error) {
        showMessage('Error making guess!', 'error');
        btn.disabled = false;
        console.error(error);
    }
}

// Request Hint
async function requestHint() {
    if (gameState.gameOver) {
        showHintMessage('Game is over! Start a new game.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/hint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.status === 'success') {
            gameState = data.state;

            // Display the hint
            displayHintBox(data.hint_text);
            updateDisplay();
            showHintMessage(data.message, 'success');
            updateHintButton();
        } else {
            showHintMessage(data.message, 'error');
        }
    } catch (error) {
        showHintMessage('Error: ' + error.message, 'error');
        console.error(error);
    }
}

// Display Hint Box
function displayHintBox(hintText) {
    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box';
    hintBox.innerHTML = `<strong>Hint ${gameState.hints_used}:</strong> ${hintText}`;
    hintsGivenDiv.appendChild(hintBox);
    
    // Auto scroll
    hintsGivenDiv.scrollTop = hintsGivenDiv.scrollHeight;
}

// Show Hint Message
function showHintMessage(message, type = 'info') {
    hintMessage.textContent = message;
    hintMessage.className = 'hint-message ' + type;
    
    setTimeout(() => {
        hintMessage.classList.add('hidden');
    }, 4000);
}

// Update Hint Button
function updateHintButton() {
    const remaining = gameState.hints_remaining || 0;
    const max = gameState.max_hints || 2;
    
    hintsRemaining.textContent = remaining;
    maxHints.textContent = max;
    
    if (remaining <= 0) {
        hintBtn.disabled = true;
        hintBtn.textContent = '💡 No More Hints';
    } else {
        hintBtn.disabled = false;
        hintBtn.textContent = `💡 Get a Clue (${remaining}/${max})`;
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

    // Wrong Count & Hangman
    const wrongCount = gameState.wrong_guesses ? gameState.wrong_guesses.length : 0;
    wrongCountDisplay.textContent = wrongCount;
    updateHangman(wrongCount);

    // Hints
    updateHintButton();
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
    hintMessage.classList.add('hidden');
}

// Show Game Status
function showGameStatus(won) {
    gameStatus.classList.remove('hidden');
    gameStatus.classList.remove('won', 'lost');
    
    if (won) {
        gameStatus.classList.add('won');
        statusTitle.textContent = '🎉 YOU WON!';
        statusTitle.style.color = '#27ae60';
        statusWord.textContent = 'Congratulations! You guessed the word!';
    } else {
        gameStatus.classList.add('lost');
        statusTitle.textContent = '💀 GAME OVER!';
        statusTitle.style.color = '#e74c3c';
        statusWord.textContent = 'Better luck next time!';
    }
    
    // Show hints used
    if (gameState.hints_used > 0) {
        statusHints.innerHTML = `<strong>Hints used:</strong> ${gameState.hints_used}/${gameState.max_hints}`;
    }
}

// Disable All Buttons
function disableAllButtons() {
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = true;
    });
    hintBtn.disabled = true;
}

// Reset Keyboard
function resetKeyboard() {
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}