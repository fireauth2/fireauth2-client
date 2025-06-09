export type AuthorizationErrorResponseParams = {
  error: string;
};

/**
 * Defines the keys for expected parameters in an OAuth 2.0 Authorization Response.
 * Using an enum provides type safety and prevents typos compared to string constants.
 */
export enum AuthorizationResponseParamKey {
  Error = 'error',
  AccessToken = 'access_token',
  IdToken = 'id_token',
  ExpiresIn = 'expires_in',
  IssuedAt = 'issued_at',
}

export type AuthorizationSuccessResponseParams = {
  [AuthorizationResponseParamKey.AccessToken]: string;
  [AuthorizationResponseParamKey.IdToken]: string;
  [AuthorizationResponseParamKey.ExpiresIn]: number;
  [AuthorizationResponseParamKey.IssuedAt]: number;
};

export type AuthorizationResponseParams =
  | AuthorizationErrorResponseParams
  | AuthorizationSuccessResponseParams;
