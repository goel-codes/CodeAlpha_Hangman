# 🎮 Hangman Game

## Project Goal
Create a simple text-based Hangman game where players guess letters one at a time to find a hidden word.

## Description
This is a classic Hangman game implementation in Python. Players have 6 incorrect guesses to figure out the word. The game uses a list of 5 predefined words and provides real-time feedback on guesses.

## Features
- 5 predefined words (no external APIs needed)
- 6 incorrect guesses allowed
- Real-time feedback on each guess
- Shows current word progress
- Tracks guessed letters
- Play again option
- Console-based interface with emoji feedback

## Installation

1. Clone the repository:
```bash
git clone https://github.com/goel-codes/CodeAlpha_Hangman.git
```

2. Navigate to the project folder:
```bash
cd CodeAlpha_Hangman
```

3. Ensure Python 3.6+ is installed:
```bash
python --version
```

## How to Run

```bash
python hangman_game.py
```

## How to Play

1. The game picks a random word and displays blanks for each letter
2. You have 6 incorrect guesses allowed
3. Guess one letter at a time
4. If the letter is in the word, it's revealed in all positions
5. If the letter is not in the word, you lose one guess
6. Win by guessing all letters before running out of guesses
7. Play again or exit after each game

## Sample Gameplay

```
============================================================
🎮 WELCOME TO HANGMAN 🎮
============================================================

Word to guess: _ _ _ _ _ _
Word length: 6 letters
You have 6 incorrect guesses allowed.

Guessed letters: None
Wrong guesses remaining: 6
Current word: _ _ _ _ _ _

Guess a letter: e
✅ Correct! 'e' is in the word.

Guessed letters: E
Wrong guesses remaining: 6
Current word: _ _ _ _ _ E

Guess a letter: a
❌ Wrong! 'a' is not in the word.

...

🎉 CONGRATULATIONS! YOU WON! 🎉
The word was: PYTHON
```

## Key Concepts Used

### 1. `random` Module
- `random.choice()` selects a random word from the list
- Used to make the game unpredictable

### 2. `while` Loops
- Outer loop: continues game while player has guesses left and word isn't complete
- Inner loop: continuously takes player input until valid guess
- Implements game logic flow

### 3. `if-else` Conditionals
- Checks if guess is correct or incorrect
- Validates user input (single letter, not already guessed)
- Determines win/loss conditions
- Provides appropriate feedback

### 4. String Methods
- `.upper()` converts input to uppercase for consistency
- `.strip()` removes whitespace
- `.isalpha()` checks if input is alphabetic
- String comparison for word matching

### 5. Lists and Sets
- Lists: store word letters, track guessed word state
- Sets: efficiently track guessed letters and wrong guesses
- Used for fast lookup and duplicate prevention

### 6. Input/Output Operations
- `input()` gets player guesses
- `print()` displays game status and feedback
- Formatted output with emoji for better UX

## Project Structure

```
CodeAlpha_Hangman/
├── hangman_game.py          (Main game code)
├── README.md                (This file)
├── requirements.txt         (Dependencies)
├── .gitignore              (Git exclusions)
└── CONCEPTS_USED.md        (Educational guide)
```

## Requirements
- Python 3.6 or higher
- No external dependencies required

## Author
CodeAlpha Intern - Vidushi Goel

## Contact
- LinkedIn: https://www.linkedin.com/in/vidushi-goel/
- GitHub: https://github.com/goel-codes

## Submission Notes
- Repository name: `CodeAlpha_Hangman`
- Uses basic Python concepts: random, while loops, if-else, strings, lists, sets
- Console-based interface with no graphics or audio
- Perfect for CodeAlpha internship requirements

## Future Enhancements
- Add difficulty levels (easy/medium/hard word lists)
- Add word categories (animals, countries, movies)
- Add hangman ASCII art visualization
- Add scoring system
- Add timer for timed challenges
