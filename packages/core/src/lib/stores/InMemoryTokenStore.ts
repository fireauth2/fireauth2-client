import {
  AuthTokenStore,
  AuthorizationSuccessResponseParams,
} from '../contracts';

/**
 * SSR-safe, in-memory fallback store. Tokens are not persisted across requests.
 */
export class InMemoryTokenStore implements AuthTokenStore {
  private token: AuthorizationSuccessResponseParams | null = null;

  async get(): Promise<AuthorizationSuccessResponseParams | null> {
    return this.token;
  }

  async set(token: AuthorizationSuccessResponseParams | null): Promise<void> {
    this.token = token;
  }

  async clear(): Promise<void> {
    this.token = null;
  }
}
