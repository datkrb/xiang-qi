# Xiangqi - Chinese Chess Game

A full-stack multiplayer Chinese Chess (Xiangqi) game with real-time gameplay, user authentication, AI opponents, and comprehensive game features.

## 🎯 Project Overview

Xiangqi is a web-based implementation of the traditional Chinese chess game. It features:

- **Real-time Multiplayer**: Play against friends using WebSocket connections
- **Guest Play**: Anonymous play without registration
- **User Authentication**: Secure registration and login with JWT tokens
- **AI Opponent**: Play against intelligent computer opponents
- **User Profiles**: Manage user information and game history
- **ELO Rating System**: Track skill progression through rated matches
- **Leaderboard**: View top players and rankings
- **Game Settings**: Customize theme, language, and game preferences
- **Match Making**: Automatic matchmaking for online play
- **Postman API Collection**: Complete API documentation and testing suite

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Language**: TypeScript
- **Database**: PostgreSQL (with Docker)
- **ORM**: Prisma v6.19.3
- **Real-time Communication**: Socket.io v4.8.3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Development**: tsx (TypeScript executor), tsx watch

### Frontend

- **Framework**: React 18.2.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4.3.0
- **State Management**: React Context (GameProvider, SettingsProvider)
- **Architecture**: Feature-sliced design pattern

### Infrastructure

- **Database Container**: PostgreSQL 15 Alpine
- **Containerization**: Docker Compose

## 📁 Project Structure

```
xiangqi/
├── backend/                    # Express.js backend server
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── index.ts           # Server entry point
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication (register, login, refresh)
│   │   │   ├── users/         # User management
│   │   │   ├── games/         # Game logic
│   │   │   └── dev/           # Development utilities
│   │   ├── socket/            # WebSocket handlers
│   │   │   ├── gameplay.ts    # Game event handlers
│   │   │   ├── gameState.ts   # Game state management
│   │   │   ├── matchmaking.ts # Player matchmaking
│   │   │   ├── room.ts        # Game room management
│   │   │   └── socketHandle.ts # Socket setup
│   │   ├── shared/            # Shared backend utilities
│   │   │   ├── config/        # Configuration
│   │   │   └── middlewares/   # Express middlewares
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── prisma/            # Database schema & migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── specAPI.md             # Detailed API specification
│   └── postman/               # Postman collection and environment
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── app/               # Application layer
│   │   │   ├── App.tsx        # Main app shell
│   │   │   ├── main.tsx       # React entry point
│   │   │   ├── routes.ts      # Route definitions
│   │   │   └── providers/     # Global context providers
│   │   ├── features/          # Feature modules (domain-specific)
│   │   │   ├── auth/          # Authentication screens
│   │   │   ├── friends/       # Friends management
│   │   │   ├── game/          # Game modes
│   │   │   ├── leaderboard/   # Ranking system
│   │   │   ├── play/          # Play hub
│   │   │   ├── profile/       # User profile
│   │   │   └── settings/      # User settings
│   │   ├── shared/            # Shared reusable code
│   │   │   ├── components/    # UI components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── services/      # API & Socket clients
│   │   │   ├── theme/         # Theme configuration
│   │   │   ├── types/         # Global type definitions
│   │   │   └── utils/         # Utility functions
│   │   ├── index.css          # Global styles
│   │   └── vite-env.d.ts      # Vite type definitions
│   ├── public/                # Static assets
│   ├── package.json
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.ts     # Tailwind CSS config
│   ├── tsconfig.json
│   ├── FRONTEND_ARCHITECTURE.md # Detailed frontend guide
│   └── task.md                # Frontend tasks
│
├── openspec/                  # OpenAPI specifications
├── docker-compose.yml         # Docker database setup
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (recommended: v20+)
- **npm**: v8+ or **yarn**
- **Docker & Docker Compose**: For PostgreSQL database
- **Git**: For version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/datkrb/xiang-qi
   cd xiangqi
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Database Setup

1. **Start PostgreSQL with Docker:**

   ```bash
   docker-compose up -d
   ```

   This starts a PostgreSQL 15 container on port 5432 with:
   - User: `myuser`
   - Password: `mypassword`
   - Database: `xiangqidb`

2. **Run Prisma migrations:**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. **Seed the database (optional):**
   ```bash
   npx prisma db seed
   ```

### Environment Variables

**Backend** - Create `.env` in the `backend/` directory:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/xiangqidb"
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=8080
NODE_ENV=development
```

**Frontend** - Create `.env` in the `frontend/` directory (optional):

```env
VITE_API_URL=http://localhost:8080
VITE_SOCKET_URL=ws://localhost:8080
```

### Running the Project

**Start the backend server:**

```bash
cd backend
npm run dev
```

Server runs at: `http://localhost:8080`

**In a new terminal, start the frontend development server:**

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173` (or the URL shown in your terminal)

## 📚 API Documentation

Full API documentation is available in:

- **Backend**: [specAPI.md](backend/specAPI.md)
- **Postman Collection**: [backend/postman/Xiangqi.postman_collection.json](backend/postman/Xiangqi.postman_collection.json)

### Key API Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive tokens
- `POST /auth/refresh` - Refresh access token

#### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/leaderboard` - Get leaderboard rankings

#### Game

- WebSocket events for real-time gameplay
- Game state synchronization
- Move validation and execution

## 🎮 Features

### Authentication & User Management

- Email/password registration and login
- JWT-based authentication with access and refresh tokens
- Guest mode for anonymous play
- User profile management

### Gameplay

- Real-time multiplayer with WebSocket
- Move validation based on Xiangqi rules
- Game state synchronization
- Game history tracking
- Offline mode (local play)
- Tutorial mode for new players

### Ranking & Progression

- ELO rating system for competitive matches
- Global leaderboard
- Player statistics tracking
- Match history

### Customization

- Theme switching (light/dark mode)
- Language/internationalization (i18n)
- Notification settings
- Game preferences

## 🔨 Development

### Build Commands

**Backend:**

```bash
npm run build    # Compile TypeScript to JavaScript
npm run dev      # Run with hot reload (tsx watch)
npm start        # Run compiled code
npm test         # Run tests
```

**Frontend:**

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio for data exploration
npx prisma studio
```

### Code Structure

**Frontend Architecture:**
The frontend follows a **Feature-sliced design pattern** with three layers:

1. **App Layer** (`src/app/`) - Application orchestration, routing, global providers
2. **Features Layer** (`src/features/`) - Domain-specific business logic and screens
3. **Shared Layer** (`src/shared/`) - Reusable components, utilities, and services

See [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md) for detailed guidelines.

**Backend Architecture:**

- **Modular structure** with separation by feature (auth, users, games)
- **Socket.io integration** for real-time gameplay
- **Prisma ORM** for database operations
- **Middleware-based** request processing

## 🔐 Security

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Stateless, token-based authentication with refresh token rotation
- **CORS**: Configured to prevent unauthorized cross-origin requests
- **Guest Authentication**: Unique guest tokens for anonymous users
- **Role-based Access**: USER and GUEST roles with appropriate permissions

## 📦 Production Build

**Backend:**

```bash
npm run build
npm start
```

**Frontend:**

```bash
npm run build
```

The frontend production build outputs to the `dist/` directory, which can be served by a static file server or integrated with the backend.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📝 License

ISC

## 🔗 Resources

- **Xiangqi Rules**: [Traditional Chinese Chess Rules](https://en.wikipedia.org/wiki/Xiangqi)
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Prisma**: https://www.prisma.io
- **Socket.io**: https://socket.io
- **Tailwind CSS**: https://tailwindcss.com

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository or contact the development team.

---

**Happy playing! ♞**
