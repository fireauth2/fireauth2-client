import {
  FireAuthError,
  FireAuthErrorCodeEnum,
  FireAuthErrorTypeEnum,
} from '../../errors';

/**
 * Asserts that the given value is a function of specified type `T`.
 * Throws FireAuth2Error if this condition is not met.
 *
 * @param value The value to check.
 * @param paramName Optional parameter name to include in the error message.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function assertIsFunction<T extends Function>(
  value: unknown,
  paramName = 'value',
): asserts value is T {
  if (typeof value !== 'function') {
    throw new FireAuthError({
      message: `Expected "${paramName}" to be a function, but received ${typeof value}.`,
      code: FireAuthErrorCodeEnum.InternalError,
      type: FireAuthErrorTypeEnum.Internal,
    });
  }
}
