import {
  FireAuth2Error,
  FireAuth2ErrorCodeEnum,
  FireAuth2ErrorTypeEnum,
} from '../../errors';

/**
 * Asserts that the given value is a non-empty string Firebase ID token.
 * Throws a FireAuth2Error if invalid.
 *
 * @param value The unknown value to validate as an ID token.
 * @param paramName Optional name for better error messages.
 */
export function assertNonEmptyIdToken(
  value: unknown,
  paramName = 'idToken',
): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new FireAuth2Error({
      message: `"${paramName}" must be a non-empty string representing a valid ID token.`,
      code: FireAuth2ErrorCodeEnum.Unauthorized,
      type: FireAuth2ErrorTypeEnum.Auth,
    });
  }
}
