/**
 * Hangman Game - FINAL WORKING VERSION
 * All features working: Win, Loss, Hints, Celebration
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

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Game initializing...');
    createKeyboard();
    
    // Show rules modal on load
    const rulesModal = document.getElementById('rulesModal');
    if (rulesModal) {
        rulesModal.style.display = 'flex';
    }
});

// ==================== KEYBOARD ====================
function createKeyboard() {
    const letterButtons = document.getElementById('letter-buttons');
    if (!letterButtons) {
        console.error('❌ letter-buttons element not found!');
        return;
    }
    
    letterButtons.innerHTML = '';
    LETTERS.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.className = 'letter-btn';
        btn.id = `btn-${letter}`;
        btn.addEventListener('click', () => guessLetter(letter, btn));
        letterButtons.appendChild(btn);
    });
    console.log('✅ Keyboard created');
}

// ==================== MODAL FUNCTIONS ====================
function startGame() {
    console.log('🎮 Starting game...');
    const rulesModal = document.getElementById('rulesModal');
    if (rulesModal) rulesModal.style.display = 'none';
    startNewGame();
}

// ==================== GAME LOGIC ====================
async function startNewGame() {
    console.log('📝 New game requested...');
    try {
        const response = await fetch('/api/new-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log('✅ New game response:', data);
        
        if (data.status === 'success') {
            gameState = data.state;
            console.log('📊 Game state:', gameState);
            
            // Update UI
            const diffClass = gameState.difficulty === 'easy' ? 'Easy' : 'Hard';
            const diffElement = document.getElementById('difficulty-text');
            if (diffElement) {
                diffElement.textContent = `Difficulty: ${diffClass} (${gameState.max_hints} hint${gameState.max_hints > 1 ? 's' : ''})`;
            }
            
            updateDisplay();
            resetKeyboard();
            clearMessages();
            
            const hintBtn = document.getElementById('hint-btn');
            if (hintBtn) hintBtn.disabled = false;
            
            const hintsGiven = document.getElementById('hints-given');
            if (hintsGiven) hintsGiven.innerHTML = '';
            
            updateHintButton();
        }
    } catch (error) {
        console.error('❌ Error starting new game:', error);
        showMessage('Error starting new game!', 'error');
    }
}

async function guessLetter(letter, btn) {
    console.log('📮 Guessing letter:', letter);
    
    if (gameState.gameOver || !btn) {
        console.log('⚠️ Game already over or invalid button');
        return;
    }

    btn.disabled = true;

    try {
        const response = await fetch('/api/guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ letter: letter })
        });

        const data = await response.json();
        console.log('📥 Guess response:', data);
        
        if (data.status === 'success') {
            gameState = data.state;
            console.log('📊 Updated state:', gameState);

            // Update button appearance
            if (data.state.wrong_guesses && data.state.wrong_guesses.includes(letter)) {
                btn.classList.add('wrong');
            } else if (data.state.guessed_letters && data.state.guessed_letters.includes(letter)) {
                btn.classList.add('correct');
            }

            updateDisplay();
            showMessage(data.message);

            // Check if game is over
            console.log('🎯 Game over?', gameState.gameOver, '| Won?', gameState.won);
            
            if (gameState.gameOver) {
                disableAllButtons();
                
                if (gameState.won) {
                    console.log('🎉🎉🎉 PLAYER WON! 🎉🎉🎉');
                    setTimeout(() => showCelebration(), 800);
                } else {
                    console.log('💀💀💀 PLAYER LOST! 💀💀💀');
                    setTimeout(() => showGameOver(), 800);
                }
            }
        } else {
            console.log('⚠️ Guess failed:', data.message);
            showMessage(data.message, 'error');
            btn.disabled = false;
        }
    } catch (error) {
        console.error('❌ Error guessing:', error);
        showMessage('Error making guess!', 'error');
        btn.disabled = false;
    }
}

// ==================== WIN CELEBRATION ====================
function showCelebration() {
    console.log('🎉 SHOWING CELEBRATION PAGE!');
    
    try {
        const word = gameState.display_word.replace(/ /g, '').trim();
        const wrongCount = gameState.wrong_guesses ? gameState.wrong_guesses.length : 0;
        const hintsUsed = gameState.hints_used || 0;
        
        console.log('📝 Word:', word, '| Wrong:', wrongCount, '| Hints:', hintsUsed);
        
        // Get message
        let celebMessage = '';
        if (wrongCount === 0) celebMessage = '🔥 Perfect game! Zero mistakes - You\'re a legend!';
        else if (wrongCount <= 2) celebMessage = '⭐ Excellent! You\'re incredibly skilled!';
        else if (wrongCount <= 4) celebMessage = '👏 Great job! You nailed it!';
        else celebMessage = '🎯 You did it! Keep practicing to improve!';
        
        // Update celebration modal
        const celebWord = document.getElementById('celebrationWord');
        const celebWrong = document.getElementById('celebWrongCount');
        const celebHints = document.getElementById('celebHintsUsed');
        const celebDiff = document.getElementById('celebDifficulty');
        const celebMsg = document.getElementById('celebMessage');
        
        if (celebWord) celebWord.innerHTML = `The word was: <strong>${word}</strong>`;
        if (celebWrong) celebWrong.textContent = `${wrongCount}/6`;
        if (celebHints) celebHints.textContent = `${hintsUsed}/${gameState.max_hints}`;
        if (celebDiff) celebDiff.textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
        if (celebMsg) celebMsg.textContent = celebMessage;
        
        // Show modal
        const modal = document.getElementById('celebrationModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('✅ Celebration modal displayed!');
        } else {
            console.error('❌ celebrationModal not found!');
        }
    } catch (error) {
        console.error('❌ Error showing celebration:', error);
    }
}

// ==================== LOSS GAME OVER ====================
function showGameOver() {
    console.log('💀 SHOWING GAME OVER PAGE!');
    
    try {
        const word = gameState.display_word.replace(/ /g, '').trim();
        const wrongCount = gameState.wrong_guesses ? gameState.wrong_guesses.length : 0;
        const hintsUsed = gameState.hints_used || 0;
        
        console.log('📝 Word:', word, '| Wrong:', wrongCount, '| Hints:', hintsUsed);
        
        // Get message
        let gameoverMessage = '';
        if (hintsUsed === 0) gameoverMessage = '💪 You didn\'t use hints! Next time try using them!';
        else if (wrongCount <= 2) gameoverMessage = '⭐ Almost there! One more try will do it!';
        else if (wrongCount <= 4) gameoverMessage = '🎯 Don\'t worry! You\'re getting closer!';
        else gameoverMessage = '💪 Keep practicing! You\'ll get better!';
        
        // Update game over modal
        const gameOverWord = document.getElementById('gameOverWord');
        const gameOverWrong = document.getElementById('gameOverWrongCount');
        const gameOverHints = document.getElementById('gameOverHintsUsed');
        const gameOverDiff = document.getElementById('gameOverDifficulty');
        const gameOverMsg = document.getElementById('gameOverMessage');
        
        if (gameOverWord) gameOverWord.innerHTML = `The word was: <strong>${word}</strong>`;
        if (gameOverWrong) gameOverWrong.textContent = `${wrongCount}/6`;
        if (gameOverHints) gameOverHints.textContent = `${hintsUsed}/${gameState.max_hints}`;
        if (gameOverDiff) gameOverDiff.textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
        if (gameOverMsg) gameOverMsg.textContent = gameoverMessage;
        
        // Show modal
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('✅ Game over modal displayed!');
        } else {
            console.error('❌ gameOverModal not found!');
        }
    } catch (error) {
        console.error('❌ Error showing game over:', error);
    }
}

// Start new game from celebration
function startNewGameFromCelebration() {
    console.log('🎮 New game from celebration');
    const modal = document.getElementById('celebrationModal');
    if (modal) modal.style.display = 'none';
    startNewGame();
}

// Start new game from game over
function startNewGameFromGameOver() {
    console.log('🎮 New game from game over');
    const modal = document.getElementById('gameOverModal');
    if (modal) modal.style.display = 'none';
    startNewGame();
}

// ==================== HINTS ====================
async function requestHint() {
    console.log('💡 Hint requested');
    
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
        console.log('💡 Hint response:', data);

        if (data.status === 'success') {
            gameState = data.state;
            displayHintBox(data.hint_text);
            updateDisplay();
            showHintMessage(data.message, 'success');
            updateHintButton();
        } else {
            showHintMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error getting hint:', error);
        showHintMessage('Error: ' + error.message, 'error');
    }
}

function displayHintBox(hintText) {
    const hintsGiven = document.getElementById('hints-given');
    if (!hintsGiven) {
        console.error('❌ hints-given element not found!');
        return;
    }
    
    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box';
    hintBox.innerHTML = `<strong>Hint ${gameState.hints_used}:</strong> ${hintText}`;
    hintsGiven.appendChild(hintBox);
    hintsGiven.scrollTop = hintsGiven.scrollHeight;
}

function showHintMessage(message, type = 'info') {
    const hintMessage = document.getElementById('hint-message');
    if (!hintMessage) {
        console.error('❌ hint-message element not found!');
        return;
    }
    
    hintMessage.textContent = message;
    hintMessage.className = 'hint-message ' + type;
    hintMessage.classList.remove('hidden');
    
    setTimeout(() => {
        hintMessage.classList.add('hidden');
    }, 4000);
}

function updateHintButton() {
    const remaining = gameState.hints_remaining || 0;
    const max = gameState.max_hints || 2;
    
    const hintsRemaining = document.getElementById('hints-remaining');
    const maxHints = document.getElementById('max-hints');
    const hintBtn = document.getElementById('hint-btn');
    
    if (hintsRemaining) hintsRemaining.textContent = remaining;
    if (maxHints) maxHints.textContent = max;
    
    if (hintBtn) {
        if (remaining <= 0) {
            hintBtn.disabled = true;
            hintBtn.textContent = '💡 No More Hints';
        } else {
            hintBtn.disabled = false;
            hintBtn.textContent = `💡 Get a Clue (${remaining}/${max})`;
        }
    }
}

// ==================== DISPLAY ====================
function updateDisplay() {
    const wordDisplay = document.getElementById('word');
    const wordLength = document.getElementById('word-length');
    const guessedLettersDisplay = document.getElementById('guessed-letters');
    const wrongCountDisplay = document.getElementById('wrong-count');
    
    if (wordDisplay) wordDisplay.textContent = gameState.display_word || '_ _ _ _ _ _';
    if (wordLength) wordLength.textContent = gameState.word_length || '6';

    if (guessedLettersDisplay) {
        if (gameState.guessed_letters && gameState.guessed_letters.length > 0) {
            guessedLettersDisplay.innerHTML = gameState.guessed_letters
                .map(letter => `<span>${letter}</span>`)
                .join('');
        } else {
            guessedLettersDisplay.innerHTML = '<span class="placeholder">None yet</span>';
        }
    }

    const wrongCount = gameState.wrong_guesses ? gameState.wrong_guesses.length : 0;
    if (wrongCountDisplay) wrongCountDisplay.textContent = wrongCount;
    updateHangman(wrongCount);
    updateHintButton();
}

function updateHangman(wrongCount) {
    hangmanParts.forEach((part, index) => {
        const element = document.getElementById(part);
        if (element) {
            element.style.display = index < wrongCount ? 'block' : 'none';
        }
    });
}

function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message');
    
    if (!messageBox || !messageText) return;
    
    messageText.textContent = message;
    messageText.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
    messageBox.classList.remove('hidden');
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

function clearMessages() {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message');
    const hintMessage = document.getElementById('hint-message');
    
    if (messageBox) messageBox.classList.add('hidden');
    if (messageText) messageText.textContent = '';
    if (hintMessage) hintMessage.classList.add('hidden');
}

function disableAllButtons() {
    console.log('🔒 Disabling all buttons');
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) hintBtn.disabled = true;
}

function resetKeyboard() {
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    const newGameBtn = document.getElementById('new-game-btn');
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');
    
    if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);
    if (resetBtn) resetBtn.addEventListener('click', () => location.reload());
    if (hintBtn) hintBtn.addEventListener('click', requestHint);
});

console.log('✅✅✅ hangman.js LOADED SUCCESSFULLY! ✅✅✅');