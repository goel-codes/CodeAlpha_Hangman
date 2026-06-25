# 🎮 Hangman Game - Web Version

**CodeAlpha Python Internship Project** | Built with Flask + HTML/CSS/JavaScript

---

## 📌 Project Overview

A modern, interactive **Hangman Game** web application with:
- 🎯 Smart riddle-based hint system
- 🎨 Beautiful responsive UI with animations
- 🏆 Win/Loss celebration pages
- 📱 Mobile-friendly design
- ⚡ Real-time game feedback

---

## ✨ Features

### 🎮 Game Features
- **10 Word Categories**: Easy & Hard difficulty levels
- **Smart Hints**: Riddle-based clues (1-2 hints per word)
- **Visual Hangman**: SVG drawing updates with each wrong guess
- **Real-time Feedback**: Instant response to every guess
- **Game Statistics**: Track wrong guesses, hints used, difficulty

### 🎭 UI/UX Features
- **Rules Modal**: Explain game before playing
- **Win Celebration Page**: 🎉 Confetti animations + trophy
- **Loss Game Over Page**: 💀 Sad emoji + encouragement
- **Responsive Design**: Works on desktop, tablet, mobile
- **Smooth Animations**: CSS transitions for professional feel

---

## 🚀 Installation & Setup

### Prerequisites
```bash
Python 3.6+
pip package manager
```

### Step 1: Clone Repository
```bash
git clone https://github.com/goel-codes/CodeAlpha_Hangman.git
cd CodeAlpha_Hangman
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run Server
```bash
python hangman_flask.py
```

**Output:**
```
 * Running on http://127.0.0.1:5001
 * Debug mode: on
```

### Step 4: Open in Browser
```
http://localhost:5001
```

---

## 🎯 How to Play

1. **Start Game**: Click "🎮 Start Game" button
2. **Guess Letters**: Click letter buttons one at a time
3. **Correct Guess**: ✅ Letter reveals in the word
4. **Wrong Guess**: ❌ Hangman drawing updates
5. **Get Hints**: 💡 Click "Get a Clue" for riddle-based hints
6. **Win**: 🎉 Guess all letters → Celebration page with stats
7. **Lose**: 💀 6 wrong guesses → Game Over page with word reveal

---

## 📁 Project Structure

```
CodeAlpha_Hangman/
│
├── 📄 hangman_flask.py          # Main Flask server (Backend)
├── 📄 hangman_game.py           # Console version (Reference)
├── 📄 requirements.txt          # Python dependencies
├── 📄 README.md                 # This file
├── 📄 CONCEPTS_USED.md          # Educational concepts
│
├── 📁 templates/
│   └── 📄 game.html             # Main game UI (Frontend)
│
├── 📁 static/
│   ├── 📄 hangman.css           # Styling & animations
│   └── 📄 hangman.js            # Game logic & interactions
│
└── 📄 .gitignore                # Git exclusions
```

---

## 💻 Technologies Used

### Backend
- **Flask 3.0.0**: Lightweight Python web framework
- **Jinja2**: Template rendering
- **JSON**: API response format

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Gradients, flexbox, animations
- **JavaScript (Vanilla)**: DOM manipulation, fetch API
- **SVG**: Scalable hangman drawing

### Game Logic
- **Python**: Game state management
- **Flask Sessions**: Persistent game state
- **RESTful API**: Clean endpoint design

---

## 🔌 API Endpoints

### `POST /api/new-game`
**Start a new game**
- **Response**: New game state with empty board
- **Example**:
```json
{
  "status": "success",
  "state": {
    "display_word": "_ _ _ _ _ _",
    "word_length": 6,
    "remaining": 6,
    "difficulty": "hard",
    "max_hints": 2
  }
}
```

### `POST /api/guess`
**Make a letter guess**
- **Request**: `{"letter": "E"}`
- **Response**: Updated game state + feedback message
- **Example**:
```json
{
  "status": "success",
  "message": "✅ Correct! E is in the word!",
  "state": { ... }
}
```

### `POST /api/hint`
**Get a hint**
- **Request**: (none)
- **Response**: Riddle-based clue + remaining hints
- **Example**:
```json
{
  "status": "success",
  "message": "💡 Hint: I'm a snake that slithers through code!",
  "hints_remaining": 1
}
```

### `GET /api/status`
**Get current game status**
- **Response**: Current game state
- **Example**:
```json
{
  "status": "active",
  "state": { ... }
}
```

---

## 🎯 Game Words & Hints

### Hard Words (2 hints each)
- **python**: Snake in code / British comedy group
- **hangman**: Word-guessing game / Long car rides
- **developer**: Create software / Code for living
- **algorithm**: Step-by-step procedure / Make code efficient
- **javascript**: Interactive websites / Language of browsers
- **database**: Store organized information / Digital filing cabinet
- **programming**: Write instructions for computers / No software without it

### Easy Words (1 hint each)
- **computer**: Electronic machine with screen
- **internet**: Connect computers worldwide
- **software**: Programs and apps you use

---

## 🛠️ Technical Implementation

### Session Management
```python
session['game'] = {
    'word': 'PYTHON',
    'guessed_letters': ['P', 'Y'],
    'wrong_guesses': ['A', 'E'],
    'hints_used': 1,
    'max_hints': 2,
    'game_over': False,
    'won': False
}
```

### Game State Flow
```
1. New Game → Initialize empty board
2. Player Guess → Validate → Update state
3. Check Win/Loss → Continue or End
4. Get Hint → Serve riddle → Track usage
5. Game Over → Show celebration/loss page
```

### Win Condition
- All letters in word are guessed ✅
- Display celebration page 🎉
- Show statistics & trophy 🏆

### Loss Condition
- 6 wrong guesses reached ❌
- Display game over page 💀
- Reveal the word 📝

---

## 🎨 UI Components

### Modals
1. **Rules Modal** (Shows on load)
   - Game instructions
   - Hint explanation
   - "Start Game" button

2. **Celebration Modal** (Shows on win)
   - Trophy emoji 🏆
   - Word reveal
   - Statistics (wrong guesses, hints used)
   - Difficulty level
   - Motivational message
   - "New Game" button

3. **Game Over Modal** (Shows on loss)
   - Sad emoji 😢
   - Word reveal
   - Statistics
   - Encouragement message
   - "Try Again" button

### Interactive Elements
- **Keyboard Buttons**: 26 letter buttons with state tracking
- **Hint Button**: Shows remaining hints, disabled when out
- **Hangman SVG**: Animated drawing (6 parts)
- **Word Display**: Reveals letters progressively
- **Guessed Letters**: Shows all guesses made so far

---

## 🔧 Troubleshooting

### Issue: Game doesn't start
**Solution**: Refresh browser (Ctrl+Shift+R) to clear cache

### Issue: Hints throwing errors
**Solution**: Ensure Flask server is running with fresh code

### Issue: Celebration page doesn't show
**Solution**: Open browser console (F12) to check for JavaScript errors

### Issue: Game closes unexpectedly
**Solution**: Check that `session.modified = True` is set after state changes

---

## 📊 Project Statistics

- **Lines of Code**: ~500 (Flask) + ~400 (Frontend)
- **Words Database**: 10 words with hints
- **API Endpoints**: 4 RESTful endpoints
- **CSS Animations**: 5+ animations
- **Mobile Responsive**: Yes ✅

---

## 🎓 Key Concepts (Educational)

### Backend (Python/Flask)
- **Session Management**: Store game state between requests
- **RESTful API Design**: Clean endpoint structure
- **JSON Response Format**: Structured data exchange
- **Error Handling**: Try-catch and validation
- **State Persistence**: Session dictionary management

### Frontend (JavaScript)
- **Fetch API**: Async HTTP requests to backend
- **DOM Manipulation**: Update UI in real-time
- **Event Listeners**: Handle user interactions
- **Promise Chains**: Handle async operations
- **CSS Classes**: Dynamic styling based on state

### Game Logic
- **State Machine**: Track game conditions
- **Win/Loss Detection**: Multi-condition checking
- **Letter Tracking**: Sets for efficient lookup
- **Hint System**: Sequential hint delivery
- **Random Selection**: Random word picking

---

## 🚀 Future Enhancements

- [ ] Difficulty selector before game
- [ ] Leaderboard with scores
- [ ] Timer for timed challenges
- [ ] Sound effects & background music
- [ ] Multiplayer mode
- [ ] Keyboard input support
- [ ] Dark mode theme
- [ ] Animation customization

---

## 📜 License

This project is part of CodeAlpha Internship Program.

---

## 👤 Author

**Vidushi Goel** | B.Tech ECE | Banasthali Vidyapith

- **GitHub**: https://github.com/goel-codes
- **LinkedIn**: https://www.linkedin.com/in/vidushi-goel-95894a330/
- **Email**: vidushigoel1616@gmail.com

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | June 2026 | Initial web version with hints & celebration pages |
| 0.5 | June 2026 | Console version (hangman_game.py) |

---

## ✅ Checklist for Submission

- [x] Working Flask server
- [x] Beautiful responsive UI
- [x] Smart hint system
- [x] Win/Loss celebration pages
- [x] Mobile-friendly design
- [x] Professional README
- [x] GitHub repository
- [x] Demo video ready
- [ ] LinkedIn post
- [ ] CodeAlpha submission form

---

**Made with ❤️ for CodeAlpha Internship**