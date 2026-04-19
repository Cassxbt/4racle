export interface DexScreenerResult {
  score: number;
  graduatingNarratives: string[];
  alignment: number;
}

export async function fetchDexScreenerContext(concept: string): Promise<DexScreenerResult> {
  try {
    const res = await fetch('https://api.dexscreener.com/token-boosts/latest/v1', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { score: 10, graduatingNarratives: [], alignment: 0 };

    const data = await res.json();
    const tokens: Array<{ chainId: string; description?: string }> = Array.isArray(data)
      ? data
      : [];

    const bscTokens = tokens.filter((t) => t.chainId === 'bsc').slice(0, 30);
    const narratives = bscTokens.map((t) => t.description ?? '').filter(Boolean);

    const conceptWords = concept.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    const alignment = narratives.filter((n) => {
      const nLower = n.toLowerCase();
      return conceptWords.some((word) => nLower.includes(word));
    }).length;

    const score = alignment >= 4 ? 18 : alignment >= 2 ? 13 : alignment >= 1 ? 9 : 6;
    return { score, graduatingNarratives: narratives.slice(0, 5), alignment };
  } catch {
    return { score: 10, graduatingNarratives: [], alignment: 0 };
  }
}
