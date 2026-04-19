import googleTrends from 'google-trends-api';

export interface TrendsResult {
  score: number;
  trend: 'rising' | 'stable' | 'falling';
}

export async function fetchGoogleTrends(keyword: string): Promise<TrendsResult> {
  try {
    const raw = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(),
    });
    const data = JSON.parse(raw);
    const points: Array<{ value: number[] }> = data.default?.timelineData ?? [];
    if (!points.length) return { score: 0, trend: 'falling' };

    const values = points.map((p) => p.value[0]);
    const recent = avg(values.slice(-3));
    const earlier = avg(values.slice(0, 3));
    const trend: TrendsResult['trend'] =
      recent > earlier * 1.25 ? 'rising' : recent < earlier * 0.75 ? 'falling' : 'stable';

    return { score: Math.round(recent), trend };
  } catch {
    return { score: 5, trend: 'stable' };
  }
}

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
