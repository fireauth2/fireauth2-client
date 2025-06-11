import { DOCUMENT, inject, Injectable } from '@angular/core';
import {
  Auth as AngularFireAuth,
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential,
} from '@angular/fire/auth';
import {
  AuthorizationSuccessResponseParams,
  extractAuthorizationResponse,
  Auth as FireAuthInterface,
  GetAuthorizationUrlRequest,
  IntrospectTokenResponse,
  IntrospectTokenTypeHint,
  isAuthorizationSuccessResponse,
  isTokenExpiringSoon,
  LogoutOptions,
  removeAuthorizationResponseParams,
  RevokeTokenOptions,
} from '@fireauth2/core';

import { Router, UrlTree } from '@angular/router';
import {
  FIREAUTH_CLIENT,
  FIREAUTH_CONFIG,
  FIREAUTH_TOKEN_STORE,
} from './fireauth.tokens';

@Injectable()
export class FireAuth implements FireAuthInterface {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly angularFireAuth = inject(AngularFireAuth);
  private readonly client = inject(FIREAUTH_CLIENT);
  private readonly tokenStore = inject(FIREAUTH_TOKEN_STORE);
  private readonly config = inject(FIREAUTH_CONFIG);

  async getAccessToken(): Promise<string | null> {
    const token = await this.tryRefreshAccessToken();
    return token?.access_token ?? null;
  }

  async getIdToken(): Promise<string | null> {
    const token = await this.tryRefreshAccessToken();
    return token?.id_token ?? null;
  }

  async getTokenInfo(): Promise<IntrospectTokenResponse | null> {
    const token = await this.tokenStore.get();
    if (token?.access_token == null) {
      return null;
    }
    
    return this.client.introspect({
      token: token.id_token,
      token_type_hint: IntrospectTokenTypeHint.IdToken,
    });
  }

  async startLogin(request: GetAuthorizationUrlRequest): Promise<void> {
    const url = await this.client.getAuthorizationUrl(request);
    this.document.defaultView?.location.replace(url);
    return;
  }

  async logout(options?: LogoutOptions): Promise<void> {
    try {
      await this.angularFireAuth.signOut();
      const skipTokensRevocation =
        options?.revokeTokens === false ||
        this.config.revokeTokensAfterLogout === false;

      if (skipTokensRevocation) return;

      const shouldRevokeAccessToken =
        options?.revokeTokens === 'accessToken' ||
        this.config.revokeTokensAfterLogout === 'accessToken';

      const revokeRefreshToken =
        shouldRevokeAccessToken && this.config.revokeTokensAfterLogout === true;

      await this.revokeAccessToken({ revokeRefreshToken });
    } finally {
      await this.tokenStore.clear();
    }

    return;
  }

  async tryFinishLogin(): Promise<
    AuthorizationSuccessResponseParams | undefined
  > {
    await this.angularFireAuth.authStateReady();
    if (this.angularFireAuth.currentUser) {
      // User already signed in
      return undefined;
    }

    console.log('LOCATION:HREF', this.document.location.href);

    const token = extractAuthorizationResponse(this.document.location.href);
    if (token == null) {
      return undefined;
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

    return token;
  }

  async tryRefreshAccessToken(): Promise<AuthorizationSuccessResponseParams> {
    const token = await this.tokenStore.get();

    const canRefresh = await this.canRefreshAccessToken(token);
    if (canRefresh) {
      console.log('Refreshing token...');
      return this.refreshAccessToken();
    }

    return token as AuthorizationSuccessResponseParams;
  }

  async refreshAccessToken(): Promise<AuthorizationSuccessResponseParams> {
    const response = await this.client.exchangeRefreshToken();
    await this.tokenStore.set(response);
    return response;
  }

  async canRefreshAccessToken(
    token: AuthorizationSuccessResponseParams | null,
  ): Promise<boolean> {
    if (this.angularFireAuth.currentUser == null) return false;
    if (token == null) return true;

    return isTokenExpiringSoon(
      token.issued_at,
      token.expires_in,
      this.config.canRefreshBeforeExpiringInMins ?? 5,
    );
  }

  async revokeAccessToken(options?: RevokeTokenOptions): Promise<void> {
    try {
      const token = await this.tokenStore.get();
      if (token == null) {
        return;
      }

      return this.client.revoke({
        access_token: token.access_token,
        revoke_refresh_token: options?.revokeRefreshToken,
      });
    } catch {
      return this.tokenStore.clear();
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
    const userCredential = await signInWithCredential(
      this.angularFireAuth,
      credential,
    );
    return userCredential;
  }
}
