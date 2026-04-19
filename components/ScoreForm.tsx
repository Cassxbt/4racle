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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-lg">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">
          Concept Name / Ticker
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. ChillCat, RAREPEPE, SleepyDoge"
          maxLength={80}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">
          Theme / Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A chill cat that doesn't panic during market dumps. Vibes only."
          maxLength={300}
          rows={3}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">
          Target Community{' '}
          <span className="text-[var(--muted)] normal-case font-normal">(optional)</span>
        </label>
        <input
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          placeholder="e.g. BSC degens, doge army, CT"
          maxLength={80}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-lg transition-colors"
      >
        {loading ? 'Reading the oracle...' : 'Check My Meme 🔮'}
      </button>
    </form>
  );
}
