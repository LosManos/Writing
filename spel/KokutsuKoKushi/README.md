# Kokutsu - Text-Based Game Creator & Engine

Kokutsu is a portable, logic-driven game engine and creator designed to make building and sharing "Point & Click" text adventures as easy as sending a message.

## What is it for?

Kokutsu allows anyone to create their own interactive stories and games directly in their browser—no coding required. It is specifically designed to be:

*   **Portable**: The entire game is contained in a single JSON text string. 
*   **Shareable**: Created games can be exported and sent via email or any messenger. The recipient simply imports the string to play.
*   **Mobile-First**: The UI is optimized for phones, using buttons instead of typed commands, making it accessible to a younger generation of "phone-first" creators.
*   **Hostable Anywhere**: As it generates only static HTML, CSS, and JS, it can be hosted for free on platforms without need for backend.

## Key Features

*   **Integrated Edit Mode**: Flip a switch to turn the player into a creator. Edit room descriptions, add exits, and build logic on the fly.
*   **Logic Machine**: A data-driven condition system (e.g., "Do you have the key?") that enables complex puzzles without traditional programming.
*   **Asset Support**: Link images and trigger sound effects to bring the text adventures to life.
*   **Native Sharing**: Built-in integration with the Web Share API for seamless distribution on mobile devices.

## How to Use

### 1. Playing a Game
Simply navigate to the hosted URL. Import a game. Enjoy.

### 2. Creating a Game
Switch to **Edit Mode** any time.
*   Edit room names and descriptions.
*   Add new Exits or Actions.
*   Configure logic (targets, requirements, effects).

### 3. Sharing Your Creation
Once your game is ready, click the **Share** button. This will copy the game configuration to your clipboard or open your phone's native share sheet, allowing you to send the "game source" instantly.

## Technical Stack

*   **Vite** + **TypeScript**: For a robust and fast development environment.
*   **Vanilla CSS**: Custom glassmorphic implementation for a premium feel.
*   **Static Distribution**: Zero backend required.

### 4. License
License LGPLv3 + NoEvil.  
https://raw.githubusercontent.com/LosManos/Ushi-Suki-KoSumoso/main/license.md
