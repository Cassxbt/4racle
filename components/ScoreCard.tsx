'use client';
import Image from 'next/image';
import DimensionBar from './DimensionBar';
import SealButton from './SealButton';
import { ScoreResult } from '@/lib/types';

interface Props {
  result: ScoreResult;
  scoreId: string;
}

const ARCHETYPE_COLORS: Record<string, string> = {
  'Actually Alpha': 'text-yellow-400',
  'Sleeping Giant': 'text-blue-400',
  'CT Consensus': 'text-orange-400',
  'Late to the Party': 'text-red-400',
  'Exit Liquidity Material': 'text-red-600',
  'Dead on Arrival': 'text-gray-500',
};

export default function ScoreCard({ result, scoreId }: Props) {
  const archetypeColor = ARCHETYPE_COLORS[result.archetype] ?? 'text-white';

  const tweetText = encodeURIComponent(
    `My concept "${result.concept.name}" scored ${result.total}/100 on 4racle — ${result.archetype}\n\n` +
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://4racle.xyz'}/score/${scoreId}\n#fourmeme #BNBChain`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Concept</span>
            <h2 className="text-xl font-black">{result.concept.name}</h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Score</span>
            <span className="text-4xl font-black text-[var(--accent)]">{result.total}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-[var(--border)] pt-4">
          <div className="relative w-20 h-20 shrink-0">
            <Image
              src={`/characters/${result.characterFile}`}
              alt={result.character}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-lg font-black uppercase tracking-wide ${archetypeColor}`}>
              ✦ {result.archetype} ✦
            </span>
            <p className="text-[var(--muted)] text-sm italic">&quot;{result.cardCopy}&quot;</p>
          </div>
        </div>

        {result.oracleVerdict && (
          <div className="bg-[var(--bg)] rounded-lg px-4 py-3 text-sm border border-[var(--border)]">
            🔮 <span className="font-medium">{result.oracleVerdict}</span>
          </div>
        )}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="text-xs text-[var(--muted)] uppercase tracking-wider font-bold">
          Score Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          <DimensionBar label="Meme Energy" score={result.dimensions.memeEnergy} />
          <DimensionBar label="Narrative Alpha" score={result.dimensions.narrativeAlpha} />
          <DimensionBar label="DexGod Timing" score={result.dimensions.dexgodTiming} />
          <DimensionBar label="CT Potential" score={result.dimensions.ctPotential} />
          <DimensionBar label="Wagmi Factor" score={result.dimensions.wagmiFactor} />
        </div>

        <div className="flex gap-4 pt-2 border-t border-[var(--border)] text-xs text-[var(--muted)] flex-wrap">
          <span>
            Social Signal:{' '}
            <span className={result.signals.socialTrending ? 'text-green-400 font-bold' : 'text-white'}>
              {result.signals.socialTrending ? '🔥 trending' : 'not trending'}
            </span>
          </span>
          <span>
            Saturation: <span className="text-white font-bold">{result.signals.saturationLevel}</span>
          </span>
          <span>
            Timing: <span className="text-white font-bold">{result.signals.timingLabel}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-black border border-white/20 hover:bg-white/10 text-white font-bold py-4 rounded-lg text-center transition-colors"
        >
          Tweet my meme fate 🐦
        </a>
        <SealButton result={result} scoreId={scoreId} />
      </div>
    </div>
  );
}
