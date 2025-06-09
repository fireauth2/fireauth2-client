import { AuthTokenStore, AuthorizationSuccessResponseParams } from "../contracts";

const TOKEN_KEY = 'fireauth2.token';

export class BrowserTokenStore implements AuthTokenStore {
  async get(): Promise<AuthorizationSuccessResponseParams | null> {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async set(token: AuthorizationSuccessResponseParams | null): Promise<void> {
    if (token === null) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  }
}
