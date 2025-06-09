
export type DecodedAccessToken = {
  sub: string;
  picture?: string;
  name?: string;
  locale?: string;
  given_name?: string;
  email?: string;
  email_verified?: boolean;
};

export type DecodedIdToken = {
  // Always-present fields
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;

  // Optional fields (may be undefined)
  at_hash?: string;
  azp?: string;
  email?: string;
  email_verified?: boolean;
  family_name?: string;
  given_name?: string;
  hd?: string;
  locale?: string;
  name?: string;
  nonce?: string;
  picture?: string;

  // Non-standard or undocumented fields
  nbf?: number;
  jti?: string;
};
