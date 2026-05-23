const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";

async function request(path: string, opts: RequestInit = {}) {
  const url = API_BASE + path;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };

  const token = localStorage.getItem("authToken");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...opts, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || res.statusText);
  }
  // unwrap ApiResponse { code, message, data }
  return body?.data ?? body;
}

export async function login(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(username: string, email: string, password: string) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function getMatch(roomId: string) {
  return request(`/match/${encodeURIComponent(roomId)}`, {
    method: "GET",
  });
}

export default { login, register, getMatch };
