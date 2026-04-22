import type { SignalEvidenceItem } from '@/lib/types';

export default function SignalEvidenceCard({ item }: { item: SignalEvidenceItem }) {
  const healthClass =
    item.health === 'ok'
      ? 'text-green-400'
      : item.health === 'degraded'
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="glass-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          {item.label}
        </h4>
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${healthClass}`}>
          {item.health}
        </span>
      </div>
      <div className="text-lg font-black">{item.metric}</div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{item.detail}</p>
      {item.chips?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.chips.map((chip) => (
            <span key={chip} className="signal-badge">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
