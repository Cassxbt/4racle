import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ScoreCard from '@/components/ScoreCard';
import { decodeScore } from '@/lib/score-codec';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payload = decodeScore(params.id);
  if (!payload) return { title: '4racle' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://4racle.xyz';

  return {
    title: `${payload.conceptName} scored ${payload.total}/100 on 4racle`,
    description: `${payload.archetype} \u2014 ${payload.cardCopy}`,
    openGraph: {
      title: `${payload.conceptName} \u2014 ${payload.total}/100 on 4racle`,
      description: payload.cardCopy,
      images: [`${appUrl}/api/og/${params.id}`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${payload.conceptName} \u2014 ${payload.total}/100 on 4racle`,
      description: payload.cardCopy,
      images: [`${appUrl}/api/og/${params.id}`],
    },
  };
}

export default function ScorePage({ params }: Props) {
  const payload = decodeScore(params.id);
  if (!payload) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">
      <a
        href="/"
        className="text-[var(--muted)] hover:text-white text-sm transition-colors self-start max-w-lg w-full mx-auto anim-fade-in"
      >
        &larr; Check another concept
      </a>
      <div className="flex flex-col items-center gap-4 text-center anim-fade-up">
        <div className="oracle-orb !w-16 !h-16" />
        <h1 className="text-2xl font-black">
          <span className="gradient-text">Oracle Verdict</span>
        </h1>
      </div>
      <ScoreCard result={payload} scoreId={params.id} />
    </main>
  );
}
