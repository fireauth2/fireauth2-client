import { makeEnvironmentProviders, PLATFORM_ID, Provider } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import {
  FireAuthClient,
  IndexedDBTokenStore,
  InMemoryTokenStore,
} from '@fireauth2/core';
import { defaultFireAuthConfig, FireAuthConfig } from './fireauth-config';
import { FireAuth } from './fireauth.service';
import {
  FIREAUTH_CLIENT,
  FIREAUTH_CONFIG,
  FIREAUTH_TOKEN_STORE,
} from './fireauth.tokens';

const tokenStoreProvider: Provider = {
  provide: FIREAUTH_TOKEN_STORE,
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  useFactory: (platformId: Object) => {
    if (isPlatformBrowser(platformId)) {
      return new IndexedDBTokenStore();
    }
    return new InMemoryTokenStore();
  },
  deps: [PLATFORM_ID],
};

const fireAuthClientProvider: Provider = {
  provide: FIREAUTH_CLIENT,
  useFactory: (auth: Auth, serverConfig: FireAuthConfig) => {
    const getIdTokenFn = () => auth.currentUser?.getIdToken();
    const client = new FireAuthClient({
      serverUrl: serverConfig.clientServerUrl?.toString(),
      getIdToken: getIdTokenFn,
    });
    return client;
  },
  deps: [Auth, FIREAUTH_CONFIG],
};

export function provideFireAuth(config: FireAuthConfig): Provider {
  const resolvedConfig = { ...defaultFireAuthConfig, ...config };
  const fireAuthConfigProvider: Provider = {
    provide: FIREAUTH_CONFIG,
    useValue: resolvedConfig,
  };

  return [
    makeEnvironmentProviders([
      tokenStoreProvider,
      fireAuthConfigProvider,
      fireAuthClientProvider,
      FireAuth,
    ]),
  ];
}
