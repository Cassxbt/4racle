export interface SaturationResult {
  score: number;
  tokenCount: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export async function fetchFourMemeSaturation(name: string): Promise<SaturationResult> {
  try {
    const res = await fetch(
      `https://four.meme/meme-api/v1/private/token/list?pageSize=20&pageNum=1&keyword=${encodeURIComponent(name)}`,
      {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return { score: 12, tokenCount: 0, level: 'MEDIUM' };

    const data = await res.json();
    const count: number =
      data?.data?.total ?? data?.data?.count ?? data?.data?.list?.length ?? 0;

    if (count <= 3) return { score: 19, tokenCount: count, level: 'LOW' };
    if (count <= 15) return { score: 11, tokenCount: count, level: 'MEDIUM' };
    return { score: 3, tokenCount: count, level: 'HIGH' };
  } catch {
    return { score: 12, tokenCount: 0, level: 'MEDIUM' };
  }
}
