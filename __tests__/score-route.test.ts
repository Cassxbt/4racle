import { describe, expect, it } from 'vitest';
import {
  buildPublicReasons,
  buildCoverageSummary,
  buildPublicSharePayload,
  buildSignalEvidence,
  canScoreWithCoverage,
  deriveLaunchDecision,
  type SignalHealthMap,
} from '../lib/score-payload';
import type { SignalData } from '../lib/types';

const healthyMap: SignalHealthMap = {
  googleTrends: 'ok',
  socialSignal: 'ok',
  twitter: 'ok',
  redditBuzz: 'ok',
  saturation: 'ok',
  dexscreener: 'ok',
};

const sampleSignals: SignalData = {
  googleTrends: { score: 72, trend: 'rising' },
  socialSignal: { score: 19, trending: true, label: 'trending' },
  redditBuzz: { score: 8, mentions: 4, topSubreddit: 'memecoins' },
  saturation: { score: 19, tokenCount: 2, level: 'LOW' },
  dexscreener: { score: 13, graduatingNarratives: ['chill', 'vibes'], alignment: 2 },
  twitter: { score: 15, mentions: 8, sentiment: 'bullish', label: 'early whispers' },
};

describe('score-route coverage', () => {
  it('rejects scoring when too few live sources are available', () => {
    const allowed = canScoreWithCoverage({
      googleTrends: 'ok',
      socialSignal: 'unavailable',
      twitter: 'unavailable',
      redditBuzz: 'unavailable',
      saturation: 'ok',
      dexscreener: 'unavailable',
    });

    expect(allowed).toBe(false);
  });

  it('marks coverage as partial when degraded sources are present', () => {
    const coverage = buildCoverageSummary({
      ...healthyMap,
      socialSignal: 'degraded',
    });

    expect(coverage.status).toBe('partial');
    expect(coverage.degradedCount).toBe(1);
    expect(coverage.healthyCount).toBe(5);
    expect(coverage.unavailableCount).toBe(0);
  });
});

describe('score-route payload helpers', () => {
  it('derives launch decisions deterministically from score and coverage', () => {
    expect(deriveLaunchDecision(88, buildCoverageSummary(healthyMap))).toBe('Launch');
    expect(deriveLaunchDecision(72, buildCoverageSummary(healthyMap))).toBe('Watch');
    expect(deriveLaunchDecision(48, buildCoverageSummary(healthyMap))).toBe('Do Not Launch Yet');
    expect(
      deriveLaunchDecision(
        88,
        buildCoverageSummary({
          ...healthyMap,
          twitter: 'degraded',
        })
      )
    ).toBe('Watch');
  });

  it('builds six signal evidence cards for the result page', () => {
    const evidence = buildSignalEvidence(sampleSignals, healthyMap);

    expect(evidence).toHaveLength(6);
    expect(evidence.map((item) => item.label)).toContain('Google Trends');
    expect(evidence.map((item) => item.label)).toContain('Four.meme Saturation');
  });

  it('builds concise public reasons from public evidence and coverage', () => {
    const coverage = buildCoverageSummary({
      ...healthyMap,
      twitter: 'degraded',
    });
    const evidence = buildSignalEvidence(sampleSignals, healthyMap);
    const reasons = buildPublicReasons({
      total: 88,
      decision: deriveLaunchDecision(88, coverage),
      signals: {
        socialTrending: true,
        saturationLevel: 'LOW',
        timingLabel: 'OPTIMAL',
        ctBuzz: 'CT is watching',
      },
      coverage,
      evidence,
    });

    expect(reasons).toHaveLength(3);
    expect(reasons[0]).toContain('coverage');
  });

  it('builds the expected public share payload shape', () => {
    const payload = buildPublicSharePayload({
      conceptName: 'Chill Guy',
      total: 85,
      decision: 'Launch',
      reasons: [
        'Four.meme saturation is still low, so the narrative is not crowded yet.',
        'Timing lines up with current BNB Chain momentum.',
        'The overall score clears the launch threshold with room to spare.',
      ],
      dimensions: {
        memeEnergy: 18,
        narrativeAlpha: 16,
        dexgodTiming: 17,
        ctPotential: 17,
        wagmiFactor: 17,
      },
      archetypeInfo: {
        archetype: 'Actually Alpha',
        character: 'Rare Pepe',
        characterFile: 'rare-pepe.png',
        cardCopy: "Rare. Move fast. This isn't priced in yet.",
        emoji: '🎩',
      },
      oracleVerdict: 'Strong timing and clean narrative setup.',
      signals: {
        socialTrending: true,
        saturationLevel: 'LOW',
        timingLabel: 'OPTIMAL',
        ctBuzz: 'CT is watching',
      },
      coverage: buildCoverageSummary(healthyMap),
      evidence: buildSignalEvidence(sampleSignals, healthyMap),
      issuedAt: 1713744000000,
    });

    expect(payload).toMatchObject({
      v: 1,
      issuedAt: 1713744000000,
      conceptName: 'Chill Guy',
      total: 85,
      decision: 'Launch',
      archetype: 'Actually Alpha',
      character: 'Rare Pepe',
      characterFile: 'rare-pepe.png',
    });
    expect(payload.reasons).toHaveLength(3);
    expect(payload.evidence).toHaveLength(6);
  });
});
