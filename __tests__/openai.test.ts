import { afterEach, describe, expect, it, vi } from 'vitest';
import { callOpenAI } from '../lib/openai';
import type { ConceptInput, SignalData } from '../lib/types';

const originalOpenAIKey = process.env.OPENAI_API_KEY;

const concept: ConceptInput = {
  name: 'Chill Guy',
  description: 'A calm meme coin for BNB Chain.',
  community: 'BNB degens',
};

const signals: SignalData = {
  googleTrends: { score: 72, trend: 'rising' },
  socialSignal: { score: 19, trending: true, label: 'trending' },
  redditBuzz: { score: 8, mentions: 4, topSubreddit: 'memecoins' },
  saturation: { score: 19, tokenCount: 2, level: 'LOW' },
  dexscreener: { score: 13, graduatingNarratives: ['chill', 'vibes'], alignment: 2 },
  twitter: { score: 15, mentions: 8, sentiment: 'bullish', label: 'early whispers' },
};

afterEach(() => {
  vi.restoreAllMocks();
  if (originalOpenAIKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = originalOpenAIKey;
  }
});

describe('openai client', () => {
  it('turns timeout failures into a clear error', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(Object.assign(new Error('The operation timed out'), { name: 'TimeoutError' }))
    );

    await expect(callOpenAI(concept, signals)).rejects.toThrow('OpenAI scoring request timed out');
  });
});
