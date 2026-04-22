import { describe, it, expect } from 'vitest';
import { encodeScore, decodeScore } from '../lib/score-codec';
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
  dimensions: { memeEnergy: 16, narrativeAlpha: 14, dexgodTiming: 15, ctPotential: 17, wagmiFactor: 16 },
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
  ],
};

describe('score-codec', () => {
  it('round-trips a signed public share payload', () => {
    expect(decodeScore(encodeScore(sample))).toEqual(sample);
  });
  it('produces a url-safe token (no +/=)', () => {
    const enc = encodeScore(sample);
    expect(enc).not.toMatch(/[+/=]/);
  });
  it('returns null for invalid input', () => {
    expect(decodeScore('not!!valid')).toBeNull();
    expect(decodeScore('')).toBeNull();
  });
});
