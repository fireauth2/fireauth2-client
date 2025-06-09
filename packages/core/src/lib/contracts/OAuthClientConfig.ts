export type IdTokenValue = string | null | undefined;

export type GetIdTokenFn = () => IdTokenValue | Promise<IdTokenValue>;

export interface OAuthClientConfig {
  /**
   * URL to your FireAuth2 server (e.g. `https://auth.example.com`)
   */
  serverUrl: string;

  /**
   * A function returning a Firebase ID token (or any bearer token).
   */
  getIdToken: GetIdTokenFn;
}
