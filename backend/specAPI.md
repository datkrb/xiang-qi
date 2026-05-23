# Xiangqi Backend API Specification

**Server:** http://localhost:8080  
**WebSocket:** ws://localhost:8080  
**Database:** PostgreSQL  
**ORM:** Prisma

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Users API](#users-api)
3. [Socket Events](#socket-events)
4. [Data Models](#data-models)
5. [Response Format](#response-format)

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
- **Error (400 Bad Request):**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```
- **Notes:**
  - Access token should be sent in Authorization header: `Bearer <accessToken>`
  - Refresh token is stored in the database for session management

---

### 3. Logout

- **Endpoint:** `POST /auth/logout`
- **Authentication:** Required (Bearer token)
- **Description:** Invalidate user session
- **Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Request Body:** Empty
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "Logout successful",
    "data": null
  }
  ```
- **Error (401 Unauthorized):**
  ```json
  {
    "message": "Unauthorized: No token provided"
  }
  ```

---

## Users API

### Prerequisites

All user endpoints require:

- **Authentication:** Admin role token in Authorization header
- **Headers:** `Authorization: Bearer <accessToken>`

---

### 1. Get All Users

- **Endpoint:** `GET /users/`
- **Authentication:** Required (Admin only)
- **Description:** Retrieve list of all users
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "Users retrieved successfully",
    "data": [
      {
        "id": "uuid-string",
        "email": "user@example.com",
        "role": "USER",
        "createdAt": "2026-05-15T10:30:00Z",
        "updatedAt": "2026-05-15T10:30:00Z"
      }
    ]
  }
  ```

---

### 2. Get User by ID

- **Endpoint:** `GET /users/:id`
- **Authentication:** Required (Admin only)
- **Parameters:**
  - `id` (path): User UUID
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "User retrieved successfully",
    "data": {
      "id": "uuid-string",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2026-05-15T10:30:00Z",
      "updatedAt": "2026-05-15T10:30:00Z"
    }
  }
  ```

---

### 3. Create User

- **Endpoint:** `POST /users/`
- **Authentication:** Required (Admin only)
- **Description:** Create a new user (admin operation)
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "USER"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "code": 201,
    "message": "User created successfully",
    "data": {
      "id": "uuid-string",
      "email": "john@example.com",
      "role": "USER"
    }
  }
  ```

---

### 4. Update User

- **Endpoint:** `PUT /users/:id`
- **Authentication:** Required (Admin only)
- **Parameters:**
  - `id` (path): User UUID
- **Request Body:** (any user fields to update)
  ```json
  {
    "email": "newemail@example.com",
    "role": "ADMIN"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "User updated successfully",
    "data": {
      "id": "uuid-string",
      "email": "newemail@example.com",
      "role": "ADMIN",
      "updatedAt": "2026-05-15T11:45:00Z"
    }
  }
  ```

---

### 5. Delete User

- **Endpoint:** `DELETE /users/:id`
- **Authentication:** Required (Admin only)
- **Parameters:**
  - `id` (path): User UUID
- **Response (200 OK):**
  ```json
  {
    "code": 200,
    "message": "User deleted successfully",
    "data": null
  }
  ```

---

## Socket Events

### Connection Lifecycle

#### Server Events (Listen)

---

### 1. connection

- **Event:** `connection`
- **Direction:** Server → Client
- **Description:** Emitted when a user connects to the WebSocket server
- **Data:** None
- **Payload:** N/A

---

### 2. disconnect

- **Event:** `disconnect`
- **Direction:** Server (internal)
- **Description:** User disconnects; server cleans up matchmaking queue and active rooms
- **Behavior:**
  - Removes user from matchmaking queue if present
  - Notifies opponent with `opponent_disconnected` event
  - Starts 60-second grace period for reconnection
  - Emits `game_abandoned` if player fails to reconnect

---

### Matchmaking Events

---

### 3. find_match

- **Event:** `find_match`
- **Direction:** Client → Server
- **Description:** Request to find a random opponent for ranked match
- **Payload:**
  ```javascript
  socket.emit("find_match", userData, isPlayRed);
  ```

  - `userData`: Object containing
    - `userId`: string (User UUID)
    - `elo`: number (Current ELO rating)
  - `isPlayRed`: boolean (color preference, may be randomized)
- **Response Event:** `match_found`

---

### 4. match_found

- **Event:** `match_found`
- **Direction:** Server → Client
- **Description:** Match has been found, both players notified
- **Payload:**
  ```json
  {
    "roomId": "uuid-string",
    "playerRed": {
      "socketId": "socket-id",
      "userId": "user-uuid",
      "elo": 1250
    },
    "playerBlack": {
      "socketId": "socket-id",
      "userId": "user-uuid",
      "elo": 1200
    },
    "fen": "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1",
    "isRanked": true,
    "createdAt": 1684150200000
  }
  ```

---

## Room Management Events

---

### 5. create_room

- **Event:** `create_room`
- **Direction:** Client → Server
- **Description:** Create a private/friend room for two-player game
- **Payload:**
  ```javascript
  socket.emit("create_room", userData, isPlayRed);
  ```

  - `userData`: Object containing
    - `userId`: string (User UUID)
    - `elo`: number (Current ELO)
  - `isPlayRed`: boolean | "random" (color preference)
- **Response Event:** `room_created`

---

### 6. room_created

- **Event:** `room_created`
- **Direction:** Server → Client
- **Description:** Room successfully created, client can share roomId with friend
- **Payload:**
  ```json
  {
    "roomId": "uuid-string"
  }
  ```

---

### 7. join_room

- **Event:** `join_room`
- **Direction:** Client → Server
- **Description:** Join an existing room by roomId
- **Payload:**
  ```javascript
  socket.emit("join_room", {
    roomId: "uuid-string",
    userData: {
      userId: "user-uuid",
      elo: 1200,
      username: "PlayerName",
    },
  });
  ```
- **Response Events:**
  - `player_joined` - if successfully joined
  - `error` - if room not found or full

---

### 8. player_joined

- **Event:** `player_joined`
- **Direction:** Server → All in room
- **Description:** A player successfully joined the room, game is ready to start
- **Payload:**
  ```json
  {
    "roomId": "uuid-string",
    "playerRed": {
      "socketId": "socket-id",
      "userId": "user-uuid",
      "elo": 1250
    },
    "playerBlack": {
      "socketId": "socket-id",
      "userId": "user-uuid",
      "elo": 1200
    },
    "fen": "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1",
    "isRanked": false,
    "createdAt": 1684150200000
  }
  ```

---

### 9. spectate_room

- **Event:** `spectate_room`
- **Direction:** Client → Server
- **Description:** Join a room as spectator (observe without playing)
- **Payload:**
  ```javascript
  socket.emit("spectate_room", {
    roomId: "uuid-string",
    userData: {
      userId: "user-uuid",
      elo: 1200,
    },
  });
  ```
- **Response Events:**
  - `spectator_joined` - confirmation
  - `error` - if room not found

---

### 10. spectator_joined

- **Event:** `spectator_joined`
- **Direction:** Server → Client (spectator)
- **Description:** Spectator successfully joined the room
- **Payload:**
  ```json
  {
    "roomId": "uuid-string"
  }
  ```

---

### 11. new_spectator

- **Event:** `new_spectator`
- **Direction:** Server → All in room (except spectator)
- **Description:** Notify room that a new spectator joined
- **Payload:**
  ```json
  {
    "userId": "user-uuid"
  }
  ```

---

## Gameplay Events

---

### 12. make_move

- **Event:** `make_move`
- **Direction:** Client → Server
- **Description:** Player makes a move on the board
- **Payload:**
  ```javascript
  socket.emit("make_move", {
    roomId: "uuid-string",
    move: {
      from: "a0",
      to: "a1",
      piece: "pawn",
      captured: null,
    },
    newFen:
      "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1",
  });
  ```

---

### 13. move_made

- **Event:** `move_made`
- **Direction:** Server → Opponent & Spectators
- **Description:** Move was made, broadcast to other players
- **Payload:**
  ```json
  {
    "move": {
      "from": "a0",
      "to": "a1",
      "piece": "pawn",
      "captured": null
    },
    "newFen": "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1"
  }
  ```

---

### 14. game_over

- **Event:** `game_over`
- **Direction:** Client → Server then Server → All in room
- **Description:** Game has ended
- **Payload (Client → Server):**
  ```javascript
  socket.emit("game_over", {
    roomId: "uuid-string",
    winnerId: "user-uuid",
  });
  ```
- **Payload (Server → All):**
  ```json
  {
    "winnerId": "user-uuid"
  }
  ```
- **Server Actions:**
  - Removes room from activeRooms
  - Calculates ELO changes if ranked match
  - Emits `elo_update` event

---

### 15. elo_update

- **Event:** `elo_update`
- **Direction:** Server → All in room
- **Description:** ELO ratings updated (ranked matches only)
- **Payload:**
  ```json
  {
    "newEloRed": 1265,
    "newEloBlack": 1185
  }
  ```
- **Notes:**
  - Only emitted for ranked matches (`isRanked: true`)
  - TODO: Save to database (Prisma)

---

### 16. opponent_disconnected

- **Event:** `opponent_disconnected`
- **Direction:** Server → Opponent
- **Description:** Opponent unexpectedly disconnected
- **Payload:** None
- **Grace Period:** 60 seconds to reconnect

---

### 17. game_abandoned

- **Event:** `game_abandoned`
- **Direction:** Server → All in room
- **Description:** Opponent failed to reconnect within grace period
- **Payload:** None
- **TODO:** Decrease ELO for abandoning player

---

## Error Handling

### 18. error

- **Event:** `error`
- **Direction:** Server → Client
- **Description:** An error occurred with the socket operation
- **Payload:**
  ```json
  {
    "message": "Room not found"
  }
  ```
- **Common Errors:**
  - `"Room not found"` - roomId doesn't exist
  - `"Room full, joined as spectator"` - both player seats taken

---

## Data Models

### User Model

```typescript
{
  id: string (UUID);
  email: string (unique);
  password: string (hashed);
  refreshToken: string | null;
  role: "USER" | "ADMIN" | "BOT";
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
  profile: Profile | null;
}
```

### Profile Model

```typescript
{
  id: string (UUID);
  userId: string (unique, FK to User);
  username: string (unique);
  elo: number (default: 1200);
  avatar: string | null;
  gamesAsRed: Game[];
  gamesAsBlack: Game[];
}
```

### Game Model

```typescript
{
  id: string (UUID);
  status: "ONGOING" | "RED_WON" | "BLACK_WON" | "DRAW";
  currentFen: string;
  redPlayerId: string (FK to Profile);
  redPlayer: Profile;
  blackPlayerId: string (FK to Profile);
  blackPlayer: Profile;
  createdAt: Date;
  updatedAt: Date;
  moves: Move[];
}
```

### Move Model

```typescript
{
  id: string (UUID);
  gameId: string (FK to Game);
  game: Game;
  moveNumber: number;
  notation: string;
  fenAfter: string;
  createdAt: Date;
}
```

### GameRoom (In-Memory Socket Model)

```typescript
{
  roomId: string;
  playerRed: Player | null;
  playerBlack: Player | null;
  spectators?: Player[];
  fen: string;
  isRanked: boolean;
  createdAt: number (timestamp);
}
```

### Player (Socket Model)

```typescript
{
  socketId: string;
  userId: string;
  username?: string;
  elo: number;
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

- **code:** HTTP status code
- **message:** Human-readable message
- **data:** Response payload (null if no data)

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication

### JWT Tokens

- **Type:** Bearer tokens in Authorization header
- **Format:** `Authorization: Bearer <token>`
- **Access Token:** Short-lived, for API requests
- **Refresh Token:** Long-lived, stored in database for session management

### Role-Based Access Control

- **USER:** Can play games, access own profile
- **ADMIN:** Can manage all users
- **BOT:** AI opponent for offline games

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

## WebSocket Configuration

```javascript
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
```

- **CORS Origin:** Frontend URL (currently localhost:5173)
- **Methods:** GET, POST
- **Upgrade:** HTTP to WebSocket

---

## Testing with Bruno

Collection available in: `backend/bruno/`

### Auth Requests

- `Auth/Login.bru` - Test login
- `Auth/Register.bru` - Test registration

### User Requests (Admin)

- `Users/Get All Users.bru`
- `Users/Get User By ID.bru`
- `Users/Create User.bru`
- `Users/Update User.bru`
- `Users/Delete User.bru`

---

## ELO Calculation

**Algorithm:** Standard Chess ELO  
**K-factor:** Based on skill level  
**Initial Rating:** 1200

Formula:

```
New ELO = Old ELO + K * (Actual Score - Expected Score)
```

- Actual Score: 1 for win, 0 for loss
- Expected Score: Calculated based on rating difference

**TODO:** Implement persistence to database

---

## Known Issues & TODOs

1. **ELO Persistence:** Currently calculated in memory only
   - TODO: Save to database after game_over
2. **Game History:** Moves are tracked in memory
   - TODO: Save games and moves to Prisma database
3. **Reconnection:** 60-second grace period implemented
   - TODO: Allow proper reconnection with new socket ID
4. **Profile Updates:** Users can't update their own profile
   - TODO: Add profile update endpoint
5. **Offline Games:** No offline game implementation yet
   - TODO: Add AI opponent (BOT role)

---

## Example Workflow

### 1. User Registration & Login

```
Client: POST /auth/register {email, password}
Server: 201 Created {user, accessToken, refreshToken}
```

### 2. Connecting to WebSocket

```
Client: Connect to ws://localhost:8080
Server: emit 'connection'
```

### 3. Finding a Ranked Match

```
Client: emit 'find_match' {userId, elo} true
[Wait for 2nd player...]
Server: emit 'match_found' {roomId, playerRed, playerBlack, fen}
```

### 4. Making Moves

```
Client: emit 'make_move' {roomId, move, newFen}
Server: emit 'move_made' {move, newFen} to opponent
```

### 5. Game Ends

```
Client: emit 'game_over' {roomId, winnerId}
Server:
  - Emit 'game_over' to room
  - Calculate ELO changes
  - Emit 'elo_update' {newEloRed, newEloBlack}
```

---

**Last Updated:** May 23, 2026  
**API Version:** 1.0.0
