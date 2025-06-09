import { DecodedAccessToken, DecodedIdToken } from './AuthToken';

export type IntrospectTokenResponse = DecodedAccessToken | DecodedIdToken;
