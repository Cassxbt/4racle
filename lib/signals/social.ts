export interface SocialResult {
  score: number;
  trending: boolean;
  label: string;
}

export async function fetchSocialSignal(keyword: string): Promise<SocialResult> {
  try {
    const res = await fetch(
      'https://tiktok-scraper7.p.rapidapi.com/trend/hashtag?region=US&count=30',
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!res.ok) return { score: 5, trending: false, label: 'unavailable' };

    const data = await res.json();
    const hashtags: string[] = (data.data ?? []).map(
      (h: { hashtag_name: string }) => h.hashtag_name.toLowerCase()
    );

    const kwNorm = keyword.toLowerCase().replace(/\s+/g, '');
    const exactMatch = hashtags.some((h) => h.includes(kwNorm) || kwNorm.includes(h));
    if (exactMatch) return { score: 19, trending: true, label: 'trending' };

    const kwWords = kwNorm.match(/[a-z]{3,}/g) ?? [];
    const partial = kwWords.some((word) => hashtags.some((h) => h.includes(word)));
    if (partial) return { score: 11, trending: false, label: 'adjacent' };

    return { score: 3, trending: false, label: 'no signal' };
  } catch {
    return { score: 5, trending: false, label: 'unavailable' };
  }
}
