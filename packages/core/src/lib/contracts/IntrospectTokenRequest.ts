export enum IntrospectTokenTypeHint {
  AccessToken = 'access_token',
  IdToken = 'id_token',
}

/**
 * Represents the body of a token introspection request.
 */
export type IntrospectTokenRequest = {
  /** The token to introspect. */
  token: string;

  /**
   * The kind of token to introspect.
   * @default IntrospectTokenTypeHint.IdToken
   */
  token_type_hint?: IntrospectTokenTypeHint;
};
