"""
Flask Web Server for Hangman Game
Provides REST API endpoints for the Hangman game
"""

from flask import Flask, render_template, request, jsonify, session
import random
import string

app = Flask(__name__)
app.secret_key = 'codealpha_hangman_secret_key_2024'

# Word list
WORDS = ["python", "hangman", "developer", "computer", "algorithm", "javascript", "database", "programming", "internet", "software"]

class HangmanGame:
    """Hangman Game Class"""
    def __init__(self):
        self.word = random.choice(WORDS).upper()
        self.guessed_letters = set()
        self.wrong_guesses = set()
        self.max_wrong = 6
        self.game_over = False
        self.won = False
    
    def guess_letter(self, letter):
        """Process a letter guess"""
        letter = letter.upper()
        
        # Validation
        if letter in self.guessed_letters or letter in self.wrong_guesses:
            return {'success': False, 'message': f'Letter {letter} already guessed!'}
        
        if not letter.isalpha() or len(letter) != 1:
            return {'success': False, 'message': 'Please enter a single letter!'}
        
        # Check if correct
        if letter in self.word:
            self.guessed_letters.add(letter)
            message = f'✅ Correct! {letter} is in the word!'
        else:
            self.wrong_guesses.add(letter)
            message = f'❌ Wrong! {letter} is not in the word!'
        
        # Check win/loss
        if all(letter in self.guessed_letters for letter in self.word):
            self.game_over = True
            self.won = True
            message = f'{message}\n🎉 YOU WON! The word was {self.word}!'
        elif len(self.wrong_guesses) >= self.max_wrong:
            self.game_over = True
            self.won = False
            message = f'{message}\n💀 GAME OVER! The word was {self.word}!'
        
        return {'success': True, 'message': message}
    
    def get_display_word(self):
        """Get word with blanks for guessed letters"""
        return ' '.join([letter if letter in self.guessed_letters else '_' for letter in self.word])
    
    def get_state(self):
        """Get current game state"""
        return {
            'display_word': self.get_display_word(),
            'guessed_letters': sorted(list(self.guessed_letters)),
            'wrong_guesses': sorted(list(self.wrong_guesses)),
            'wrong_count': len(self.wrong_guesses),
            'remaining': self.max_wrong - len(self.wrong_guesses),
            'game_over': self.game_over,
            'won': self.won,
            'word_length': len(self.word)
        }

@app.route('/')
def index():
    """Render the main game page"""
    return render_template('game.html')

@app.route('/api/new-game', methods=['POST'])
def new_game():
    """Start a new game"""
    game = HangmanGame()
    session['game'] = {
        'word': game.word,
        'guessed_letters': list(game.guessed_letters),
        'wrong_guesses': list(game.wrong_guesses),
        'max_wrong': game.max_wrong,
        'game_over': game.game_over,
        'won': game.won
    }
    
    return jsonify({
        'status': 'success',
        'state': {
            'display_word': game.get_display_word(),
            'word_length': len(game.word),
            'guessed_letters': [],
            'wrong_guesses': [],
            'remaining': game.max_wrong,
            'game_over': False,
            'won': False
        }
    }), 200

@app.route('/api/guess', methods=['POST'])
def guess():
    """Process a letter guess"""
    try:
        if 'game' not in session:
            return jsonify({'status': 'error', 'message': 'No active game!'}), 400
        
        data = request.get_json()
        letter = data.get('letter', '').strip()
        
        # Recreate game from session
        game = HangmanGame()
        game.word = session['game']['word']
        game.guessed_letters = set(session['game']['guessed_letters'])
        game.wrong_guesses = set(session['game']['wrong_guesses'])
        game.game_over = session['game']['game_over']
        game.won = session['game']['won']
        
        # Check if game already over
        if game.game_over:
            return jsonify({
                'status': 'error',
                'message': 'Game is over! Start a new game.',
                'state': game.get_state()
            }), 400
        
        # Make guess
        result = game.guess_letter(letter)
        
        # Update session
        session['game']['guessed_letters'] = list(game.guessed_letters)
        session['game']['wrong_guesses'] = list(game.wrong_guesses)
        session['game']['game_over'] = game.game_over
        session['game']['won'] = game.won
        session.modified = True
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'message': result['message'],
                'state': game.get_state()
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': result['message'],
                'state': game.get_state()
            }), 400
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Get current game status"""
    if 'game' not in session:
        return jsonify({'status': 'no_game'}), 200
    
    game = HangmanGame()
    game.word = session['game']['word']
    game.guessed_letters = set(session['game']['guessed_letters'])
    game.wrong_guesses = set(session['game']['wrong_guesses'])
    game.game_over = session['game']['game_over']
    game.won = session['game']['won']
    
    return jsonify({
        'status': 'active',
        'state': game.get_state()
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)
