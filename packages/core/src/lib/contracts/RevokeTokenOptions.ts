/**
 * Represents the options of a token revocation request.
 */
export type RevokeTokenOptions = {
  /**
   * Whether to also revoke the refresh token associated with
   * the currently signed-in Firebase user.
   *
   * @default false
   */
  revokeRefreshToken?: boolean;
};
