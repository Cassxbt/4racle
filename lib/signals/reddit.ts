const SUBREDDITS = [
  'CryptoMoonShots',
  'memecoins',
  'SatoshiStreetBets',
  'wallstreetbets',
  'BNBChain',
  'dogecoin',
];

export interface RedditResult {
  score: number;
  mentions: number;
  topSubreddit: string;
}

export async function fetchRedditBuzz(keyword: string): Promise<RedditResult> {
  const kwLower = keyword.toLowerCase();
  let totalMentions = 0;
  let topSubreddit = 'none';
  let topCount = 0;

  await Promise.all(
    SUBREDDITS.map(async (sub) => {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=1&sort=new&limit=25&t=week`,
          {
            headers: { 'User-Agent': '4racle/1.0 (hackathon)' },
            signal: AbortSignal.timeout(4000),
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const posts: Array<{ data: { title: string; selftext: string } }> =
          data.data?.children ?? [];
        const matches = posts.filter((p) =>
          (p.data.title + ' ' + p.data.selftext).toLowerCase().includes(kwLower)
        ).length;

        totalMentions += matches;
        if (matches > topCount) {
          topCount = matches;
          topSubreddit = sub;
        }
      } catch {
        // skip failed subreddits
      }
    })
  );

  const score = Math.min(20, totalMentions * 2);
  return { score, mentions: totalMentions, topSubreddit };
}
