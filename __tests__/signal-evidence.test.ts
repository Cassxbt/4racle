import { describe, expect, it } from 'vitest';
import { buildSignalEvidence } from '../lib/score-payload';

describe('signal evidence', () => {
  it('builds six evidence cards for the result page', () => {
    const evidence = buildSignalEvidence(
      {
        googleTrends: { score: 72, trend: 'rising' },
        socialSignal: { score: 19, trending: true, label: 'trending' },
        redditBuzz: { score: 8, mentions: 4, topSubreddit: 'memecoins' },
        saturation: { score: 19, tokenCount: 2, level: 'LOW' },
        dexscreener: { score: 13, graduatingNarratives: ['chill', 'vibes'], alignment: 2 },
        twitter: { score: 15, mentions: 8, sentiment: 'bullish', label: 'early whispers' },
      },
      {
        googleTrends: 'ok',
        socialSignal: 'ok',
        twitter: 'ok',
        redditBuzz: 'ok',
        saturation: 'ok',
        dexscreener: 'ok',
      }
    );

    expect(evidence).toHaveLength(6);
    expect(evidence.map((item) => item.label)).toContain('Google Trends');
    expect(evidence.map((item) => item.label)).toContain('Four.meme Saturation');
  });
});
