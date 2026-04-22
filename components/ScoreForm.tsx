'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ScoreForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [community, setCommunity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Concept name and description are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, community }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Score failed');
      }

      const { scoreId } = await res.json();
      router.push(`/score/${scoreId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          Concept Name / Ticker
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. ChillCat, RAREPEPE, SleepyDoge"
          maxLength={80}
          className="form-input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          Theme / Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A chill cat that doesn't panic during market dumps. Vibes only."
          maxLength={300}
          rows={3}
          className="form-input resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          Target Community
          <span className="normal-case font-normal ml-1 tracking-normal">(optional)</span>
        </label>
        <input
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          placeholder="e.g. BSC degens, doge army, CT"
          maxLength={80}
          className="form-input"
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-oracle mt-1">
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="oracle-orb !w-5 !h-5 !shadow-none" style={{ animation: 'orbPulse 1s ease-in-out infinite' }} />
            Consulting the oracle
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </span>
        ) : (
          'Consult the Oracle'
        )}
      </button>
    </form>
  );
}
