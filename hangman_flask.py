"""
Enhanced Flask Web Server for Hangman Game
With Smart Hint System - FINAL FIXED VERSION
"""

from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = 'codealpha_hangman_secret_key_2024'

# Word list with hints and difficulty
WORDS_WITH_HINTS = {
    "python": {
        "difficulty": "hard",
        "hints": [
            "🐍 I'm a snake that slithers through code. What am I?",
            "I'm a programming language named after a British comedy group. What am I?"
        ],
        "hint_count": 2
    },
    "hangman": {
        "difficulty": "hard",
        "hints": [
            "📚 I'm a word-guessing game played with letters and drawings.",
            "I'm often played during long car rides. What game am I?"
        ],
        "hint_count": 2
    },
    "developer": {
        "difficulty": "hard",
        "hints": [
            "👨‍💻 I create software and apps. What am I?",
            "I write code for a living and solve problems daily. What's my job?"
        ],
        "hint_count": 2
    },
    "computer": {
        "difficulty": "easy",
        "hints": [
            "💻 I'm an electronic machine with a screen and a mouse, used for homework and games!"
        ],
        "hint_count": 1
    },
    "algorithm": {
        "difficulty": "hard",
        "hints": [
            "📐 I'm a step-by-step procedure to solve a problem.",
            "Programmers use me to make code more efficient. What am I?"
        ],
        "hint_count": 2
    },
    "javascript": {
        "difficulty": "hard",
        "hints": [
            "🌐 I make websites interactive and fun in your browser!",
            "I'm the language of web browsers. What am I?"
        ],
        "hint_count": 2
    },
    "database": {
        "difficulty": "hard",
        "hints": [
            "💾 I store organized information that can be quickly retrieved.",
            "I'm like a huge organized filing cabinet for digital information. What am I?"
        ],
        "hint_count": 2
    },
    "programming": {
        "difficulty": "hard",
        "hints": [
            "💻 I'm the art of writing instructions for computers.",
            "Without me, there would be no software or apps. What am I?"
        ],
        "hint_count": 2
    },
    "internet": {
        "difficulty": "easy",
        "hints": [
            "🌍 I connect computers worldwide! What am I?"
        ],
        "hint_count": 1
    },
    "software": {
        "difficulty": "easy",
        "hints": [
            "📱 I'm programs and apps you use on your computer or phone!"
        ],
        "hint_count": 1
    }
}

def create_new_game():
    """Create a completely new game"""
    word = random.choice(list(WORDS_WITH_HINTS.keys())).upper()
    word_data = WORDS_WITH_HINTS[word.lower()]
    
    return {
        'word': word,
        'guessed_letters': [],
        'wrong_guesses': [],
        'hints_used': 0,
        'max_hints': word_data['hint_count'],
        'all_hints': word_data['hints'],
        'difficulty': word_data['difficulty'],
        'game_over': False,
        'won': False,
        'max_wrong': 6
    }

def get_display_word(word, guessed_letters):
    """Get word with blanks"""
    return ' '.join([letter if letter in guessed_letters else '_' for letter in word])

def get_game_state(game_data):
    """Get current state"""
    word = game_data['word']
    guessed = game_data['guessed_letters']
    wrong = game_data['wrong_guesses']
    
    return {
        'display_word': get_display_word(word, guessed),
        'guessed_letters': sorted(guessed),
        'wrong_guesses': sorted(wrong),
        'wrong_count': len(wrong),
        'remaining': game_data['max_wrong'] - len(wrong),
        'game_over': game_data['game_over'],
        'won': game_data['won'],
        'word_length': len(word),
        'hints_used': game_data['hints_used'],
        'hints_remaining': game_data['max_hints'] - game_data['hints_used'],
        'difficulty': game_data['difficulty'],
        'max_hints': game_data['max_hints']
    }

@app.route('/')
def index():
    """Render the main game page"""
    return render_template('game.html')

@app.route('/api/new-game', methods=['POST'])
def new_game():
    """Start a new game"""
    game_data = create_new_game()
    session['game'] = game_data
    session.modified = True
    
    return jsonify({
        'status': 'success',
        'state': get_game_state(game_data)
    }), 200

@app.route('/api/guess', methods=['POST'])
def guess():
    """Process a letter guess"""
    try:
        if 'game' not in session:
            return jsonify({'status': 'error', 'message': 'No active game!'}), 400
        
        data = request.get_json()
        letter = data.get('letter', '').strip().upper()
        
        # Validate
        if not letter or not letter.isalpha() or len(letter) != 1:
            return jsonify({'status': 'error', 'message': 'Invalid input!'}), 400
        
        game = session['game']
        word = game['word']
        
        # Check if already guessed
        if letter in game['guessed_letters'] or letter in game['wrong_guesses']:
            return jsonify({
                'status': 'error',
                'message': f'Letter {letter} already guessed!',
                'state': get_game_state(game)
            }), 400
        
        # Check if game over
        if game['game_over']:
            return jsonify({
                'status': 'error',
                'message': 'Game is over!',
                'state': get_game_state(game)
            }), 400
        
        # Process guess
        message = ""
        if letter in word:
            game['guessed_letters'].append(letter)
            message = f'✅ Correct! {letter} is in the word!'
        else:
            game['wrong_guesses'].append(letter)
            message = f'❌ Wrong! {letter} is not in the word!'
        
        # Check win/loss
        if all(l in game['guessed_letters'] for l in word):
            game['game_over'] = True
            game['won'] = True
            message += f'\n🎉 YOU WON! The word was {word}!'
        elif len(game['wrong_guesses']) >= game['max_wrong']:
            game['game_over'] = True
            game['won'] = False
            message += f'\n💀 GAME OVER! The word was {word}!'
        
        session.modified = True
        
        return jsonify({
            'status': 'success',
            'message': message,
            'state': get_game_state(game)
        }), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error: {str(e)}'}), 500

@app.route('/api/hint', methods=['POST'])
def get_hint():
    """Get a hint"""
    try:
        if 'game' not in session:
            return jsonify({'status': 'error', 'message': 'No active game!'}), 400
        
        game = session['game']
        
        # Check if game over
        if game['game_over']:
            return jsonify({
                'status': 'error',
                'message': 'Game is over!'
            }), 400
        
        # Check hints remaining
        hints_remaining = game['max_hints'] - game['hints_used']
        
        if hints_remaining <= 0:
            return jsonify({
                'status': 'error',
                'message': f'No more hints! You used {game["hints_used"]}/{game["max_hints"]}'
            }), 400
        
        # Get hint
        hint_text = game['all_hints'][game['hints_used']]
        game['hints_used'] += 1
        session.modified = True
        
        return jsonify({
            'status': 'success',
            'message': f'💡 Hint: {hint_text}',
            'hint_text': hint_text,
            'hints_remaining': game['max_hints'] - game['hints_used'],
            'state': get_game_state(game)
        }), 200
    
    except Exception as e:
        return jsonify({
            'status': 'error', 
            'message': f'Error getting hint: {str(e)}'
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Get current game status"""
    if 'game' not in session:
        return jsonify({'status': 'no_game'}), 200
    
    return jsonify({
        'status': 'active',
        'state': get_game_state(session['game'])
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)