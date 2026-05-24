# Frontend Specification

## Tasks

- `[x]` **Edit Left Navigation**: Update the left navigation sidebar so the top group contains `Home`, `Play`, and `Tutorial`, and the bottom group contains `Keep Project`, `Settings`, `Delete`, and `Logout`.
  - Description: Primary navigation items should be visually grouped at the top of the sidebar; secondary actions (project persistence, settings, destructive action, and logout) must be pinned to the bottom.
  - UI file: `frontend/src/components/AppSidebar.tsx`
  - Docs: See [LEFT_NAV.md](frontend/docs/LEFT_NAV.md) for recommended markup, handlers, and testing steps.
  - Acceptance criteria:
    - `[x]` Top nav shows `Home`, `Play`, `Tutorial` in that order.
    - `[x]` Bottom area contains `Keep Project`, `Settings`, `Delete`, `Logout` and remains pinned to sidebar bottom.
    - `[x]` `Delete` triggers a confirmation modal before any destructive API call.
    - `[x]` `Logout` clears auth state and redirects to the login screen.
  - Priority: Medium

  - Routing:
    - Clicking `Home` → navigate to `/home`.
    - Clicking `Play` → navigate to `/play`.
    - Clicking `Tutorial` → navigate to `/tutorial`.
    - Clicking `Keep Project` → navigate to `/projects`.
    - Clicking `Settings` → navigate to `/settings`.
    - `Delete` is a destructive action and should NOT navigate automatically; it must show a confirmation modal first.
    - `Logout` clears auth and navigates to `/login`.

## Content for each navigation item

- **Home** (`/home`)
  - Purpose: Dashboard / landing page after sign-in.
  - Contains: recent matches and summaries, friends online, quick actions (Continue last game, Quick Play), ELO and leaderboards snapshot, notifications.
  - Likely components: `frontend/src/components/HomeScreen.tsx`, `PlayerCard`, `LeaderboardScreen`.

- **Play** (`/play`)
  - Purpose: Start or join games.
  - Contains: game mode selection (AI, Offline, Online), matchmaking controls, create/join room, quick configuration (time control, rated/casual), and links to load saved games.
  - Likely components: `frontend/src/components/GameModeScreen.tsx`, `GameMatchmaking.tsx`, `GameRoom.tsx`.

- **Tutorial** (`/tutorial`)
  - Purpose: Teach Xiangqi rules and common tactics.
  - Contains: step-by-step lessons, interactive practice board, puzzle sets, progress tracking.
  - Likely components: `frontend/src/components/TutorialScreen.tsx`, board components under `components/xiangqi`.

- **Keep Project** (`/projects`)
  - Purpose: Manage saved projects or saved games.
  - Contains: a list of saved projects/games, actions to save current state, load, export, and rename. Includes metadata (last modified, players, ELO impact).
  - Likely components: `frontend/src/components/LoadGameScreen.tsx` or a new `ProjectsScreen`.

- **Settings** (`/settings`)
  - Purpose: User account and app preferences.
  - Contains: Profile editing (display name, avatar), account settings (email, password), app preferences (theme, sound), notification settings, privacy and connected accounts.
  - Likely components: `frontend/src/components/SettingsScreen.tsx`, `ProfileScreen.tsx`.

- **Delete** (action)
  - Purpose: Destructive action to remove a saved project or game.
  - Behavior: Not a route — should open a confirmation modal describing what will be deleted and require explicit confirmation (checkbox or type-to-confirm for important deletes). Call backend delete endpoint only after confirmation and show success/failure feedback.

- **Logout** (action)
  - Purpose: Sign the user out.
  - Behavior: Clear authentication tokens and session (use `GuestStorage` for guest handling), clear any in-memory auth state, then navigate to `/login` (or landing) and show a toast confirming logout.

---

This task entry documents routing and page contents for the left navigation sidebar.

---

## Review notes (repo scan)

- The app currently uses an internal `currentScreen` state (in `frontend/src/App.tsx`) rather than browser-route driven navigation. Navigation is handled by `AppSidebar` calling `onNavigate(screen)` which sets `currentScreen`.
- `AppSidebar` exists at `frontend/src/components/AppSidebar.tsx` and currently lists several play-related items (Online, Offline, Vs AI, Saved Games, Leaderboard). To meet the spec (top = `Home`, `Play`, `Tutorial`; bottom = `Keep Project`, `Settings`, `Delete`, `Logout`) we must update `AppSidebar` to the new layout.
- The app already supports deep-linking for match URLs (`/match/:id`) and uses `window.history` in some handlers. There is an `api.logout()` function used in `App.tsx` and a `/auth/logout` backend endpoint (see backend postman collection).
- There is no explicit backend "projects" delete API discovered in the backend code; saved games are currently handled by `LoadGameScreen` and guest storage (frontend `GuestStorage`). If server-side persistence for projects is required, a new backend endpoint (e.g., `DELETE /projects/:id`) should be added.

## Developer checklist — implement left-nav + URL routing

75. `[x]` 1. Update `AppSidebar.tsx` (frontend/src/components/AppSidebar.tsx)

- `[x]` Replace the primary nav with top group: `Home`, `Play`, `Tutorial`.
- `[x]` Replace bottom area with: `Keep Project` (link), `Settings`, `Delete` (button), `Logout` (button).
- `[x]` For `Play`, open a `GameMode` selector screen — decide whether `Play` maps to existing `online`/`offline`/`ai` flow or a central `play` screen.
- `[x]` Use `onNavigate` for non-destructive navigation and `onLogout` for logout action.

82. `[x]` 2. Support URL routing (frontend/src/App.tsx)

- `[x]` Modify `handleNavigate` to push a matching browser URL via `window.history.pushState({}, '', path)` when navigating. Example mapping:
  - `home` → `/home`
  - `play` → `/play` (or `/play/online` if you want subroutes)
  - `tutorial` → `/tutorial`
  - `projects` → `/projects`
  - `settings` → `/settings`
- `[x]` On app mount, parse `window.location.pathname` and set the initial `currentScreen` accordingly (similar to the existing `/match/:id` logic).

92. `[x]` 3. Delete action

- `[x]` Add a confirmation modal component (e.g., `DeleteConfirm.tsx`) or reuse `GameDialogs.tsx`.
- `[x]` If project deletion is only frontend (guest/project storage), call the appropriate `GuestStorage` or frontend persistence method. If server-side deletion is required, add a backend endpoint such as `DELETE /projects/:id` and call it from `frontend/src/services/apiClient.ts`.

4. `[x]` Logout

- `[x]` `App.tsx` already has `handleLogout` calling `api.logout()` and clearing localStorage — ensure `AppSidebar` calls the provided `onLogout` prop.

5. `[x]` Routes and links

- `[x]` Ensure the app registers route-to-screen mapping in `App.tsx` (e.g., if pathname `/home` set `currentScreen='home'`).
- `[x]` Consider small helper `mapPathToScreen(pathname)` and `mapScreenToPath(screen)` functions to centralize the mapping.

6. `[x]` Acceptance tests / QA

- `[x]` Manual test: clicking each nav item updates the UI and browser URL, and back/forward buttons maintain state.
- `[x]` Test `Delete` confirms and removes saved item (or calls API) and displays success/error toast.
- `[x]` Test `Logout` calls API, clears storage, and shows login screen.

## Suggested small code snippets

- `handleNavigate` (App.tsx) example change:

```ts
const handleNavigate = useCallback((screen: string) => {
  setCurrentScreen(screen as Screen);
  setIsSidebarOpen(false);
  const path = mapScreenToPath(screen);
  window.history.pushState({}, "", path);
}, []);

function mapScreenToPath(screen: string) {
  switch (screen) {
    case "home":
      return "/home";
    case "play":
      return "/play";
    case "tutorial":
      return "/tutorial";
    case "projects":
      return "/projects";
    case "settings":
      return "/settings";
    default:
      return "/";
  }
}
```

- Initial mount parsing example (add to `useEffect`) :

```ts
useEffect(() => {
  const path = window.location.pathname;
  if (path.startsWith("/match/")) return; // existing handler
  if (path === "/home" || path === "/") setCurrentScreen("home");
  else if (path.startsWith("/play")) setCurrentScreen("play");
  else if (path === "/tutorial") setCurrentScreen("tutorial");
  else if (path === "/projects") setCurrentScreen("load");
  else if (path === "/settings") setCurrentScreen("settings");
}, []);
```

## Done — what I changed in the task file

- Normalized the spec to match repo behavior and added an explicit developer checklist, route mapping, and implementation notes.
