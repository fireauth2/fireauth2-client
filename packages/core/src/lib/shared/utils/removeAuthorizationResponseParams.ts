import { AuthorizationResponseParamKey } from '../../contracts';
import { assertIsBrowserEnv } from '..';
import { parseHashParams } from './parseHashParams';

export function removeAuthorizationResponseParams() {
  assertIsBrowserEnv();

  const params = parseHashParams(window.location.hash);

  const keys = Object.values(AuthorizationResponseParamKey);
  keys.forEach((key) => params.delete(key));

  const updatedFragment = params.toString();
  const fullPath =
    window.location.pathname +
    window.location.search +
    (updatedFragment ? `#${updatedFragment}` : '');

  window.location.replace(fullPath);
}
