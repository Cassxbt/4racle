import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { ConceptInput, SignalData, ScoreResult } from '@/lib/types';
import { fetchGoogleTrends } from '@/lib/signals/google-trends';
import { fetchSocialSignal } from '@/lib/signals/social';
import { fetchRedditBuzz } from '@/lib/signals/reddit';
import { fetchFourMemeSaturation } from '@/lib/signals/fourmeme';
import { fetchDexScreenerContext } from '@/lib/signals/dexscreener';
import { callDGrid } from '@/lib/dgrid';
import { getArchetype } from '@/lib/archetype';
import { encodeScore } from '@/lib/score-codec';

export async function POST(req: NextRequest) {
  let body: ConceptInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, description, community } = body;
  if (!name?.trim() || !description?.trim()) {
    return NextResponse.json({ error: 'name and description are required' }, { status: 400 });
  }

  const concept: ConceptInput = {
    name: name.trim().slice(0, 80),
    description: description.trim().slice(0, 300),
    community: community?.trim().slice(0, 80),
  };

  // Five signals fire in parallel
  const [googleTrends, socialSignal, redditBuzz, saturation, dexscreener] = await Promise.all([
    fetchGoogleTrends(concept.name),
    fetchSocialSignal(concept.name + ' ' + concept.description),
    fetchRedditBuzz(concept.name),
    fetchFourMemeSaturation(concept.name),
    fetchDexScreenerContext(concept.name + ' ' + concept.description),
  ]);

  const signals: SignalData = { googleTrends, socialSignal, redditBuzz, saturation, dexscreener };

  const dgridResponse = await callDGrid(concept, signals);

  const dimensions = dgridResponse.dimensions;
  const total = Math.min(
    100,
    dimensions.memeEnergy +
      dimensions.narrativeAlpha +
      dimensions.dexgodTiming +
      dimensions.ctPotential +
      dimensions.wagmiFactor
  );

  const archetypeInfo = getArchetype(total);

  const timingLabel: ScoreResult['signals']['timingLabel'] =
    dexscreener.alignment >= 3
      ? 'OPTIMAL'
      : dexscreener.alignment >= 1
      ? 'LATE'
      : googleTrends.trend === 'rising'
      ? 'EARLY'
      : 'MISS';

  const result: ScoreResult = {
    id: nanoid(10),
    concept,
    total,
    dimensions,
    archetype: archetypeInfo.archetype,
    character: archetypeInfo.character,
    characterFile: archetypeInfo.characterFile,
    cardCopy: archetypeInfo.cardCopy,
    oracleVerdict: dgridResponse.oracleVerdict,
    signals: {
      socialTrending: socialSignal.trending,
      saturationLevel: saturation.level,
      timingLabel,
    },
    createdAt: Date.now(),
  };

  return NextResponse.json({ scoreId: encodeScore(result), result });
}
