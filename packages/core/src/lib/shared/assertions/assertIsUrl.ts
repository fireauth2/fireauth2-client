import {
  FireAuthError,
  FireAuthErrorCodeEnum,
  FireAuthErrorTypeEnum,
} from '../../errors';

/**
 * Asserts that the given URL is secure unless explicitly running on localhost or loopback IPs.
 * @param url The server URL to validate.
 * @throws FireAuth2Error if the URL is invalid or insecure in production.
 */
export function assertIsUrl(url: unknown): asserts url is string | URL {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((url as any) instanceof URL) {
    return;
  }

  try {
    new URL(url as never);
  } catch (error) {
    throw new FireAuthError({
      message: `Invalid URL: "${url}"`,
      code: FireAuthErrorCodeEnum.InvalidRequest,
      type: FireAuthErrorTypeEnum.Request,
      cause: error instanceof Error ? error : undefined,
    });
  }
}
