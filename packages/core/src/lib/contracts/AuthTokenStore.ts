import { AuthorizationSuccessResponseParams } from './AuthorizationResponse';

/**
 * Abstract interface for managing token storage.
 * Implementations may use IndexedDB, localStorage, memory, or secure cookies.
 */
export interface AuthTokenStore {
  /**
   * Retrieves the currently stored token exchange response, or null if none is set.
   */
  get(): Promise<AuthorizationSuccessResponseParams | null>;

  /**
   * Stores or replaces the current token exchange response.
   * Pass `null` to clear the stored token.
   */
  set(token: AuthorizationSuccessResponseParams | null): Promise<void>;

  /**
   * Clears the stored token explicitly (same as set(null), but semantically distinct).
   */
  clear(): Promise<void>;
}
