import { NextRequest, NextResponse } from 'next/server';
import { getArchetype } from '@/lib/archetype';
import {
  ConceptInput,
  SignalData,
  PublicSignalSummary,
} from '@/lib/types';
import { fetchGoogleTrends } from '@/lib/signals/google-trends';
import { fetchSocialSignal } from '@/lib/signals/social';
import { fetchRedditBuzz } from '@/lib/signals/reddit';
import { fetchFourMemeSaturation } from '@/lib/signals/fourmeme';
import { fetchDexScreenerContext } from '@/lib/signals/dexscreener';
import { fetchTwitterBuzz } from '@/lib/signals/twitter';
import { callOpenAI } from '@/lib/openai';
import { encodeScore } from '@/lib/score-codec';
import {
  buildPublicReasons,
  buildCoverageSummary,
  buildPublicSharePayload,
  buildSignalEvidence,
  canScoreWithCoverage,
  deriveLaunchDecision,
  type SignalHealthMap,
} from '@/lib/score-payload';

const SCORE_COVERAGE_ERROR =
  'Not enough live signal coverage right now to score this concept reliably.';

function inferSignalHealthMap(signals: SignalData): SignalHealthMap {
  return {
    googleTrends:
      signals.googleTrends.score === 5 && signals.googleTrends.trend === 'stable'
        ? 'degraded'
        : 'ok',
    socialSignal: signals.socialSignal.label === 'unavailable' ? 'unavailable' : 'ok',
    twitter: signals.twitter.label === 'unavailable' ? 'unavailable' : 'ok',
    redditBuzz:
      signals.redditBuzz.mentions === 0 && signals.redditBuzz.topSubreddit === 'none'
        ? 'degraded'
        : 'ok',
    saturation:
      signals.saturation.score === 12 &&
      signals.saturation.tokenCount === 0 &&
      signals.saturation.level === 'MEDIUM'
        ? 'degraded'
        : 'ok',
    dexscreener:
      signals.dexscreener.score === 10 &&
      signals.dexscreener.alignment === 0 &&
      signals.dexscreener.graduatingNarratives.length === 0
        ? 'degraded'
        : 'ok',
  };
}

function buildTimingLabel(signals: SignalData): PublicSignalSummary['timingLabel'] {
  return signals.dexscreener.alignment >= 3
    ? 'OPTIMAL'
    : signals.dexscreener.alignment >= 1
    ? 'LATE'
    : signals.googleTrends.trend === 'rising'
    ? 'EARLY'
    : 'MISS';
}

function buildPublicSignalSummary(signals: SignalData): PublicSignalSummary {
  return {
    socialTrending: signals.socialSignal.trending,
    saturationLevel: signals.saturation.level,
    timingLabel: buildTimingLabel(signals),
    ctBuzz: signals.twitter.label,
  };
}

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

  // Six signals fire in parallel.
  const [googleTrends, socialSignal, redditBuzz, saturation, dexscreener, twitter] = await Promise.all([
    fetchGoogleTrends(concept.name),
    fetchSocialSignal(concept.name + ' ' + concept.description),
    fetchRedditBuzz(concept.name),
    fetchFourMemeSaturation(concept.name),
    fetchDexScreenerContext(concept.name + ' ' + concept.description),
    fetchTwitterBuzz(concept.name),
  ]);

  const signals: SignalData = { googleTrends, socialSignal, redditBuzz, saturation, dexscreener, twitter };
  const health = inferSignalHealthMap(signals);
  const coverage = buildCoverageSummary(health);

  if (!canScoreWithCoverage(health)) {
    return NextResponse.json(
      { error: SCORE_COVERAGE_ERROR, coverage },
      { status: 503 }
    );
  }

  const evidence = buildSignalEvidence(signals, health);
  const publicSignals = buildPublicSignalSummary(signals);
  const openAIResponse = await callOpenAI(concept, signals);

  const dimensions = openAIResponse.dimensions;
  const total = Math.min(
    100,
    dimensions.memeEnergy +
      dimensions.narrativeAlpha +
      dimensions.dexgodTiming +
      dimensions.ctPotential +
      dimensions.wagmiFactor
  );

  const archetypeInfo = getArchetype(total);
  const decision = deriveLaunchDecision(total, coverage);
  const reasons = buildPublicReasons({
    total,
    decision,
    signals: publicSignals,
    coverage,
    evidence,
  });
  const result = buildPublicSharePayload({
    conceptName: concept.name,
    total,
    decision,
    reasons,
    dimensions,
    archetypeInfo,
    oracleVerdict: openAIResponse.oracleVerdict,
    signals: publicSignals,
    coverage,
    evidence,
  });

  return NextResponse.json({ scoreId: encodeScore(result), result });
}
