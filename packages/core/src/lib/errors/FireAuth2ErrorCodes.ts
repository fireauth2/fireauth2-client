export enum FireAuth2ErrorCodeEnum {
  Unauthenticated = 'unauthenticated',
  Unauthorized = 'unauthorized',
  TokenExpired = 'token_expired',
  InvalidToken = 'invalid_token',
  InvalidAuthResponseParam = 'invalid_auth_response_param',
  InvalidRequest = 'invalid_request',
  NetworkError = 'network_error',
  InternalError = 'internal_error',
  NotFound = 'not_found',
  Conflict = 'conflict',
  RateLimited = 'rate_limited',
  Unknown = 'unknown',
}

export type FireAuth2ErrorCode = `${FireAuth2ErrorCodeEnum}`;

/** Maps HTTP status codes to FireAuth2ErrorCodeEnum for better error semantics */
export function mapHttpStatusToErrorCode(
  status: number,
): FireAuth2ErrorCodeEnum {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        return FireAuth2ErrorCodeEnum.Unauthorized;
      case 403:
        return FireAuth2ErrorCodeEnum.Unauthorized;
      case 404:
        return FireAuth2ErrorCodeEnum.NotFound;
      case 409:
        return FireAuth2ErrorCodeEnum.Conflict;
      case 429:
        return FireAuth2ErrorCodeEnum.RateLimited;
      case 400:
        return FireAuth2ErrorCodeEnum.InvalidRequest;
      default:
        return FireAuth2ErrorCodeEnum.Unauthorized;
    }
  }
  if (status >= 500) {
    return FireAuth2ErrorCodeEnum.InternalError;
  }
  return FireAuth2ErrorCodeEnum.Unknown;
}
