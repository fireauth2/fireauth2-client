import {
  FireAuthError,
  FireAuthErrorCodeEnum,
  FireAuthErrorTypeEnum,
} from '../../errors';

import { assertIsUrl } from './assertIsUrl';

export function assertValidServerUrl(url: unknown): asserts url is string {
  assertIsUrl(url);

  const { protocol, hostname } = new URL(url);
  const isLoopback = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname);

  if (!isLoopback && protocol !== 'https:') {
    throw new FireAuthError({
      message: `Insecure server URL: "${url}". Use HTTPS for all non-localhost environments.`,
      code: FireAuthErrorCodeEnum.InternalError,
      type: FireAuthErrorTypeEnum.Internal,
    });
  }
}
