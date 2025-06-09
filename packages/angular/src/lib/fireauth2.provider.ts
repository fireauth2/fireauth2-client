import {
  assertInInjectionContext,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  Provider,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import {
  FireAuth2Client,
  IndexedDBTokenStore,
  InMemoryTokenStore,
} from '@fireauth2/core';
import { defaultFireAuth2Config, FireAuth2Config } from './fireauth2-config';
import { FireAuth2 } from './fireauth2.service';
import { FIREAUTH2_CLIENT, FIREAUTH2_CONFIG, FIREAUTH2_TOKEN_STORE } from './fireauth2.tokens';

export function injectFireAuth2(): FireAuth2 {
  assertInInjectionContext(injectFireAuth2);
  return inject(FireAuth2);
}

export function provideFireAuth2(config: FireAuth2Config): Provider {
  const resolvedConfig = { ...defaultFireAuth2Config, ...config };

  return [
    makeEnvironmentProviders([
      {
        provide: FIREAUTH2_TOKEN_STORE,
        // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
        useFactory: (platformId: Object) => {
          if (isPlatformBrowser(platformId)) {
            return new IndexedDBTokenStore();
          }
          return new InMemoryTokenStore();
        },
        deps: [PLATFORM_ID],
      },
      {
        provide: FIREAUTH2_CONFIG,
        useValue: resolvedConfig,
      },
      {
        provide: FIREAUTH2_CLIENT,
        useFactory: (auth: Auth, serverConfig: FireAuth2Config) => {
          const getIdTokenFn = () => auth.currentUser?.getIdToken();
          const client = new FireAuth2Client({
            serverUrl: serverConfig.clientServerUrl?.toString(),
            getIdToken: getIdTokenFn,
          });
          return client;
        },
        deps: [Auth, FIREAUTH2_CONFIG],
      },
      FireAuth2,
    ]),
  ];
}
