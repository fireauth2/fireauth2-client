/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  Auth,
  getIdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  AuthorizationSuccessResponseParams,
  isTokenExpiringSoon,
} from '@fireauth2/core';
import { of } from 'rxjs';
import { FireAuth } from './fireauth.service';
import {
  FIREAUTH_CLIENT,
  FIREAUTH_CONFIG,
  FIREAUTH_TOKEN_STORE,
} from './fireauth.tokens';

jest.mock('@angular/fire/auth', () => {
  return {
    Auth: jest.fn(),
    getIdTokenResult: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    signInWithCredential: jest.fn(),
    user: jest.fn(() => of(null)),
    GoogleAuthProvider: class MockedGoogleProvider {
      static credential() {
        return undefined;
      }
    },
  };
});

jest.mock('@fireauth2/core', () => ({
  isTokenExpiring: jest.fn(),
  isTokenExpiringSoon: jest.fn(),
}));

describe('FireAuth', () => {
  // Mock implementations for the AngularFire functions
  (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
    {} as UserCredential,
  );
  (signOut as jest.Mock).mockResolvedValue(undefined);
  (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
  (getIdTokenResult as jest.Mock).mockResolvedValue({
    claims: {
      role: 'user',
    },
  });
  (user as jest.Mock).mockReturnValue(of(null));

  let fireAuth: FireAuth;
  let authMock: jest.Mocked<Auth>;

  const mockRouter = {
    navigateByUrl: jest.fn(),
    navigate: jest.fn(),
  };

  const mockConfig = {
    revokeTokensAfterLogout: true,
    cleanUpUrlFragmentAfterLogin: true,
    canRefreshBeforeExpiringInMins: 5,
  };

  const mockTokenStore = {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  };

  const mockClient = {
    introspect: jest.fn(),
    getAuthorizationUrl: jest.fn(),
    exchangeRefreshToken: jest.fn(),
    revoke: jest.fn(() => mockTokenStore.clear()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: {} },
        {
          provide: DOCUMENT,
          useValue: global.document,
        },
        FireAuth,
        { provide: FIREAUTH_CLIENT, useValue: mockClient },
        { provide: FIREAUTH_TOKEN_STORE, useValue: mockTokenStore },
        { provide: FIREAUTH_CONFIG, useValue: mockConfig },
      ],
    });

    fireAuth = TestBed.inject(FireAuth);
    authMock = TestBed.inject(Auth) as jest.Mocked<Auth>;
    authMock.authStateReady = jest.fn().mockResolvedValue(undefined);
  });

  describe('refreshAccessToken', () => {
    const mockResponse: AuthorizationSuccessResponseParams = {
      access_token: 'ACCESS_TOKEN',
      expires_in: 3600,
      issued_at: Math.floor(Date.now() / 1000),
      id_token: 'ID_TOKEN',
    };

    it('should exchange refresh token and store the response', async () => {
      (mockClient.exchangeRefreshToken as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await fireAuth.refreshAccessToken();

      expect(mockClient.exchangeRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockTokenStore.set).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });

    it('should throw if exchangeRefreshToken fails', async () => {
      const error = new Error('Token exchange failed');
      (mockClient.exchangeRefreshToken as jest.Mock).mockRejectedValue(error);

      await expect(fireAuth.refreshAccessToken()).rejects.toThrow(
        'Token exchange failed',
      );
    });
  });

  it('should return null if no access_token is available', async () => {
    (mockTokenStore.get as jest.Mock).mockResolvedValueOnce(null);
    const result = await fireAuth.getAccessToken();
    expect(result).toBeNull();
  });

  it('should return null if no id_token is available', async () => {
    (mockTokenStore.get as jest.Mock).mockResolvedValueOnce(null);
    const result = await fireAuth.getAccessToken();
    expect(result).toBeNull();
  });

  describe('canRefreshAccessToken', () => {
    beforeEach(() => {
      (fireAuth as any)['clientConfig'] = { canRefreshBeforeExpiringInMins: 5 };
    });

    it('should return false if current user is null', async () => {
      (fireAuth['angularFireAuth'] as any).currentUser = null;
      const result = await fireAuth.canRefreshAccessToken(null);
      expect(result).toBe(false);
    });

    it('should return true if token is null and user exists', async () => {
      (fireAuth['angularFireAuth'] as any).currentUser = { uid: 'abc' };
      const result = await fireAuth.canRefreshAccessToken(null);
      expect(result).toBe(true);
    });

    it('should call isTokenExpiringSoon when token is provided', async () => {
      (fireAuth['angularFireAuth'] as any).currentUser = { uid: 'abc' };

      const mockToken = {
        access_token: 'access',
        id_token: 'some-claims-token',
        issued_at: Date.now() / 1000 - 60, // 1 min ago
        expires_in: 300, // 5 minutes
      };

      (isTokenExpiringSoon as jest.Mock).mockReturnValue(true);

      const result = await fireAuth.canRefreshAccessToken(mockToken);
      expect(isTokenExpiringSoon).toHaveBeenCalledWith(
        mockToken.issued_at,
        mockToken.expires_in,
        5,
      );
      expect(result).toBe(true);
    });
  });

  describe('revokeAccessToken', () => {
    it('should do nothing if no token is available', async () => {
      (mockTokenStore.get as jest.Mock).mockResolvedValueOnce(null);

      await fireAuth.revokeAccessToken();

      expect(mockClient.revoke).not.toHaveBeenCalled();
      expect(mockTokenStore.clear).not.toHaveBeenCalled();
    });

    it('should call client.revoke with access_token', async () => {
      (mockTokenStore.get as jest.Mock).mockResolvedValueOnce({
        access_token: 'ACCESS',
        id_token: 'ID',
      });

      await fireAuth.revokeAccessToken();

      expect(mockClient.revoke).toHaveBeenCalledWith({
        access_token: 'ACCESS',
        revoke_refresh_token: undefined,
      });
    });

    it('should call client.revoke with revoke_refresh_token = true when specified', async () => {
      (mockTokenStore.get as jest.Mock).mockResolvedValueOnce({
        access_token: 'ACCESS',
        id_token: 'ID',
      });

      await fireAuth.revokeAccessToken({ revokeRefreshToken: true });

      expect(mockClient.revoke).toHaveBeenCalledWith({
        access_token: 'ACCESS',
        revoke_refresh_token: true,
      });
    });

    it('should clear token store if client.revoke throws', async () => {
      await (mockTokenStore.set as jest.Mock)({
        access_token: 'ABC',
        expires_in: 3600,
        id_token: 'ID',
      });

      (mockClient.revoke as jest.Mock).mockRejectedValue(new Error('fails'));

      await fireAuth.revokeAccessToken();
      expect(mockClient.revoke).toHaveBeenCalled();
      expect(mockTokenStore.clear).toHaveBeenCalled();
    });
  });
});
