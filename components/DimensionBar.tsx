'use client';

interface Props {
  label: string;
  score: number;
  max?: number;
  delay?: number;
}

export default function DimensionBar({ label, score, max = 20, delay = 0 }: Props) {
  const pct = Math.round((score / max) * 100);
  const delayStyle = { animationDelay: `${delay}ms` };

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] w-32 sm:w-36 shrink-0">
        {label}
      </span>
      <div className="flex-1 dim-bar-track relative">
        <div className="dim-bar-glow" style={{ ...delayStyle, width: `${pct}%` }} />
        <div className="dim-bar-fill" style={{ ...delayStyle, width: `${pct}%` }} />
      </div>
      <span
        className="text-sm font-bold w-7 text-right anim-fade-in"
        style={{ ...delayStyle, fontFamily: 'var(--font-mono)' }}
      >
        {score}
      </span>
    </div>
  );
}
