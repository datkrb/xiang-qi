import { v4 as uuidv4 } from "uuid";

const GUEST_TOKEN_KEY = "guestToken";
const GUEST_ELO_KEY = "guestElo";
const CURRENT_MATCH_KEY = "currentMatch";

export const GuestStorage = {
  getOrCreateGuest(): { guestToken: string; guestElo: number } {
    let guestToken = localStorage.getItem(GUEST_TOKEN_KEY);
    if (!guestToken) {
      guestToken = uuidv4();
      localStorage.setItem(GUEST_TOKEN_KEY, guestToken);
    }

    let guestElo = Number(localStorage.getItem(GUEST_ELO_KEY) || "");
    if (!guestElo || Number.isNaN(guestElo)) {
      guestElo = 1200;
      localStorage.setItem(GUEST_ELO_KEY, String(guestElo));
    }

    return { guestToken, guestElo };
  },

  getGuestToken(): string | null {
    return localStorage.getItem(GUEST_TOKEN_KEY);
  },

  setGuestElo(elo: number) {
    localStorage.setItem(GUEST_ELO_KEY, String(elo));
  },

  getGuestElo(): number {
    return Number(localStorage.getItem(GUEST_ELO_KEY) || "1200");
  },

  setCurrentMatch(roomId: string | null) {
    if (roomId) localStorage.setItem(CURRENT_MATCH_KEY, roomId);
    else localStorage.removeItem(CURRENT_MATCH_KEY);
  },

  getCurrentMatch(): string | null {
    return localStorage.getItem(CURRENT_MATCH_KEY);
  },
};
