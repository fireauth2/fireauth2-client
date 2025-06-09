import { DOCUMENT, inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential,
} from '@angular/fire/auth';
import {
  AuthorizationSuccessResponseParams,
  extractAuthorizationResponse,
  GetAuthorizationUrlRequest,
  IntrospectTokenTypeHint,
  isAuthorizationSuccessResponse,
  isTokenExpiringSoon,
  removeAuthorizationResponseParams,
} from '@fireauth2/core';

import { Router, UrlTree } from '@angular/router';
import {
  FIREAUTH2_CLIENT,
  FIREAUTH2_CONFIG,
  FIREAUTH2_TOKEN_STORE,
} from './fireauth2.tokens';

export type LogoutOptions = {
  revokeTokens?: 'accessToken' | boolean;
};

@Injectable()
export class FireAuth2 {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly auth = inject(Auth);
  private readonly client = inject(FIREAUTH2_CLIENT);
  private readonly tokenStore = inject(FIREAUTH2_TOKEN_STORE);
  private readonly config = inject(FIREAUTH2_CONFIG);

  async getAccessToken(): Promise<string | null> {
    const token = await this.tryRefreshToken();
    return token?.access_token as never;
  }

  async getIdToken(): Promise<string | null> {
    const token = await this.tryRefreshToken();
    return token?.id_token as never;
  }

  async getTokenInfo() {
    const token = await this.tokenStore.get();
    if (token?.access_token) {
      try {
        await this.client.introspect({
          token: token.id_token,
          token_type_hint: IntrospectTokenTypeHint.IdToken,
        });
      } catch {
        await this.tokenStore.set(null);
      }
    }
  }

  async login(request: GetAuthorizationUrlRequest): Promise<void> {
    const url = await this.client.getAuthorizationUrl(request);
    this.document.defaultView?.location.replace(url);
    return;
  }

  async logout(options?: LogoutOptions) {
    await this.auth.signOut();
    await this.tokenStore.clear();

    const skipTokensRevocation =
      options?.revokeTokens === false ||
      this.config.revokeTokensAfterLogout === false;

    if (skipTokensRevocation) return;

    const shouldRevokeAccessToken =
      options?.revokeTokens === 'accessToken' ||
      this.config.revokeTokensAfterLogout === 'accessToken';

    const shouldRevokeAllTokens =
      shouldRevokeAccessToken && this.config.revokeTokensAfterLogout === true;

    await this.revokeAccessToken(shouldRevokeAllTokens);
  }

  async tryFinishLogin(): Promise<void> {
    await this.auth.authStateReady();
    if (this.auth.currentUser) {
      // User already signed in
      return;
    }

    const token = extractAuthorizationResponse(this.document.location.href);
    if (token == null) {
      return;
    }

    const isResponseError = !isAuthorizationSuccessResponse(token);
    if (isResponseError) {
      throw new Error(token?.error);
    }

    await this.signInToFirebaseWithIdToken(token.id_token);
    await this.tokenStore.set(token);

    // Clean-up URL fragment if applicable.
    // Note that we call this AFTER signing in to Firebase.
    if (this.config.cleanUpUrlFragmentAfterLogin) {
      removeAuthorizationResponseParams();
    }

    if (this.config.redirectToAfterFinishLogin) {
      const urlSegmentsOrTree = this.config.redirectToAfterFinishLogin;
      if (
        urlSegmentsOrTree instanceof UrlTree ||
        typeof urlSegmentsOrTree === 'string'
      ) {
        this.router.navigateByUrl(urlSegmentsOrTree);
      } else if (Array.isArray(urlSegmentsOrTree)) {
        this.router.navigate(urlSegmentsOrTree);
      }
    }
  }

  async tryRefreshToken(): Promise<AuthorizationSuccessResponseParams> {
    const token = await this.tokenStore.get();

    const canRefresh = await this.canRefreshAccessToken(token);
    if (canRefresh) {
      console.log('Refreshing token...');
      return this.refreshAccessToken();
    }

    return token as AuthorizationSuccessResponseParams;
  }

  private async canRefreshAccessToken(
    token: AuthorizationSuccessResponseParams | null,
  ): Promise<boolean> {
    if (this.auth.currentUser == null) return false;
    if (token == null) return true;

    return isTokenExpiringSoon(
      token.issued_at,
      token.expires_in,
      this.config.canRefreshBeforeExpiringInMins ?? 5,
    );
  }

  private async refreshAccessToken(): Promise<AuthorizationSuccessResponseParams> {
    const response = await this.client.exchangeRefreshToken();
    await this.tokenStore.set(response);
    return response;
  }

  private async revokeAccessToken(revokeRefreshToken?: boolean) {
    try {
      const token = await this.tokenStore.get();
      if (token == null) {
        return;
      }

      await this.client.revoke({
        access_token: token.access_token,
        revoke_refresh_token: revokeRefreshToken,
      });
    } finally {
      await this.tokenStore.clear();
    }
  }

  private async signInToFirebaseWithIdToken(
    idToken: string,
  ): Promise<UserCredential> {
    return this.signInToFirebase(idToken);
  }

  private async signInToFirebase(
    idToken?: string | null,
    accessToken?: string | null,
  ): Promise<UserCredential> {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(this.auth, credential);
    return userCredential;
  }
}
