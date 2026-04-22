import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { decodeScore, encodeScore } from '../lib/score-codec';
import { signPublicSharePayload, verifyPublicShareToken } from '../lib/share-token';
import type { PublicSharePayload } from '../lib/types';

const sample: PublicSharePayload = {
  v: 1,
  issuedAt: 1713561600000,
  conceptName: 'PepeAI',
  total: 78,
  decision: 'Watch',
  reasons: [
    'Live coverage is partial right now, so the verdict stays conservative.',
    'Four.meme saturation is still low, so the narrative is not crowded yet.',
    'Timing lines up with current BNB Chain momentum.',
  ],
  dimensions: {
    memeEnergy: 16,
    narrativeAlpha: 14,
    dexgodTiming: 15,
    ctPotential: 17,
    wagmiFactor: 16,
  },
  archetype: 'Sleeping Giant',
  character: 'Chillguy',
  characterFile: 'chillguy.png',
  cardCopy: "You know something the market doesn't. Yet.",
  oracleVerdict: 'Quiet alpha before the move.',
  signals: {
    socialTrending: false,
    saturationLevel: 'LOW',
    timingLabel: 'OPTIMAL',
    ctBuzz: 'Quiet but constructive',
  },
  coverage: {
    status: 'partial',
    healthyCount: 4,
    degradedCount: 1,
    unavailableCount: 1,
  },
  evidence: [
    {
      key: 'googleTrends',
      label: 'Google Trends',
      health: 'ok',
      metric: 'Interest',
      detail: 'Steady attention with a small lift this week.',
      trend: 'rising',
      value: 68,
      chips: ['Search volume up', 'Breakout watch'],
    },
    {
      key: 'socialSignal',
      label: 'Social Signal',
      health: 'degraded',
      metric: 'Buzz',
      detail: 'Conversation exists but is not yet broad.',
      trend: 'stable',
    },
    {
      key: 'twitter',
      label: 'Twitter',
      health: 'ok',
      metric: 'Mentions',
      detail: 'Healthy mention velocity among niche accounts.',
      chips: ['KOL replies', 'Threaded mentions'],
    },
    {
      key: 'redditBuzz',
      label: 'Reddit Buzz',
      health: 'ok',
      metric: 'Mentions',
      detail: 'Organic subreddit chatter is beginning to form.',
      trend: 'rising',
    },
    {
      key: 'saturation',
      label: 'Saturation',
      health: 'unavailable',
      metric: 'Density',
      detail: 'Not enough market-wide coverage to score reliably.',
    },
    {
      key: 'dexscreener',
      label: 'Dexscreener',
      health: 'ok',
      metric: 'Momentum',
      detail: 'Liquidity and chart attention are moving in the right direction.',
      chips: ['Volume up', 'Pair watch'],
    },
  ],
};

const secret = 'test-secret';

function signRawJson(payloadJson: string, signingSecret: string): string {
  const payloadBase64 = Buffer.from(payloadJson, 'utf8').toString('base64url');
  const signature = createHmac('sha256', signingSecret).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

function mutateTokenSegment(token: string, segmentIndex: number): string {
  const segments = token.split('.');
  const segment = segments[segmentIndex];

  if (!segment) {
    throw new Error(`Missing token segment at index ${segmentIndex}`);
  }

  segments[segmentIndex] = `${segment.slice(0, 1) === 'a' ? 'b' : 'a'}${segment.slice(1)}`;
  return segments.join('.');
}

describe('share-token', () => {
  it('round-trips a valid signed public payload', () => {
    const token = signPublicSharePayload(sample, secret);
    expect(verifyPublicShareToken(token, secret)).toEqual(sample);
  });

  it('rejects a signed payload with malformed JSON', () => {
    const token = signRawJson('{"v":1,', secret);
    expect(verifyPublicShareToken(token, secret)).toBeNull();
  });

  it('rejects a signed payload with the wrong version', () => {
    const token = signRawJson(JSON.stringify({ ...sample, v: 2 }), secret);
    expect(verifyPublicShareToken(token, secret)).toBeNull();
  });

  it('rejects a signed payload with an invalid archetype', () => {
    const token = signRawJson(JSON.stringify({ ...sample, archetype: 'Not Real' }), secret);
    expect(verifyPublicShareToken(token, secret)).toBeNull();
  });

  it('rejects a signed payload with an invalid launch decision', () => {
    const token = signRawJson(JSON.stringify({ ...sample, decision: 'Send It' }), secret);
    expect(verifyPublicShareToken(token, secret)).toBeNull();
  });

  it('round-trips the public share payload shape through the codec wrapper', () => {
    const token = encodeScore(sample);
    expect(decodeScore(token)).toEqual(sample);
  });

  it('throws when the production share token secret is missing', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalSecret = process.env.SHARE_TOKEN_SECRET;

    process.env.NODE_ENV = 'production';
    delete process.env.SHARE_TOKEN_SECRET;

    try {
      expect(() => decodeScore('not!!valid')).toThrow('SHARE_TOKEN_SECRET is required in production');
    } finally {
      if (originalNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = originalNodeEnv;
      }
      if (originalSecret === undefined) {
        delete process.env.SHARE_TOKEN_SECRET;
      } else {
        process.env.SHARE_TOKEN_SECRET = originalSecret;
      }
    }
  });

  it('rejects a tampered payload', () => {
    const token = signPublicSharePayload(sample, secret);
    const tampered = mutateTokenSegment(token, 0);
    expect(verifyPublicShareToken(tampered, secret)).toBeNull();
  });

  it('rejects a tampered signature', () => {
    const token = signPublicSharePayload(sample, secret);
    const tampered = mutateTokenSegment(token, 1);
    expect(verifyPublicShareToken(tampered, secret)).toBeNull();
  });

  it('rejects a valid token when verified with the wrong secret', () => {
    const token = signPublicSharePayload(sample, secret);
    expect(verifyPublicShareToken(token, 'wrong-secret')).toBeNull();
  });
});
