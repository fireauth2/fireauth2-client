import { GetAuthorizationUrlRequest } from './AuthorizationRequest';
import { AuthorizationSuccessResponseParams } from './AuthorizationResponse';
import { IntrospectTokenResponse } from './IntrospectionResponse';
import { LogoutOptions } from './LogoutOptions';
import { RevokeTokenOptions } from './RevokeTokenOptions';

export interface Auth {
  getAccessToken(): Promise<string | null>;
  getIdToken(): Promise<string | null>;
  getTokenInfo(): Promise<IntrospectTokenResponse | null>;

  logout(options?: LogoutOptions): Promise<void>;
  revokeAccessToken(options?: RevokeTokenOptions): Promise<void>;

  startLogin(options: GetAuthorizationUrlRequest): Promise<void>;
  tryFinishLogin(): Promise<AuthorizationSuccessResponseParams | undefined>;

  refreshAccessToken(): Promise<AuthorizationSuccessResponseParams>;
  tryRefreshAccessToken(): Promise<AuthorizationSuccessResponseParams>;
  canRefreshAccessToken(
    token: AuthorizationSuccessResponseParams | null,
  ): Promise<boolean>;
}
