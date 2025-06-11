import { InjectionToken } from '@angular/core';
import {
  AuthTokenStore,
  OAuthClient,
  OAuthClientConfig,
} from '@fireauth2/core';
import { FireAuthConfig } from './fireauth-config';

export const FIREAUTH_TOKEN_STORE = new InjectionToken<AuthTokenStore>(
  'FIREAUTH_TOKEN_STORE',
);

export const FIREAUTH_CONFIG = new InjectionToken<FireAuthConfig>(
  'FIREAUTH_CONFIG',
);

export const FIREAUTH_CLIENT = new InjectionToken<OAuthClient>(
  'FIREAUTH_CLIENT',
);

export const FIREAUTH_CLIENT_CONFIG = new InjectionToken<OAuthClientConfig>(
  'FIREAUTH_CLIENT_CONFIG',
);
