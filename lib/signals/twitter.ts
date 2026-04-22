export interface TwitterResult {
  score: number;
  mentions: number;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  label: string;
}

const BULLISH_WORDS = ['bullish', 'moon', 'gem', 'alpha', 'ape', 'pump', 'send it', 'wagmi', 'based', 'early'];
const BEARISH_WORDS = ['scam', 'rug', 'dump', 'ngmi', 'rekt', 'dead', 'avoid', 'exit liquidity'];

export async function fetchTwitterBuzz(keyword: string): Promise<TwitterResult> {
  try {
    const res = await fetch(
      `https://twitter-api45.p.rapidapi.com/search.php?query=${encodeURIComponent(keyword + ' crypto')}&search_type=Latest`,
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'twitter-api45.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return { score: 5, mentions: 0, sentiment: 'neutral', label: 'unavailable' };

    const data = await res.json();
    const tweets: Array<{ text?: string }> = data.timeline ?? data.results ?? [];
    const mentions = tweets.length;

    if (mentions === 0) return { score: 2, mentions: 0, sentiment: 'neutral', label: 'silent' };

    const combined = tweets.map((t) => (t.text ?? '').toLowerCase()).join(' ');
    const bullishHits = BULLISH_WORDS.filter((w) => combined.includes(w)).length;
    const bearishHits = BEARISH_WORDS.filter((w) => combined.includes(w)).length;

    const sentiment: TwitterResult['sentiment'] =
      bullishHits > bearishHits + 1 ? 'bullish' : bearishHits > bullishHits + 1 ? 'bearish' : 'neutral';

    let score: number;
    if (mentions >= 15) score = sentiment === 'bullish' ? 19 : sentiment === 'bearish' ? 8 : 14;
    else if (mentions >= 5) score = sentiment === 'bullish' ? 15 : sentiment === 'bearish' ? 6 : 10;
    else score = sentiment === 'bullish' ? 10 : sentiment === 'bearish' ? 3 : 6;

    const label = mentions >= 10
      ? (sentiment === 'bullish' ? 'CT is watching' : sentiment === 'bearish' ? 'CT is skeptical' : 'CT aware')
      : mentions >= 3 ? 'early whispers' : 'underground';

    return { score, mentions, sentiment, label };
  } catch {
    return { score: 5, mentions: 0, sentiment: 'neutral', label: 'unavailable' };
  }
}
