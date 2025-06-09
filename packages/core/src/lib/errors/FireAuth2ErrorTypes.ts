export enum FireAuth2ErrorTypeEnum {
  Auth = 'auth',
  AuthResponse = 'auth_response',
  Token = 'token',
  Network = 'network',
  Request = 'request',
  Server = 'server',
  RateLimit = 'rate_limit',
  NotFound = 'not_found',
  Conflict = 'conflict',
  Internal = 'internal',
  Env = 'environment',
  Unknown = 'unknown',
}

export type FireAuth2ErrorType = `${FireAuth2ErrorTypeEnum}`;
