import {
  FireAuthError,
  FireAuthErrorCodeEnum,
  FireAuthErrorTypeEnum,
} from '../../errors';

/**
 * Asserts that a given authorization parameter is a non-empty string.
 *
 * @param name The name of the parameter (e.g. "access_token").
 * @param value The parameter value to validate.
 * @throws FireAuth2Error if the parameter is missing or a non-empty string.
 */
export function assertIsNonEmptyAuthorizationParam(
  name: string,
  value: string | null,
): asserts value is string {
  if (value === null || value === undefined || value.trim() === '') {
    throw new FireAuthError({
      message: `Missing or empty "${name}" parameter in authorization response`,
      code: FireAuthErrorCodeEnum.InvalidAuthResponseParam,
      type: FireAuthErrorTypeEnum.AuthResponse,
    });
  }
}
