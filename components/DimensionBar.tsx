interface Props {
  label: string;
  score: number;
  max?: number;
}

export default function DimensionBar({ label, score, max = 20 }: Props) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--muted)] w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-mono font-bold w-6 text-right">{score}</span>
    </div>
  );
}
