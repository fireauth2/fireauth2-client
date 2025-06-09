export enum Prompt {
  None = 'none',
  SelectAccount = 'select_account',
  Consent = 'consent',
}

export enum AccessType {
  Online = 'online',
  Offline = 'offline',
}

/**
 * Represents the body for the initial OAuth authorization request.
 */
export type GetAuthorizationUrlRequest = {
  /**
   * An absolute URL to redirect the user to after the user comples the OAuth 2.0.
   */
  redirect_uri?: string;
  /**
   *
   */
  prompt?: Prompt;
  /**
   *
   */
  access_type?: AccessType;
  /**
   * The scope(s) to grant this application access to.
   */
  scope: string | string[];
  /**
   *
   */
  login_hint?: string;
  /**
   * Whether to include the most recent list of scopes granted to this application
   * in the authorization response.
   * @default true
   */
  include_granted_scopes?: boolean;
};
