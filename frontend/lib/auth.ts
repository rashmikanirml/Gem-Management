export type AuthUser = {
  sub: string;
  role: "USER" | "ADMIN";
  exp: number;
  iat: number;
};

const TOKEN_KEY = "gem_market_token";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
}

export function parseUserFromToken(token: string | null): AuthUser | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    return JSON.parse(atob(payload)) as AuthUser;
  } catch {
    return null;
  }
}
