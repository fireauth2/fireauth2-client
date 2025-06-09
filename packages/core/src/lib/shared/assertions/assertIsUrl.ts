import {
  FireAuth2Error,
  FireAuth2ErrorCodeEnum,
  FireAuth2ErrorTypeEnum,
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
    throw new FireAuth2Error({
      message: `Invalid URL: "${url}"`,
      code: FireAuth2ErrorCodeEnum.InvalidRequest,
      type: FireAuth2ErrorTypeEnum.Request,
      cause: error instanceof Error ? error : undefined,
    });
  }
}
