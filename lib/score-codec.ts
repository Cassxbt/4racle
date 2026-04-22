import { signPublicSharePayload, verifyPublicShareToken } from './share-token';
import type { PublicSharePayload } from './types';

export function encodeScore(payload: PublicSharePayload): string {
  return signPublicSharePayload(payload, getShareTokenSecret());
}

export function decodeScore(encoded: string): PublicSharePayload | null {
  return verifyPublicShareToken(encoded, getShareTokenSecret());
}

function getShareTokenSecret(): string {
  const secret = process.env.SHARE_TOKEN_SECRET;
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SHARE_TOKEN_SECRET is required in production');
  }

  return 'dev-share-token-secret';
}
