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
}

export type Archetype =
  | 'Actually Alpha'
  | 'Sleeping Giant'
  | 'CT Consensus'
  | 'Late to the Party'
  | 'Exit Liquidity Material'
  | 'Dead on Arrival';

export interface DimensionScores {
  memeEnergy: number;
  narrativeAlpha: number;
  dexgodTiming: number;
  ctPotential: number;
  wagmiFactor: number;
}

export interface ScoreResult {
  id: string;
  concept: ConceptInput;
  total: number;
  dimensions: DimensionScores;
  archetype: Archetype;
  character: string;
  characterFile: string;
  cardCopy: string;
  oracleVerdict: string;
  signals: {
    socialTrending: boolean;
    saturationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    timingLabel: 'OPTIMAL' | 'LATE' | 'EARLY' | 'MISS';
  };
  sealId?: number;
  sealTx?: string;
  createdAt: number;
}
