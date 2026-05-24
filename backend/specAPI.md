# Xiangqi Backend API Specification

**Server:** http://localhost:8080  
**WebSocket:** ws://localhost:8080  
**Database:** PostgreSQL  
**ORM:** Prisma

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Users API](#users-api)
3. [Profile API](#profile-api)
4. [Socket Events](#socket-events)
5. [Data Models](#data-models)
6. [Response Format](#response-format)

---

## Authentication API

### 1. Register User

- **Endpoint:** `POST /auth/register`
- **Authentication:** Not required
- **Description:** Create a new user account
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "code": 201,
    "message": "User registered successfully",
    "data": {
      "id": "uuid-string",
      "email": "user@example.com",
      "role": "USER"
    }
  }
  ```
- **Error (400 Bad Request):**
  ```json
  {
    "message": "User already exists"
  }
  ```

---

### 2. Login

- **Endpoint:** `POST /auth/login`
- **Authentication:** Not required
- **Description:** Authenticate user and receive tokens
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "role": "USER"
      },
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
  ```
- **Notes:**
  - Access token should be sent in Authorization header: `Bearer <accessToken>`
  - Refresh token is stored in the database for session management

---

### Guest Role

- **Purpose:** Lightweight anonymous play without full registration.
- **Client-side:** Frontend generates and persists a `guestToken` in `localStorage` (key example: `guestToken`). Guest clients also keep any local-only state (temporary ELO, lastMatchId) in browser localStorage.
- **Handshake:** Guests must pass `role: 'GUEST'` and `guestToken` through the socket handshake: `io(url, { auth: { role: 'GUEST', guestToken } })`.
- **Matching rules:** Guests are matched only with other guests. Guest matches are not automatically persisted to the account DB unless the guest upgrades later.
- **Server-side fields:** `User` model supports `guestToken` (optional, unique) and `guestExpiresAt` (optional). `email` may be nullable for guest-created rows.

---

## Users API

### Prerequisites

All user endpoints require appropriate authorization (Admin for some operations). See each endpoint for details.

---

## Profile API

### Public Profile

- **Endpoint:** `GET /users/:id/profile`
- **Authentication:** Not required
- **Description:** Fetch a user's public profile by user id
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "profile-uuid",
      "userId": "user-uuid",
      "username": "user_12345678",
      "elo": 1200,
      "avatar": null
    }
  }
  ```

### My Profile

- **Endpoint:** `GET /me/profile`
- **Authentication:** Required
- **Description:** Fetch the authenticated user's profile

- **Endpoint:** `PATCH /me/profile`
- **Authentication:** Required
- **Description:** Update the authenticated user's profile
- **Request Body:**
  ```json
  {
    "username": "new_username",
    "avatar": "https://example.com/avatar.png"
  }
  ```

---

## Socket Events

Clients must include auth info in the socket handshake. Example:

```js
const socket = io("http://localhost:8080", {
  auth: {
    role: "GUEST" /* or 'USER' */,
    guestToken: "<guest-token>" /* for guests */,
    accessToken: "<jwt>" /* for users */,
  },
});
```

### Connection Lifecycle

- `connection` (internal): server reads handshake auth and attempts reconnection logic if `guestToken` or valid `accessToken` present.
- `disconnect`: server removes client from matchmaking queues (if queued), notifies opponents, and starts a reconnection grace timer. Default grace period is 90 seconds. If reconnection doesn't occur within the window server emits `game_abandoned` and deletes the in-memory room.

### Matchmaking Events

Matchmaking is split for guests and authenticated users.

1. `find_match_guest` (Client → Server)
   - Description: Request matchmaking for a guest.
   - Payload:
     ```json
     {
       "guestId": "string",
       "displayName": "string",
       "elo": 1200
     }
     ```

2. `find_match_user` (Client → Server)
   - Description: Request matchmaking for a logged-in user. Server uses `accessToken` to identify account and authoritative ELO.
   - Payload:
     ```json
     {
       "userId": "uuid-string", // optional; server verifies token
       "elo": 1250
     }
     ```

3. `cancel_find_match` (Client → Server)
   - Description: Cancel a pending matchmaking request. Server removes socket from the corresponding queue.

4. `match_found` (Server → Client)
   - Description: Emitted when a match is created. Sent to both players. For guests, the server will include `matchUrl` and per-client reconnection hints.
   - Payload example:

     ```json
     {
       "roomId": "uuid-string",
       "matchUrl": "/match/uuid-string",
       "isRanked": true,
       "isGuest": false,
       "playerRed": {
         "socketId": "socket-id",
         "id": "user-uuid-or-guestId",
         "elo": 1250
       },
       "playerBlack": {
         /* same shape as playerRed */
       },
       "fen": "...",
       "createdAt": 1684150200000
     }
     ```

   - Notes: The `id` field will contain either a `userId` (for authenticated users) or a `guestId`/`guestToken` identifier for guests. The server will not leak another player's `guestToken` to opponents.

### Room Management Events

1. `create_room` (Client → Server)
   - Create a private room. Payload contains creator identity and color preference. Responds with `room_created`.

2. `join_room` (Client → Server)
   - Join existing room by `roomId`. Responds with `player_joined` or `error`.

3. `spectate_room` (Client → Server)
   - Join as spectator. Responds with `spectator_joined`.

4. `player_joined` (Server → Room)
   - Informs participants that the opponent joined and game can start. Payload includes the room snapshot (players, fen, isRanked).

### Reconnection Events

1. `opponent_disconnected` (Server → Opponent)
   - Description: Emitted immediately when a player's socket disconnects while a room is active.
   - Payload:
     ```json
     { "gracePeriod": 90 }
     ```

2. `reconnected` (Server → Reconnecting Client)
   - Description: Emitted when the server successfully reattaches a reconnecting client to an existing room (within grace period).
   - Payload example:
     ```json
     {
       "roomId": "uuid-string",
       "playerColor": "red" // or "black"
     }
     ```

3. `opponent_reconnected` (Server → Opponent)
   - Description: Sent to the remaining player when the disconnected opponent reconnected.

4. `game_abandoned` (Server → All in room)
   - Description: Emitted when a disconnected player fails to reconnect within the grace window. Server will delete the room and emit finalization events. Payload: `{}`.

### Gameplay Events

1. `make_move` (Client → Server)
   - Player submits a move. Server validates, updates FEN, broadcasts `move_made`.

2. `move_made` (Server → Opponent & Spectators)
   - Broadcast for moves. Payload includes `move` and `newFen`.

3. `game_over` (Client → Server then Server → All)
   - Client or server signals game end. Server will remove the room, calculate ELO (if `isRanked`) and emit `elo_update`.

4. `elo_update` (Server → All in room)
   - Payload example:
     ```json
     { "newEloRed": 1265, "newEloBlack": 1185 }
     ```
   - Note: Current code emits `elo_update` for ranked matches; persisting changes to DB is a TODO for full integration.

### Errors

`error` (Server → Client)

```json
{ "message": "Room not found" }
```

Common error strings: `Room not found`, `Room full, joined as spectator`, `Unauthorized`.

---

## Data Models

### User Model (Prisma / DB)

```ts
model User {
  id             String   @id @default(uuid())
  email          String?  @unique
  password       String?
  refreshToken   String?
  role           Role     @default(USER) // includes GUEST
  guestToken     String?  @unique
  guestExpiresAt DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
  BOT
  GUEST
}
```

### In-Memory GameRoom (Socket)

```ts
{
  roomId: string,
  playerRed: Player | null,
  playerBlack: Player | null,
  spectators?: Player[],
  fen: string,
  isRanked: boolean,
  isGuest: boolean,
  createdAt: number
}
```

### Player (Socket)

```ts
{
  socketId: string,
  id: string, // userId or guestId
  role: 'USER' | 'GUEST',
  displayName?: string,
  elo?: number
}
```

---

## Response Format

All REST API responses follow a standard format:

```json
{
  "code": number,
  "message": string,
  "data": object | array | null
}
```

---

## WebSocket Configuration

```js
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
```

Notes: during local testing you may allow broader CORS or run Node-based socket tests to avoid browser origin limits.

---

## Testing

- Socket test harness: `backend/test/test-socket.js` — simple Node `socket.io-client` scenarios for `guest-flow`, `user-flow`, `reconnect-flow`, and `grace-timeout`.
- To run tests:

```bash
cd backend
npm install --save-dev socket.io-client
node test/test-socket.js guest-flow
```

---

## Starting the Server

```bash
# Development
npm run dev

# Production
npm run start
```

**Environment Variables:**

- `PORT`: Server port (default: 8080)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for token signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing

---

## Notes & TODOs

- `handleUserReconnection` needs JWT verification to reattach logged-in users to rooms.
- Persisting ELO changes for ranked matches is pending (Prisma update required on `game_over`).
- Consider exposing a `GET /match/:roomId` REST endpoint to allow clients to fetch room state by URL (useful for shareable match links).
