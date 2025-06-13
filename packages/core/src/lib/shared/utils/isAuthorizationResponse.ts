import {
  AuthorizationErrorResponseParams,
  AuthorizationResponseParamKey,
  AuthorizationSuccessResponseParams,
} from '../../contracts';

/**
 * Check whether a given object represents a FireAuth2 authorization error response.
 */
export const isAuthorizationErrorResponse = (
  obj: unknown,
): obj is AuthorizationErrorResponseParams => {
  if (obj == null) return true;
  const hasError = Object.prototype.hasOwnProperty.call(obj, 'error');
  return hasError && (obj as never)['error'] != null;
};

/**
 * Check whether a given object represents a FireAuth2 authorization success response.
 */
export const isAuthorizationSuccessResponse = (
  obj: unknown,
): obj is AuthorizationSuccessResponseParams => {
  if (obj == null || typeof obj !== 'object') return false;
  if (isAuthorizationErrorResponse(obj)) return false;

  const requiredKeys = [
    AuthorizationResponseParamKey.AccessToken,
    AuthorizationResponseParamKey.IdToken,
    AuthorizationResponseParamKey.ExpiresIn,
    AuthorizationResponseParamKey.IssuedAt,
  ];

  return requiredKeys.every((key) => key in obj);
};
