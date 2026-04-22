import type { ArchetypeInfo } from './archetype';
import type {
  LaunchDecision,
  PublicSharePayload,
  PublicSignalSummary,
  SignalCoverage,
  SignalData,
  SignalEvidenceItem,
  SignalHealth,
} from './types';

export interface SignalHealthMap {
  googleTrends: SignalHealth;
  socialSignal: SignalHealth;
  twitter: SignalHealth;
  redditBuzz: SignalHealth;
  saturation: SignalHealth;
  dexscreener: SignalHealth;
}

export function deriveLaunchDecision(total: number, coverage: SignalCoverage): LaunchDecision {
  if (coverage.status === 'partial' && total >= 80) {
    return 'Watch';
  }

  if (total >= 85) {
    return 'Launch';
  }

  if (total >= 60) {
    return 'Watch';
  }

  return 'Do Not Launch Yet';
}

export function buildPublicReasons(args: {
  total: number;
  decision: LaunchDecision;
  signals: PublicSignalSummary;
  coverage: SignalCoverage;
  evidence: SignalEvidenceItem[];
}): string[] {
  const reasons: string[] = [];

  if (args.coverage.status === 'partial') {
    reasons.push('Live coverage is partial right now, so the verdict stays conservative.');
  }

  if (args.signals.saturationLevel === 'LOW') {
    reasons.push('Four.meme saturation is still low, so the narrative is not crowded yet.');
  } else if (args.signals.saturationLevel === 'HIGH') {
    reasons.push('Four.meme saturation is high, so this narrative already looks crowded.');
  }

  if (args.signals.timingLabel === 'OPTIMAL') {
    reasons.push('Timing lines up with current BNB Chain momentum.');
  } else if (args.signals.timingLabel === 'EARLY') {
    reasons.push('The narrative looks early, which can be good if momentum confirms.');
  } else if (args.signals.timingLabel === 'LATE' || args.signals.timingLabel === 'MISS') {
    reasons.push('Timing is not ideal yet, so patience matters more than speed.');
  }

  if (args.signals.socialTrending || args.signals.ctBuzz === 'CT is watching') {
    reasons.push('Social attention is already forming across momentum feeds and CT.');
  }

  if (args.decision === 'Launch' && args.total >= 85) {
    reasons.push('The overall score clears the launch threshold with room to spare.');
  }

  if (args.decision === 'Do Not Launch Yet') {
    reasons.push('The current signal mix is too weak to justify a confident launch.');
  }

  if (reasons.length < 3) {
    const strongestEvidence = args.evidence
      .filter((item) => item.health === 'ok')
      .sort((left, right) => (right.value ?? 0) - (left.value ?? 0))
      .slice(0, 3);

    for (const item of strongestEvidence) {
      reasons.push(`${item.label} currently supports the thesis: ${item.detail}`);
      if (reasons.length >= 3) {
        break;
      }
    }
  }

  return reasons.slice(0, 3);
}

export function buildCoverageSummary(health: SignalHealthMap): SignalCoverage {
  const values = Object.values(health);
  const healthyCount = values.filter((value) => value === 'ok').length;
  const degradedCount = values.filter((value) => value === 'degraded').length;
  const unavailableCount = values.filter((value) => value === 'unavailable').length;

  return {
    status: degradedCount > 0 || unavailableCount > 0 ? 'partial' : 'full',
    healthyCount,
    degradedCount,
    unavailableCount,
  };
}

export function canScoreWithCoverage(health: SignalHealthMap): boolean {
  const usableCount = Object.values(health).filter((value) => value !== 'unavailable').length;
  const healthyCoreCount = [
    health.socialSignal,
    health.twitter,
    health.redditBuzz,
    health.saturation,
    health.dexscreener,
  ].filter((value) => value === 'ok').length;

  return usableCount >= 4 && healthyCoreCount >= 2;
}

export function buildSignalEvidence(
  signals: SignalData,
  health: SignalHealthMap
): SignalEvidenceItem[] {
  return [
    {
      key: 'googleTrends',
      label: 'Google Trends',
      health: health.googleTrends,
      metric: `${signals.googleTrends.score}/100`,
      detail: `Trend is ${signals.googleTrends.trend}.`,
      trend: signals.googleTrends.trend,
      value: signals.googleTrends.score,
    },
    {
      key: 'socialSignal',
      label: 'Social',
      health: health.socialSignal,
      metric: signals.socialSignal.label,
      detail: signals.socialSignal.trending
        ? 'Topic is actively trending.'
        : 'Trend is adjacent or weak.',
      value: signals.socialSignal.score,
    },
    {
      key: 'twitter',
      label: 'X / CT',
      health: health.twitter,
      metric: `${signals.twitter.mentions} mentions`,
      detail: `${signals.twitter.label} · ${signals.twitter.sentiment}`,
      value: signals.twitter.score,
    },
    {
      key: 'redditBuzz',
      label: 'Reddit',
      health: health.redditBuzz,
      metric: `${signals.redditBuzz.mentions} mentions`,
      detail:
        signals.redditBuzz.topSubreddit === 'none'
          ? 'No strong subreddit surfaced.'
          : `Strongest in r/${signals.redditBuzz.topSubreddit}.`,
      value: signals.redditBuzz.score,
    },
    {
      key: 'saturation',
      label: 'Four.meme Saturation',
      health: health.saturation,
      metric: `${signals.saturation.tokenCount} matches`,
      detail: `Narrative saturation is ${signals.saturation.level}.`,
      value: signals.saturation.score,
    },
    {
      key: 'dexscreener',
      label: 'DexScreener',
      health: health.dexscreener,
      metric: `Alignment ${signals.dexscreener.alignment}`,
      detail: 'Tracks overlap with current BNB Chain narratives.',
      chips: signals.dexscreener.graduatingNarratives.slice(0, 3),
      value: signals.dexscreener.score,
    },
  ];
}

export function buildPublicSharePayload(args: {
  conceptName: string;
  total: number;
  decision: LaunchDecision;
  reasons: string[];
  dimensions: PublicSharePayload['dimensions'];
  archetypeInfo: ArchetypeInfo;
  oracleVerdict: string;
  signals: PublicSignalSummary;
  coverage: SignalCoverage;
  evidence: SignalEvidenceItem[];
  issuedAt?: number;
}): PublicSharePayload {
  return {
    v: 1,
    issuedAt: args.issuedAt ?? Date.now(),
    conceptName: args.conceptName,
    total: args.total,
    decision: args.decision,
    reasons: args.reasons,
    dimensions: args.dimensions,
    archetype: args.archetypeInfo.archetype,
    character: args.archetypeInfo.character,
    characterFile: args.archetypeInfo.characterFile,
    cardCopy: args.archetypeInfo.cardCopy,
    oracleVerdict: args.oracleVerdict,
    signals: args.signals,
    coverage: args.coverage,
    evidence: args.evidence,
  };
}
