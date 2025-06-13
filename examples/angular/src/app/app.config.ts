import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAuth,
  provideAuth as providerFirebaseAuth,
} from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideFireAuth } from '@fireauth2/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // HttpClient is required for FireAuth2
    provideHttpClient(withFetch()),

    // Firebase setup
    provideFirebaseApp(() => initializeApp(process.env.firebase)),
    providerFirebaseAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // FireAuth2
    provideFireAuth({
      clientServerUrl:
        process.env?.fireauth?.serverUrl ?? 'http://localhost:8080',
      redirectToAfterFinishLogin: '/',
      revokeTokensAfterLogout: false,
      cleanUpUrlFragmentAfterLogin: true,
      canRefreshBeforeExpiringInMins: 5,
    }),
  ],
};
