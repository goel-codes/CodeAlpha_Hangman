# Concepts Used in Hangman Game

This document explains the core Python concepts used in the CodeAlpha Hangman Game project.

## 1. `random` Module

### What It Is
The `random` module provides functions to generate random numbers and make random selections.

### How It Is Used in This Project
```python
import random

words = ["python", "hangman", "developer", "computer", "algorithm"]
word = random.choice(words)
```

- `random.choice()` randomly selects one word from the list
- This makes the game unpredictable and different each time

### Why It Matters
Without randomization, the game would always use the same word. The `random` module adds variability and replayability.

### Example Code
```python
# Pick a random word from the list
word = random.choice(words).upper()
# Each game gets a different word
```

---

## 2. `while` Loops

### What They Are
`while` loops repeat code as long as a condition is true. They are used for repeated actions that continue until a stopping condition is met.

### How They Are Used in This Project
```python
# Outer loop: game continues while guesses remain and word isn't complete
while len(wrong_guesses) < max_wrong and '_' in guessed_word:
    # Game logic here
    
    # Inner logic: get valid input
    while True:
        guess = input("\nGuess a letter: ").upper()
        if valid_input:
            break
```

### Purpose
- **Outer loop:** Keeps the game running until win/loss
- **Inner validation:** Ensures player enters valid input before proceeding

### Why It Matters
Loops allow continuous interaction without writing the same code multiple times.

### Example Code
```python
while len(wrong_guesses) < max_wrong and '_' in guessed_word:
    print(f"Current word: {' '.join(guessed_word)}")
    guess = input("\nGuess a letter: ").upper()
    
    # Check and update game state
```

---

## 3. `if-else` Conditionals

### What They Are
Conditionals check conditions and execute different code based on whether the condition is true or false.

### How They Are Used in This Project
```python
# Check if input is valid
if len(guess) != 1 or not guess.isalpha():
    print("❌ Invalid input!")
    continue

# Check if guess was already made
if guess in guessed_letters or guess in wrong_guesses:
    print("⚠️  Already guessed!")
    continue

# Check if guess is correct
if guess in word:
    print("✅ Correct!")
    guessed_letters.add(guess)
else:
    print("❌ Wrong!")
    wrong_guesses.add(guess)
```

### Purpose
- Validates user input
- Prevents duplicate guesses
- Determines if guess is correct
- Provides appropriate feedback

### Why It Matters
Without conditionals, the game can't make decisions or respond to player actions.

### Example Code
```python
if guess in word:
    guessed_letters.add(guess)
    print(f"✅ Correct! '{guess}' is in the word.")
else:
    wrong_guesses.add(guess)
    print(f"❌ Wrong! '{guess}' is not in the word.")
```

---

## 4. String Methods

### What They Are
String methods are built-in functions that work with text. They help manipulate and analyze strings.

### Methods Used in This Project
```python
# .upper() - converts to uppercase
guess = input("Guess a letter: ").upper()

# .isalpha() - checks if string contains only letters
if not guess.isalpha():
    print("Invalid!")

# String comparison - checks if character is in string
if guess in word:
    print("Correct!")

# .join() - combines list elements into a string
print(' '.join(guessed_word))  # Displays: _ _ P _ _ _
```

### Purpose
- `.upper()` makes comparison case-insensitive
- `.isalpha()` validates that input is a letter
- Comparison checks if letter is in the word
- `.join()` formats output nicely

### Why It Matters
String methods make text processing efficient and readable.

### Example Code
```python
guess = input("\nGuess a letter: ").upper()

if len(guess) != 1 or not guess.isalpha():
    print("❌ Invalid input! Please enter a single letter.")
    continue

if guess in word:
    print(f"✅ Correct! '{guess}' is in the word.")
```

---

## 5. Lists

### What They Are
Lists are ordered collections of items. Items are accessed by index (position).

### How They Are Used in This Project
```python
# Store word letters
words = ["python", "hangman", "developer", "computer", "algorithm"]

# Track guessed word state
guessed_word = ['_'] * word_length  # Creates ['_', '_', '_', '_', '_', '_']

# Update when letter is guessed
for i, letter in enumerate(word):
    if letter == guess:
        guessed_word[i] = guess  # Replace blank with actual letter
```

### Purpose
- Store available words
- Track which letters have been revealed
- Maintain word state throughout game

### Why It Matters
Lists allow us to work with multiple values efficiently.

### Example Code
```python
guessed_word = ['_'] * 6  # Creates: ['_', '_', '_', '_', '_', '_']

# Update list when correct guess
for i, letter in enumerate(word):
    if letter == guess:
        guessed_word[i] = guess
```

---

## 6. Sets

### What They Are
Sets are unordered collections of unique items. Perfect for tracking items without duplicates.

### How They Are Used in This Project
```python
guessed_letters = set()  # Tracks correct guesses
wrong_guesses = set()    # Tracks incorrect guesses

# Add to set
guessed_letters.add(guess)  # Automatically prevents duplicates

# Check membership
if guess in guessed_letters:
    print("Already guessed!")
```

### Purpose
- Prevent duplicate guesses
- Efficiently check if a letter was already guessed
- Track game statistics

### Why It Matters
Sets automatically handle uniqueness, preventing the same letter from being guessed twice.

### Example Code
```python
guessed_letters = set()
wrong_guesses = set()

if guess in guessed_letters or guess in wrong_guesses:
    print(f"⚠️  You already guessed '{guess}'!")
    continue

guessed_letters.add(guess)
print(f"Guessed letters: {', '.join(sorted(guessed_letters))}")
```

---

## 7. Input/Output Operations

### What They Are
Input gets data from the user. Output displays data to the user.

### How They Are Used in This Project
```python
# Input
guess = input("\nGuess a letter: ").upper()

# Output
print(f"Current word: {' '.join(guessed_word)}")
print("✅ Correct! 'e' is in the word.")
print(f"Wrong guesses remaining: {max_wrong - len(wrong_guesses)}")
```

### Purpose
- Get player input
- Display game status
- Provide feedback
- Show results

### Why It Matters
Without I/O, there would be no interaction between game and player.

### Example Code
```python
print("=" * 60)
print("🎮 WELCOME TO HANGMAN 🎮")
print("=" * 60)

guess = input("\nGuess a letter: ").upper()
print(f"Current word: {' '.join(guessed_word)}")
```

---

## Summary

The Hangman Game demonstrates these key Python concepts:

1. **`random`** - Making unpredictable game outcomes
2. **`while` loops** - Continuous game flow until win/loss
3. **`if-else`** - Decision-making based on conditions
4. **String methods** - Text validation and formatting
5. **Lists** - Storing and updating word state
6. **Sets** - Preventing duplicate guesses
7. **Input/Output** - Player interaction

These concepts work together to create a complete, functional game that demonstrates fundamental Python programming skills required for the CodeAlpha internship.
