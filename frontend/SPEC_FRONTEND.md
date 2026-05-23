# Xiangqi Frontend Implementation Spec

Purpose: provide a complete, actionable spec for implementing the frontend features required to support the backend guest flow, matchmaking, reconnection, and `/match/:roomId` route.

Scope:

- Guest flow (local storage, temporary elo, matchmaking)
- Socket integration (connect, find_match_guest, find_match_user, reconnect)
- Match page (`/match/:roomId`) that loads room snapshot (via `GET /match/:roomId`) and attempts socket join
- UI components to support quick matchmaking, match sharing, and graceful reconnect
- Tests and developer notes

---

## Architecture Overview

- React + Vite (already present)
- Use context `GameContext` (exists) to store session and socket state
- Create `SocketService` wrapper to manage `socket.io-client` connection lifecycle
- Create `GuestStorage` helper to persist and read `guestToken`, `guestElo`, and `currentMatch`
- Routes:
  - `/` Home
  - `/match/:roomId` Match room (join or spectate)
  - Authentication screens (Login, Register)

---

## Storage & Identity

- `localStorage` keys:
  - `guestToken` — stable unique token for guest (generate once per browser)
  - `guestElo` — local ELO estimate (default 1200)
  - `currentMatch` — roomId of an active match

- Guest creation: On first-time use, `GuestStorage` will generate `guestToken` as a v4 UUID (or secure random string) and set `guestElo` to 1200.
- When a guest finds a match, store `currentMatch` = `roomId`.
- On disconnect/reconnect, client will reuse `guestToken` to request reconnection.

---

## SocketService Contract

- Expose methods:
  - `connect({ role, guestToken?, accessToken? })` - connects socket and sends handshake auth
  - `disconnect()` - clean disconnect
  - `findMatchGuest(payload)` - emits `find_match_guest`
  - `findMatchUser(payload)` - emits `find_match_user`
  - `cancelFindMatch()` - emits `cancel_find_match`
  - `joinRoom(roomId)` - logic to join a room if needed
  - `on(event, handler)` - subscribe to socket events
  - `off(event, handler)` - unsubscribe

- Events handled:
  - `connect`, `disconnect`, `match_found`, `opponent_disconnected`, `reconnected`, `opponent_reconnected`, `game_abandoned`, `move_made`, `elo_update`.

- Behavior:
  - When `connect` establishes, if `guestToken` present call `handleGuestReconnection` flow (server may respond with `reconnected`).
  - Retry strategy: rely on socket.io reconnection default; on reconnection emit `reconnect-check` only if server requires it.

---

## UI Components

- `MatchmakingButton` — small component to start/stop matchmaking. Props: `role: 'GUEST' | 'USER'`.
  - Shows spinner when queued.
  - Calls `SocketService.findMatchGuest` or `findMatchUser`.

- `MatchFoundDialog` — modal showing `opponentName`, `matchUrl` (copy button), `start countdown`.

- `MatchRoom` (`/match/:roomId`) — loads room snapshot via GET `GET /match/:roomId` then connects socket. If room exists and current user is a participant, join as player; else join as spectator.
  - Shows board (existing `XiangqiBoard`), player cards, reconnect notices.

- `ReconnectBanner` — shown when `opponent_disconnected` received, showing countdown and `Leave` button.

---

## Flow Details

1. Guest initial flow
   - On app load, `GuestStorage.getOrCreateGuest()` returns `{ guestToken, guestElo }`.
   - User clicks `Find Match` → `SocketService.connect({ role: 'GUEST', guestToken })` then `findMatchGuest({ guestId: guestToken, displayName, elo })`.
   - Server emits `match_found` with `matchUrl` and `roomId`. Save `currentMatch` in `GuestStorage`.
   - Navigate to `matchUrl` or open `MatchFoundDialog`.

2. Reconnection
   - Client reconnects and handshake contains `guestToken` → server may respond with `reconnected` event.
   - On receiving `reconnected`, update local state and navigate to the room if not already there.
   - If `opponent_disconnected` received, show `ReconnectBanner` with 90s countdown.

3. Opening a shared `/match/:roomId`
   - On mount of `MatchRoom` call `GET /match/:roomId`.
     - If room not found → show error.
     - If found → connect socket with same `guestToken` (if guest) and attempt to join via socket logic.

---

## Tests to write (frontend)

- Unit tests (Jest/React Testing Library)
  - `GuestStorage` generates and persists guest token.
  - `SocketService` emits correct events when `findMatchGuest` / `cancelFindMatch`.

- Integration (E2E)
  - Use Playwright to simulate two guests finding a match: open two browser contexts, ensure both receive `match_found` and that `/match/:roomId` works.
  - Simulate disconnect/reconnect: close one client, leave for 3s, reopen and verify `reconnected` event leads to restored state.

---

## API usage reference (frontend to backend)

- `GET /match/:roomId` — get room snapshot (no auth required)
- `Socket events` — see `specAPI.md` for full list. Main ones used by frontend:
  - `find_match_guest` → payload `{ guestId, displayName, elo }`
  - Listen for `match_found` → navigate to `matchUrl`
  - `cancel_find_match` → stop queueing
  - `make_move` / `move_made` → gameplay

---

## Implementation roadmap (tasks)

1. Add `GuestStorage` helper.
2. Implement `SocketService` wrapper + small tests.
3. Add `MatchFoundDialog` + `MatchmakingButton` components.
4. Implement `MatchRoom` route that reads `GET /match/:roomId` and connects to socket.
5. Add UI glue into `GameContext` to store `currentMatch` and player info.
6. E2E Playwright scripts (optional, later).

---

## Developer Notes

- Ensure socket handshake sends `auth: { role, guestToken?, accessToken? }`.
- Protect any UI that relies on persistent ELO until DB persistence is implemented.
- For local development you can shorten the server grace period by setting an env var and restarting server.

---

End of spec.
