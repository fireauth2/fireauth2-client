import { GetAuthorizationUrlRequest } from './AuthorizationRequest';
import { AuthorizationSuccessResponseParams } from './AuthorizationResponse';
import { IntrospectTokenResponse } from './IntrospectionResponse';
import { IntrospectTokenRequest } from './IntrospectTokenRequest';
import { RevokeTokenRequest } from './RevokeTokenRequest';

export enum OAuthClientEndpoint {
  Authorize = 'authorize',
  Token = 'token',
  Revoke = 'revoke',
  Introspection = 'introspect',
}

/**
 * FireAuth2Client defines the core contract for OAuth2 client operations
 * used to authorize users, exchange refresh tokens, revoke tokens,
 * and introspect token validity.
 */
export interface OAuthClient {
  /**
   * Initiates the authorization flow, typically by redirecting the user
   * to the OAuth2 authorization endpoint or triggering a popup login.
   * Resolves when the authorization process completes successfully.
   */
  getAuthorizationUrl(request: GetAuthorizationUrlRequest): Promise<string>;

  /**
   * Exchanges a refresh token for a new access token and optionally
   * a new refresh token. Handles token refresh logic transparently.
   * Resolves when the exchange completes and tokens are updated.
   */
  exchangeRefreshToken(): Promise<AuthorizationSuccessResponseParams>;

  /**
   * Revokes the specified access or refresh token, invalidating it
   * to prevent further use. Useful for logout or security-sensitive
   * token invalidation.
   */
  revoke(request: RevokeTokenRequest): Promise<void>;

  /**
   * Introspects the given token to determine its validity, active status,
   * and metadata such as expiry or scopes. Used to verify token state
   * without needing to decode or trust the token directly.
   */
  introspect(request: IntrospectTokenRequest): Promise<IntrospectTokenResponse>;
}
