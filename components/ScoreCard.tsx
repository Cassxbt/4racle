'use client';
import Image from 'next/image';
import DimensionBar from './DimensionBar';
import SealButton from './SealButton';
import SignalEvidenceGrid from './SignalEvidenceGrid';
import type { PublicSharePayload } from '@/lib/types';

interface Props {
  result: PublicSharePayload;
  scoreId: string;
}

const DECISION_STYLE: Record<PublicSharePayload['decision'], { color: string; note: string }> = {
  Launch: {
    color: 'text-green-400',
    note: 'Signals are strong enough to justify moving now.',
  },
  Watch: {
    color: 'text-yellow-300',
    note: 'The setup is promising, but timing or coverage still needs confirmation.',
  },
  'Do Not Launch Yet': {
    color: 'text-red-400',
    note: 'The current setup is too weak or too crowded to justify a clean launch.',
  },
};

const PROOF_CHAIN = [
  '6 live signals',
  'AI score',
  'Signed share link',
  'Public verification',
  'On-chain seal',
];

const ARCHETYPE_STYLE: Record<string, { color: string; glow: string; scoreClass: string; haloColor: string }> = {
  'Actually Alpha': { color: 'text-yellow-400', glow: 'glow-gold', scoreClass: 'gold', haloColor: 'rgba(245,158,11,0.3)' },
  'Sleeping Giant': { color: 'text-blue-400', glow: 'glow-blue', scoreClass: 'blue', haloColor: 'rgba(59,130,246,0.3)' },
  'CT Consensus': { color: 'text-orange-400', glow: 'glow-orange', scoreClass: 'orange', haloColor: 'rgba(249,115,22,0.3)' },
  'Late to the Party': { color: 'text-red-400', glow: 'glow-red', scoreClass: 'red', haloColor: 'rgba(239,68,68,0.3)' },
  'Exit Liquidity Material': { color: 'text-red-600', glow: 'glow-darkred', scoreClass: 'red', haloColor: 'rgba(185,28,28,0.3)' },
  'Dead on Arrival': { color: 'text-gray-500', glow: 'glow-gray', scoreClass: '', haloColor: 'rgba(107,114,128,0.2)' },
};

export default function ScoreCard({ result, scoreId }: Props) {
  const style = ARCHETYPE_STYLE[result.archetype] ?? { color: 'text-white', glow: '', scoreClass: '', haloColor: 'rgba(139,92,246,0.3)' };
  const decisionStyle = DECISION_STYLE[result.decision];

  const tweetText = encodeURIComponent(
    `My concept "${result.conceptName}" scored ${result.total}/100 on 4racle \u2014 ${result.decision}\n\n` +
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://4racle.xyz'}/score/${scoreId}\n#fourmeme #BNBChain`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg">
      <div className="glow-card anim-slide-in">
        <div className="glow-card-border" />
        <div className="glow-card-glow" />
        <div className={`glow-card-inner ${style.glow} p-6 sm:p-8`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Concept
              </span>
              <h2 className="text-2xl font-black">{result.conceptName}</h2>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Score
              </span>
              <span className={`score-number ${style.scoreClass} anim-score-reveal delay-2`}>
                {result.total}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 border-t border-white/5 pt-5 mb-5">
            <div
              className="character-halo relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white/5"
              style={{ '--halo-color': style.haloColor } as React.CSSProperties}
            >
              <Image
                src={`/characters/${result.characterFile}`}
                alt={result.character}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className={`text-base font-black uppercase tracking-wide ${style.color}`}>
                {result.archetype}
              </span>
              <p className="text-[var(--muted)] text-sm italic leading-relaxed">
                &quot;{result.cardCopy}&quot;
              </p>
            </div>
          </div>

          {result.oracleVerdict && (
            <div className="bg-white/[0.03] rounded-xl px-5 py-4 text-sm border border-white/5 anim-fade-in delay-4">
              <span className="font-semibold">{result.oracleVerdict}</span>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Launch Decision
            </span>
            <div className={`text-2xl font-black ${decisionStyle.color}`}>{result.decision}</div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{decisionStyle.note}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 anim-slide-in delay-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-5">
          Score Breakdown
        </h3>
        <div className="flex flex-col gap-4">
          <DimensionBar label="Meme Energy" score={result.dimensions.memeEnergy} delay={400} />
          <DimensionBar label="Narrative Alpha" score={result.dimensions.narrativeAlpha} delay={500} />
          <DimensionBar label="DexGod Timing" score={result.dimensions.dexgodTiming} delay={600} />
          <DimensionBar label="CT Potential" score={result.dimensions.ctPotential} delay={700} />
          <DimensionBar label="Wagmi Factor" score={result.dimensions.wagmiFactor} delay={800} />
        </div>

        <div className="flex gap-3 pt-5 mt-5 border-t border-white/5 flex-wrap">
          <span className="signal-badge">
            <span className={result.signals.socialTrending ? 'text-green-400' : 'text-[var(--muted)]'}>
              {result.signals.socialTrending ? 'Trending' : 'Not trending'}
            </span>
          </span>
          <span className="signal-badge">
            Saturation: <span className="text-white ml-1">{result.signals.saturationLevel}</span>
          </span>
          <span className="signal-badge">
            Timing: <span className="text-white ml-1">{result.signals.timingLabel}</span>
          </span>
          {result.signals.ctBuzz && (
            <span className="signal-badge">
              CT: <span className="text-white ml-1">{result.signals.ctBuzz}</span>
            </span>
          )}
          {result.coverage.status === 'partial' ? (
            <span className="signal-badge">Scored with partial live coverage</span>
          ) : null}
        </div>

        <div className="pt-5 mt-5 border-t border-white/5">
          <SignalEvidenceGrid evidence={result.evidence} />
        </div>

        <div className="pt-5 mt-5 border-t border-white/5 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Why This Verdict
          </h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
            {result.reasons.map((reason) => (
              <p key={reason} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                {reason}
              </p>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-white/5 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Proof Chain
          </h4>
          <div className="flex flex-wrap gap-2">
            {PROOF_CHAIN.map((step) => (
              <span key={step} className="signal-badge">
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 anim-fade-up delay-5">
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Share on X
        </a>
        <SealButton scoreId={scoreId} />
      </div>
    </div>
  );
}
