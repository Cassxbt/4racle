import { describe, it, expect } from 'vitest';
import { encodeScore, decodeScore } from '../lib/score-codec';
import { ScoreResult } from '../lib/types';

const sample: ScoreResult = {
  id: 'test-id-123',
  concept: { name: 'PepeAI', description: 'An AI meme coin', community: 'BSC degens' },
  total: 78,
  dimensions: { memeEnergy: 16, narrativeAlpha: 14, dexgodTiming: 15, ctPotential: 17, wagmiFactor: 16 },
  archetype: 'Sleeping Giant',
  character: 'Chillguy',
  characterFile: 'chillguy.png',
  cardCopy: "You know something the market doesn't. Yet.",
  oracleVerdict: 'Quiet alpha before the move.',
  signals: { socialTrending: false, saturationLevel: 'LOW', timingLabel: 'OPTIMAL' },
  createdAt: 1713561600000,
};

describe('score-codec', () => {
  it('round-trips a ScoreResult', () => {
    expect(decodeScore(encodeScore(sample))).toEqual(sample);
  });
  it('produces url-safe base64 (no +/=)', () => {
    const enc = encodeScore(sample);
    expect(enc).not.toMatch(/[+/=]/);
  });
  it('returns null for invalid input', () => {
    expect(decodeScore('not!!valid')).toBeNull();
    expect(decodeScore('')).toBeNull();
  });
});
