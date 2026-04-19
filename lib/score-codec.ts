import { ScoreResult } from './types';

export function encodeScore(result: ScoreResult): string {
  const payload = {
    ...result,
    concept: {
      ...result.concept,
      description: result.concept.description.slice(0, 120),
    },
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeScore(encoded: string): ScoreResult | null {
  try {
    if (!encoded) return null;
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    return JSON.parse(json) as ScoreResult;
  } catch {
    return null;
  }
}
