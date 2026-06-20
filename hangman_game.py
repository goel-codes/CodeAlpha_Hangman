"""
Hangman Game
A simple text-based Hangman game where players guess letters to find a hidden word.
"""

import random

def hangman():
    """Main Hangman game function."""
    # Predefined word list
    words = ["python", "hangman", "developer", "computer", "algorithm"]
    
    # Select a random word
    word = random.choice(words).upper()
    word_length = len(word)
    guessed_word = ['_'] * word_length
    guessed_letters = set()
    wrong_guesses = set()
    max_wrong = 6
    
    print("=" * 50)
    print("🎮 WELCOME TO HANGMAN 🎮")
    print("=" * 50)
    print(f"\nWord to guess: {' '.join(guessed_word)}")
    print(f"Word length: {word_length} letters")
    print(f"You have {max_wrong} incorrect guesses allowed.\n")
    
    # Game loop
    while len(wrong_guesses) < max_wrong and '_' in guessed_word:
        print(f"\nGuessed letters: {', '.join(sorted(guessed_letters)) if guessed_letters else 'None'}")
        print(f"Wrong guesses remaining: {max_wrong - len(wrong_guesses)}")
        print(f"Current word: {' '.join(guessed_word)}")
        
        # Get player input
        guess = input("\nGuess a letter: ").upper()
        
        # Validate input
        if len(guess) != 1 or not guess.isalpha():
            print("❌ Invalid input! Please enter a single letter.")
            continue
        
        if guess in guessed_letters or guess in wrong_guesses:
            print(f"⚠️  You already guessed '{guess}'!")
            continue
        
        # Check if guess is correct
        if guess in word:
            guessed_letters.add(guess)
            print(f"✅ Correct! '{guess}' is in the word.")
            
            # Update guessed_word display
            for i, letter in enumerate(word):
                if letter == guess:
                    guessed_word[i] = guess
        else:
            wrong_guesses.add(guess)
            print(f"❌ Wrong! '{guess}' is not in the word.")
    
    # Game over - determine win or loss
    print("\n" + "=" * 50)
    if '_' not in guessed_word:
        print("🎉 CONGRATULATIONS! YOU WON! 🎉")
        print(f"The word was: {word}")
    else:
        print("💀 GAME OVER! YOU LOST! 💀")
        print(f"The word was: {word}")
    print("=" * 50)

if __name__ == "__main__":
    hangman()
