export interface ConceptInput {
  name: string;
  description: string;
  community?: string;
}

export interface SignalData {
  googleTrends: {
    score: number;
    trend: 'rising' | 'stable' | 'falling';
  };
  socialSignal: {
    score: number;
    trending: boolean;
    label: string;
  };
  redditBuzz: {
    score: number;
    mentions: number;
    topSubreddit: string;
  };
  saturation: {
    score: number;
    tokenCount: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  dexscreener: {
    score: number;
    graduatingNarratives: string[];
    alignment: number;
  };
  twitter: {
    score: number;
    mentions: number;
    sentiment: 'bullish' | 'neutral' | 'bearish';
    label: string;
  };
}

export type SignalHealth = 'ok' | 'degraded' | 'unavailable';

export interface SignalCoverage {
  status: 'full' | 'partial';
  healthyCount: number;
  degradedCount: number;
  unavailableCount: number;
}

export interface PublicSignalSummary {
  socialTrending: boolean;
  saturationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timingLabel: 'OPTIMAL' | 'LATE' | 'EARLY' | 'MISS';
  ctBuzz: string;
}

export interface SignalEvidenceItem {
  key: 'googleTrends' | 'socialSignal' | 'twitter' | 'redditBuzz' | 'saturation' | 'dexscreener';
  label: string;
  health: SignalHealth;
  metric: string;
  detail: string;
  chips?: string[];
  trend?: 'rising' | 'stable' | 'falling';
  value?: number;
}

export type Archetype =
  | 'Actually Alpha'
  | 'Sleeping Giant'
  | 'CT Consensus'
  | 'Late to the Party'
  | 'Exit Liquidity Material'
  | 'Dead on Arrival';

export type LaunchDecision = 'Launch' | 'Watch' | 'Do Not Launch Yet';

export interface DimensionScores {
  memeEnergy: number;
  narrativeAlpha: number;
  dexgodTiming: number;
  ctPotential: number;
  wagmiFactor: number;
}

export interface PublicSharePayload {
  v: 1;
  issuedAt: number;
  conceptName: string;
  total: number;
  decision: LaunchDecision;
  reasons: string[];
  dimensions: DimensionScores;
  archetype: Archetype;
  character: string;
  characterFile: string;
  cardCopy: string;
  oracleVerdict: string;
  signals: PublicSignalSummary;
  coverage: SignalCoverage;
  evidence: SignalEvidenceItem[];
}
