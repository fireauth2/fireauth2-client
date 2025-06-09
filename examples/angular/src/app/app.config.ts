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
import { provideFireAuth2 } from '@fireauth2/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // HttpClient is required for FireAuth2
    provideHttpClient(withFetch()),

    // Firebase setup
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'letterflow-dev',
        appId: '1:544886629086:web:2c238398d416c3458fd84f',
        storageBucket: 'letterflow-dev.appspot.com',
        apiKey: 'AIzaSyDphujp4rssVZqTKLbHyEz0NgJjsH0rvOc',
        authDomain: 'letterflow-dev.firebaseapp.com',
        messagingSenderId: '544886629086',
        measurementId: 'G-7RY0L3RFT9',
      }),
    ),
    providerFirebaseAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // FireAuth2
    provideFireAuth2({
      clientServerUrl: 'http://localhost:8080',
      redirectToAfterFinishLogin: '/',
      revokeTokensAfterLogout: false,
      cleanUpUrlFragmentAfterLogin: true,
      canRefreshBeforeExpiringInMins: 5,
    }),
  ],
};
