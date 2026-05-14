# Xiangqi (Chinese Chess) – Web Game

A modern web-based implementation of **Xiangqi (Chinese Chess)** built with React and TypeScript. Features responsive UI, move logging, captured pieces display, adaptive AI opponent, and game result overlays.

---

## 🎯 Features

- **Interactive Board** – Click-to-select and move pieces with visual feedback.
- **Adaptive AI** – Adjustable skill levels (1-6) for AI opponent.
- **Move Log** – Displays recent moves with newest at the top.
- **Captured Pieces Display** – Tracks captured pieces for both sides.
- **Game End Detection** – Checkmate, stalemate, and draw detection.
- **Undo & Reset** – Undo your last move or restart the game.
- **Responsive Design** – Works on desktop and mobile devices.
- **Material-UI Components** – Modern, polished UI with animations.

---

## 📂 Project Structure

````
src/
  ├── components/          # React components
  │   ├── Board.tsx       # Game board component
  │   ├── CapturedTray.tsx # Captured pieces display
  │   ├── Controls.tsx    # Game controls and AI settings
  │   ├── MoveLog.tsx     # Move history display
  │   └── constants.ts    # Chinese character mappings
  ├── App.tsx             # Main game component
  ├── main.tsx            # React entry point
  ├── logic.ts            # Game rules, legal moves, AI engine (TypeScript)
### Prerequisites
- Node.js 16+ and npm

### 1. Install Dependencies
```bash
npm install
````

### 2. Run Development Server

```bash
npm run dev
```

Then visit http://localhost:5173 (or the URL shown in terminal)

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

---

## 🛠️ Tech Stack

- **React 18** – UI framework
- **TypeScript** – Type-safe development
- **Vite** – Fast build tool and dev server
- **Material-UI (MUI)** – Component library
- **Emotion** – CSS-in-JS styling

### 2. Run Locally

Even though the project doesn’t need a backend, you still need to serve it over http:// (or https://) for it to work properly.

```
cd /path/to/gameDirectory
python3 -m http.server 8000
```

Then visit http://localhost:8000

### 3. or Just Access the Game Online

https://ryoi.github.io/xiangqi/

---

## 🎮 How to Play

### Objective

Checkmate your opponent’s **General (King)** by placing it in a position where it cannot escape capture.

### Board Layout

- **9 columns × 10 rows**
- **River** divides the board horizontally in the middle.
- **Palaces** (3×3 areas) restrict the Generals and Advisors.

### Pieces & MovementAI adjusts based on game outcomes

- Uses alpha-beta pruning and strategic move evaluationly without intervening pieces |
  | **Advisor (Guard)** | 仕 / 士 | 1 step diagonally within palace | Must stay in palace |
  | **Elephant (Bishop)** | 相 / 象 | 2 steps diagonally | Cannot cross the river; blocked if midpoint occupied |
  | **Horse (Knight)** | 馬 / 馬 | L-shape (2+1 steps) | Blocked if first orthogonal step is occupied |
  | **Chariot (Rook)** | 車 / 車 | Any distance orthogonally | Cannot jump over pieces |
  | **Cannon** | 炮 / 砲 | Moves like Rook; to capture, must jump over exactly one piece |
  | **Soldier (Pawn)** | 兵 / 卒 | 1 step forward; after crossing river can also move sideways | No backward moves |

---

## 🧠 AI Difficulty

- **Skill Levels**: 1 (easiest) – 6 (hardest)
- **Adaptive Mode**:
  - If you win, AI becomes stronger.
  - If AI wins, difficulty decreases slightly.
- Uses **alpha-beta pruning**, **transposition tables**, **killer moves**, and **history heuristics**.

---

## 📜 Game Rules Implemented

- Legal move generation for all pieces
- Check & checkmate detection
- Stalemate detection
- Threefold repetition draw rule
- Opening move book
  Flying General rule (Generals cannot face each other directly)

## ⚖ License

This project is licensed under the MIT License.

---

## 🙌 Credits

- UI inspired by **Chess.com** design elements.
- Fonts: [Noto Sans TC](https://fonts.google.com/) & [Zhi Mang Xing](https://fonts.google.com/).
  Built with React + TypeScript + Vite
- Fonts: [Noto Sans TC](https://fonts.google.com/) & [Zhi Mang Xing](https://fonts.google.com/)
