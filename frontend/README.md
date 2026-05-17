# Xiangqi - Chinese Chess Game

A modern implementation of Xiangqi (Chinese Chess) built with Vite, React, TypeScript, and Tailwind CSS.

## Project Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build the library:

```bash
npm run build
```

### Project Structure

```
src/
├── main.tsx          # React entry point
├── App.tsx           # Root component
├── App.css           # App styles
├── index.css         # Global styles (Tailwind)
├── index.ts          # Library exports
├── types.ts          # TypeScript type definitions
├── logic.ts          # Game engine logic
└── components/       # React components
```

## Features

- Full Xiangqi rules implementation
- AI opponent with adjustable difficulty
- Move history and undo functionality
- Responsive design with Tailwind CSS
- Exportable as npm module

## Technology Stack

- **Vite** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **PostCSS** - CSS processing
