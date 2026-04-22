import type { Metadata } from 'next';
import Link from 'next/link';
import ScoreForm from '@/components/ScoreForm';

export const metadata: Metadata = {
  title: '4racle — Consult the Oracle',
  description: 'Get a signed launch verdict from 6 live signals before launching on Four.meme.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 gap-10">
      <nav className="w-full max-w-2xl flex items-center justify-between anim-fade-in">
        <Link
          href="/"
          className="text-[var(--muted)] hover:text-white text-sm transition-colors flex items-center gap-2"
        >
          <span className="gradient-text font-black text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            4racle
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="signal-badge text-[10px]">6 Live Signals</span>
        </div>
      </nav>

      <section className="flex flex-col items-center gap-6 w-full max-w-xl anim-fade-up">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="oracle-orb !w-20 !h-20" />
          <h1 className="text-3xl sm:text-4xl font-black">
            <span className="gradient-text">Consult the Oracle</span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-sm leading-relaxed">
            Describe your meme concept. The oracle pulls 6 live signals
            and returns a signed launch verdict in seconds.
          </p>
        </div>
      </section>

      <section className="w-full max-w-xl anim-slide-in delay-2">
        <div className="glow-card">
          <div className="glow-card-border" />
          <div className="glow-card-glow" />
          <div className="glow-card-inner p-6 sm:p-8">
            <ScoreForm />
          </div>
        </div>
      </section>

      <section className="w-full max-w-xl anim-fade-up delay-4">
        <div className="glass-card p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
            Signals Analyzed
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="signal-badge">Google Trends</span>
            <span className="signal-badge">Social Momentum</span>
            <span className="signal-badge">X / CT</span>
            <span className="signal-badge">Reddit</span>
            <span className="signal-badge">Four.meme</span>
            <span className="signal-badge">DexScreener</span>
          </div>
        </div>
      </section>
    </main>
  );
}
