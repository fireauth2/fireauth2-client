export enum FireAuthErrorCodeEnum {
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

export type FireAuth2ErrorCode = `${FireAuthErrorCodeEnum}`;

/** Maps HTTP status codes to FireAuth2ErrorCodeEnum for better error semantics */
export function mapHttpStatusToErrorCode(
  status: number,
): FireAuthErrorCodeEnum {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        return FireAuthErrorCodeEnum.Unauthorized;
      case 403:
        return FireAuthErrorCodeEnum.Unauthorized;
      case 404:
        return FireAuthErrorCodeEnum.NotFound;
      case 409:
        return FireAuthErrorCodeEnum.Conflict;
      case 429:
        return FireAuthErrorCodeEnum.RateLimited;
      case 400:
        return FireAuthErrorCodeEnum.InvalidRequest;
      default:
        return FireAuthErrorCodeEnum.Unauthorized;
    }
  }
  if (status >= 500) {
    return FireAuthErrorCodeEnum.InternalError;
  }
  return FireAuthErrorCodeEnum.Unknown;
}
