import { UrlTree } from '@angular/router';

type UrlLike = string | URL;

export interface FireAuthConfig {
  /**
   * The URL to the FireAuth2 server.
   */
  clientServerUrl: UrlLike;

  /**
   * Specifies the *absolute* URL to redirect to after a successful authorization response.
   *
   * By default, this value is set to the browser URL at the time of calling the {@link FireAuth2.login login}
   * method.
   *
   * You can override this behaviour by specifying the URL in the {@link RequestAccessTokenRequest.redirect_uri redirect_uri}
   * field in the {@link RequestAccessTokenRequest} options passed to the login method.
   */
  clientRedirectUri?: UrlLike | (() => UrlLike);

  /**
   * The url to redirect to after a successful authorization response.
   *
   * To disable redirection, don't provide this value at all.
   */
  redirectToAfterFinishLogin?: string | string[] | UrlTree;

  /**
   * If set to `true`, will call the FireAuth2 server to attempt revoking both the "accessToken" and "refreshToken".
   * Set this option to `accessToken`, to only attempt to revoke the Google-issued access token.
   *
   * A *falsy* value disables token revocation entirely.
   *
   * You may still *force* **refresh token** revocation when manually calling
   * {@link FireAuth2.revokeAccessToken revokeAccessToken}.
   *
   *
   * @default false
   */
  revokeTokensAfterLogout?: boolean | 'accessToken';

  /**
   * Removes fragment parameters set to the URL as part of an authorization response.
   *
   * Disabling this option may be useful in cases you need to manually process these parameters.
   *
   * @default true
   */
  cleanUpUrlFragmentAfterLogin?: boolean;

  /**
   * Minutes before an access token expires to trigger token refreshing.
   *
   * **Note**: May not exceed `10` mins.
   *
   * @default 5
   */
  canRefreshBeforeExpiringInMins?: number;
}

/** @internal */
export const defaultFireAuthConfig: Omit<FireAuthConfig, 'clientServerUrl'> = {
  canRefreshBeforeExpiringInMins: 5,
  cleanUpUrlFragmentAfterLogin: true,
  revokeTokensAfterLogout: false,
};
