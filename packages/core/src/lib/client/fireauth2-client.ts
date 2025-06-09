import {
  AuthorizationSuccessResponseParams,
  GetAuthorizationUrlRequest,
  IdTokenValue,
  IntrospectTokenRequest,
  IntrospectTokenResponse,
  OAuthClient,
  OAuthClientConfig,
  OAuthClientEndpoint,
  RevokeTokenRequest,
} from '../contracts';
import {
  FireAuth2Error,
  FireAuth2ErrorTypeEnum,
  mapHttpStatusToErrorCode,
} from '../errors';
import {
  assertIsBrowserEnv,
  assertIsFunction,
  assertNonEmptyIdToken,
  assertValidServerUrl,
  wrapInPromise,
} from '../shared';

type Params = Record<string, string | undefined | boolean | number>;

export class FireAuth2Client implements OAuthClient {
  #serverUrl: URL;
  #idTokenPromise: Promise<IdTokenValue>;

  constructor(private readonly config: OAuthClientConfig) {
    assertValidServerUrl(config.serverUrl);
    assertIsFunction(config.getIdToken, 'getIdToken');
    this.#serverUrl = new URL(config.serverUrl);
    this.#idTokenPromise = wrapInPromise<IdTokenValue>(config.getIdToken);
  }

  async getAuthorizationUrl(
    request: GetAuthorizationUrlRequest,
  ): Promise<string> {
    assertIsBrowserEnv();

    const { scope: _scope, ...params } = request;
    const scope = Array.isArray(_scope) ? _scope.join(' ') : _scope;

    const url = this.buildEndpointUrl(OAuthClientEndpoint.Authorize, {
      ...params,
      scope,
    });

    return url;
  }

  async exchangeRefreshToken(): Promise<AuthorizationSuccessResponseParams> {
    const url = this.buildEndpointUrl(OAuthClientEndpoint.Token);
    const headers = await this.buildAuthHeaders();

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new FireAuth2Error({
        message: `exchangeRefreshToken failed with status: ${response.status} ${response.statusText}`,
        code: mapHttpStatusToErrorCode(response.status),
        type: FireAuth2ErrorTypeEnum.Network,
      });
    }

    return await response.json();
  }

  async revoke(request: RevokeTokenRequest): Promise<void> {
    const url = this.buildEndpointUrl(OAuthClientEndpoint.Revoke);
    const headers = await this.buildAuthHeaders({
      'Content-Type': 'application/json',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new FireAuth2Error({
        message: `revoke failed with status: ${response.status} ${response.statusText}`,
        code: mapHttpStatusToErrorCode(response.status),
        type: FireAuth2ErrorTypeEnum.Network,
      });
    }
  }

  async introspect(
    request: IntrospectTokenRequest,
  ): Promise<IntrospectTokenResponse> {
    const url = this.buildEndpointUrl(OAuthClientEndpoint.Introspection);
    const headers = await this.buildAuthHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams(request as Record<string, string>);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new FireAuth2Error({
        message: `introspect failed with status: ${response.status} ${response.statusText}`,
        code: mapHttpStatusToErrorCode(response.status),
        type: FireAuth2ErrorTypeEnum.Network,
      });
    }

    return await response.json();
  }

  private async buildAuthHeaders(
    extra: Record<string, string> = {},
  ): Promise<Record<string, string>> {
    const token = await this.#getIdToken();
    return {
      Authorization: `Bearer ${token}`,
      ...extra,
    };
  }

  private buildEndpointUrl(
    endpoint: OAuthClientEndpoint,
    params?: Params,
  ): string {
    const url = new URL(endpoint, this.#serverUrl);
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value != null) url.searchParams.append(key, `${value}`);
    });
    return url.toString();
  }

  async #getIdToken() {
    const idToken = await this.#idTokenPromise;
    assertNonEmptyIdToken(idToken);
    return idToken;
  }
}
