import { InjectionToken } from '@angular/core';
import { AuthTokenStore, OAuthClient, OAuthClientConfig } from '@fireauth2/core';
import { FireAuth2Config } from './fireauth2-config';

export const FIREAUTH2_TOKEN_STORE = new InjectionToken<AuthTokenStore>(
  'FIREAUTH2_TOKEN_STORE',
);

export const FIREAUTH2_CONFIG = new InjectionToken<FireAuth2Config>(
  'FIREAUTH2_CONFIG',
);

export const FIREAUTH2_CLIENT = new InjectionToken<OAuthClient>(
  'FIREAUTH2_CLIENT',
);

export const FIREAUTH2_CLIENT_CONFIG = new InjectionToken<OAuthClientConfig>(
  'FIREAUTH2_CLIENT_CONFIG',
);
