# Frontend Architecture Guide

This document describes the architectural structure of the Xiangqi frontend application. The project strictly follows a **Layered/Feature-sliced Architecture** to separate concerns, improve maintainability, and ensure scalable growth.

## Core Principles

1. **Separation of Concerns**: Global logic, feature-specific logic, and highly reusable components are strictly separated.
2. **Domain-Driven**: Code related to a specific domain (e.g., authentication, game play, settings) is grouped together under `features/`.
3. **Strict Boundaries**: 
   - Files in `shared/` cannot import from `features/` or `app/`.
   - Files in `features/` can import from `shared/` but should avoid cross-importing from other `features/` (except through strictly defined public APIs or contexts).
   - Files in `app/` can import from both `features/` and `shared/`.

## Directory Structure

```text
src/
├── app/                  # Application layer: Root entry, routing, and global providers
│   ├── App.tsx           # Main application shell and router
│   ├── main.tsx          # React DOM entry point
│   ├── routes.ts         # Centralized route definitions
│   └── providers/        # Global React Context providers (GameProvider, SettingsProvider)
│
├── features/             # Feature layer: Domain-specific screens and logic
│   ├── auth/             # Authentication (Login, Register, Forgot Password)
│   ├── friends/          # Friends list and social interactions
│   ├── game/             # Game modes (Main Game, AI, Online, Offline, Tutorial)
│   ├── leaderboard/      # Ranking and leaderboards
│   ├── play/             # Play hub (Home, Load Game)
│   ├── profile/          # User profile management
│   └── settings/         # User settings and theme switching
│
└── shared/               # Shared layer: Highly reusable, cross-cutting concerns
    ├── components/       # Dumb/Presentational UI components
    │   ├── common/       # Showcases and extremely generic layouts
    │   ├── game/         # Game-specific reusable UI (XiangqiBoard, Pieces, Dialogs)
    │   ├── layouts/      # Layout shells (AppSidebar)
    │   └── ui/           # Primitive UI components (Button, Input, Card, Toggle)
    ├── hooks/            # Global custom hooks (useSettings, useSocket, useAudio)
    ├── services/         # External integrations (API client, Socket.io client)
    ├── theme/            # Theming configuration and ThemeProvider
    ├── types/            # Global TypeScript definitions (game types, settings types)
    └── utils/            # Pure utility functions (GuestStorage, settingsValidation, logic)
```

## Layer Descriptions

### 1. The `app` Layer
The `app/` directory is the uppermost layer. It is responsible for orchestrating the entire application. It contains the application entry point (`main.tsx`), root routing logic (`App.tsx`), and global Context Providers (`GameProvider`, `SettingsProvider`). This layer stitches together different features and applies global styles.

### 2. The `features` Layer
The `features/` directory contains all business logic and UI components tied to specific application domains. Each feature is self-contained. For example, the `auth` feature contains screens for logging in and registering. Feature directories typically contain a `screens/` subdirectory with an `index.ts` barrel file that exports the public screens for the `app` router to consume.

### 3. The `shared` Layer
The `shared/` directory is the foundational layer of the app. It contains code that is domain-agnostic or heavily shared across multiple features.
- **`shared/components/ui/`**: Primitive building blocks like buttons and inputs.
- **`shared/components/game/`**: Contains the complex Xiangqi engine UI (`XiangqiBoard`, `PieceView`, move history). These are reused across different game modes (Online, AI, Offline) which live in `features/game/`.
- **`shared/services/` & `shared/hooks/`**: Reusable data-fetching, socket management, and system-level logic.

## Import Aliases

To avoid "relative path hell" (e.g., `../../../shared/components`), the project is configured with Vite and TypeScript path aliases. Always use these aliases when importing across layers:

- `@app/*` -> `src/app/*`
- `@features/*` -> `src/features/*`
- `@shared/*` -> `src/shared/*`

**Example:**
```tsx
// Incorrect
import { Button } from "../../../shared/components/ui";

// Correct
import { Button } from "@shared/components/ui";
```
