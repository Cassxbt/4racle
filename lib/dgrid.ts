import { ConceptInput, DimensionScores, Archetype, SignalData } from './types';

export interface DGridScoreResponse {
  dimensions: DimensionScores;
  archetype: Archetype;
  oracleVerdict: string;
  reasoning: string;
}

const DGRID_BASE = 'https://api.dgrid.ai/v1';

const SYSTEM_PROMPT = `You are 4racle, a pre-launch meme coin intelligence oracle on BNB Chain. Given structured live signal data about a meme concept, return a JSON scoring object.

RESPONSE FORMAT — JSON only, no markdown:
{
  "dimensions": {
    "memeEnergy": <integer 0-20>,
    "narrativeAlpha": <integer 0-20>,
    "dexgodTiming": <integer 0-20>,
    "ctPotential": <integer 0-20>,
    "wagmiFactor": <integer 0-20>
  },
  "archetype": "<one of: Actually Alpha | Sleeping Giant | CT Consensus | Late to the Party | Exit Liquidity Material | Dead on Arrival>",
  "oracleVerdict": "<one punchy sentence, degen CT tone, max 12 words>",
  "reasoning": "<two sentences explaining the score>"
}

SCORING RULES:
- memeEnergy: Cultural timing — Google Trends interest + social signal strength.
- narrativeAlpha: Originality — LOW saturation = high score (15-20), HIGH saturation = low score (3-7).
- dexgodTiming: How well concept aligns with what is graduating on BSC right now per DexScreener.
- ctPotential: Your assessment of the name + concept virality, ticker appeal, CT memorability.
- wagmiFactor: Reddit community signal strength across 6 crypto subreddits.
- Dimension sum determines archetype: 85-100=Actually Alpha, 70-84=Sleeping Giant, 55-69=CT Consensus, 40-54=Late to the Party, 20-39=Exit Liquidity Material, 0-19=Dead on Arrival.
- Archetype MUST match the dimension sum.`;

export async function callDGrid(
  concept: ConceptInput,
  signals: SignalData
): Promise<DGridScoreResponse> {
  const userMessage = `Meme Concept: "${concept.name}"
Description: "${concept.description}"
${concept.community ? `Target community: ${concept.community}` : ''}

Live Signal Data:
- Google Trends: raw interest=${signals.googleTrends.score}/100, trend=${signals.googleTrends.trend}
- Social Signal: score=${signals.socialSignal.score}/20, trending=${signals.socialSignal.trending}, status="${signals.socialSignal.label}"
- Reddit Buzz: score=${signals.redditBuzz.score}/20, mentions=${signals.redditBuzz.mentions}, strongest in r/${signals.redditBuzz.topSubreddit}
- Market Saturation: score=${signals.saturation.score}/20, existing tokens=${signals.saturation.tokenCount}, level=${signals.saturation.level}
- DexScreener BSC: score=${signals.dexscreener.score}/20, narrative alignment=${signals.dexscreener.alignment}, top narratives: ${signals.dexscreener.graduatingNarratives.slice(0, 3).join(' | ') || 'none'}

Return the JSON scoring object.`;

  const res = await fetch(`${DGRID_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DGRID_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DGrid ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content) as DGridScoreResponse;
}
