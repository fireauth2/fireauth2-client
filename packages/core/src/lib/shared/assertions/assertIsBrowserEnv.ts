import {
  FireAuthError,
  FireAuthErrorCodeEnum,
  FireAuthErrorTypeEnum,
} from '../../errors';

export function assertIsBrowserEnv(): void {
  const isMainThread =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isWorker =
    typeof self !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (self as any).importScripts === 'function';

  if (!isMainThread && !isWorker) {
    throw new FireAuthError({
      message:
        'Expected to be running in a browser main thread or Web Worker environment.',
      code: FireAuthErrorCodeEnum.InternalError,
      type: FireAuthErrorTypeEnum.Env,
    });
  }

  if (typeof fetch !== 'function' || typeof URL === 'undefined') {
    throw new FireAuthError({
      message:
        'Browser environment does not support required APIs (fetch, URL).',
      code: FireAuthErrorCodeEnum.InternalError,
      type: FireAuthErrorTypeEnum.Env,
    });
  }
}
