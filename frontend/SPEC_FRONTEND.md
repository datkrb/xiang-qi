# Frontend Specification

## Tasks

- **Edit Left Navigation**: Update the left navigation sidebar so the top group contains `Home`, `Play`, and `Tutorial`, and the bottom group contains `Keep Project`, `Settings`, `Delete`, and `Logout`.
  - Description: Primary navigation items should be visually grouped at the top of the sidebar; secondary actions (project persistence, settings, destructive action, and logout) must be pinned to the bottom.
  - UI file: `frontend/src/components/AppSidebar.tsx`
  - Docs: See [LEFT_NAV.md](frontend/docs/LEFT_NAV.md) for recommended markup, handlers, and testing steps.
  - Acceptance criteria:
    - Top nav shows `Home`, `Play`, `Tutorial` in that order.
    - Bottom area contains `Keep Project`, `Settings`, `Delete`, `Logout` and remains pinned to sidebar bottom.
    - `Delete` triggers a confirmation modal before any destructive API call.
    - `Logout` clears auth state and redirects to the login screen.
  - Routing:
    - Clicking `Home` → navigate to `/home`.
    - Clicking `Play` → navigate to `/play`.
    - Clicking `Tutorial` → navigate to `/tutorial`.
    - Clicking `Keep Project` → navigate to `/projects`.
    - Clicking `Settings` → navigate to `/settings`.
    - `Delete` is a destructive action and should NOT navigate automatically; it must show a confirmation modal first.
    - `Logout` clears auth and navigates to `/login`.
  - Priority: Medium

## Content for each navigation item

- **Home** (`/home`)
  - Purpose: Dashboard / landing page after sign-in.
  - Contains: recent matches and summaries, friends online, quick actions (Continue last game, Quick Play), ELO and leaderboards snapshot, notifications.
  - Likely components: [frontend/src/components/HomeScreen.tsx](frontend/src/components/HomeScreen.tsx), `PlayerCard` and `LeaderboardScreen` for embeds.

- **Play** (`/play`)
  - Purpose: Start or join games.
  - Contains: game mode selection (AI, Offline, Online), matchmaking controls, create/join room, quick configuration (time control, rated/ casual), and links to load saved games.
  - Likely components: [frontend/src/components/GameModeScreen.tsx](frontend/src/components/GameModeScreen.tsx), [frontend/src/components/GameMatchmaking.tsx](frontend/src/components/GameMatchmaking.tsx), [frontend/src/components/GameRoom.tsx](frontend/src/components/GameRoom.tsx).

- **Tutorial** (`/tutorial`)
  - Purpose: Teach Xiangqi rules and common tactics.
  - Contains: step-by-step lessons, interactive practice board, puzzle sets, progress tracking.
  - Likely components: [frontend/src/components/TutorialScreen.tsx](frontend/src/components/TutorialScreen.tsx), board components under `components/xiangqi`.

- **Keep Project** (`/projects`)
  - Purpose: Manage saved projects or saved games.
  - Contains: a list of saved projects/games, actions to save current state, load, export, and rename. Includes metadata (last modified, players, ELO impact).
  - Likely components: [frontend/src/components/LoadGameScreen.tsx](frontend/src/components/LoadGameScreen.tsx) or a new `ProjectsScreen` if implemented.

- **Settings** (`/settings`)
  - Purpose: User account and app preferences.
  - Contains: Profile editing (display name, avatar), account settings (email, password), app preferences (theme, sound), notification settings, privacy and connected accounts.
  - Likely components: [frontend/src/components/SettingsScreen.tsx](frontend/src/components/SettingsScreen.tsx), [frontend/src/components/ProfileScreen.tsx](frontend/src/components/ProfileScreen.tsx).

- **Delete** (action)
  - Purpose: Destructive action to remove a saved project or game.
  - Behavior: Not a route — should open a confirmation modal describing what will be deleted and require explicit confirmation (checkbox or type-to-confirm for important deletes). Call backend delete endpoint only after confirmation and show success/failure feedback.

- **Logout** (action)
  - Purpose: Sign the user out.
  - Behavior: Clear authentication tokens and session (use `GuestStorage` for guest handling), clear any in-memory auth state, then navigate to `/login` (or landing) and show a toast confirming logout.
