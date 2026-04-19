import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ScoreCard from '@/components/ScoreCard';
import { decodeScore } from '@/lib/score-codec';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = decodeScore(params.id);
  if (!result) return { title: '4racle' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://4racle.xyz';

  return {
    title: `${result.concept.name} scored ${result.total}/100 on 4racle`,
    description: `${result.archetype} — ${result.cardCopy}`,
    openGraph: {
      title: `${result.concept.name} — ${result.total}/100 on 4racle`,
      description: result.cardCopy,
      images: [`${appUrl}/api/og/${params.id}`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${result.concept.name} — ${result.total}/100 on 4racle`,
      description: result.cardCopy,
      images: [`${appUrl}/api/og/${params.id}`],
    },
  };
}

export default function ScorePage({ params }: Props) {
  const result = decodeScore(params.id);
  if (!result) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12 gap-8">
      <a href="/" className="text-[var(--muted)] hover:text-white text-sm transition-colors self-start">
        ← Check another concept
      </a>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🔮</span>
        <h1 className="text-2xl font-black">4racle Result</h1>
      </div>
      <ScoreCard result={result} scoreId={params.id} />
    </main>
  );
}
