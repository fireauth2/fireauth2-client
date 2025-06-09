/**
 * Represents the body of a token revocation request.
 */
export type RevokeTokenRequest = {
  /**
   * The access token to revoke.
   */
  access_token: string;

  /**
   * Whether to also revoke the refresh token associated with
   * the currently signed-in Firebase user.
   *
   * @default false
   */
  revoke_refresh_token?: boolean;
};
