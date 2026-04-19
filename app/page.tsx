import ScoreForm from '@/components/ScoreForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">🔮</span>
          <h1 className="text-4xl font-black tracking-tight">4racle</h1>
          <p className="text-[var(--muted)] text-lg max-w-sm">
            Pre-launch meme intelligence for Four.meme token creators.
            Know your odds before you mint.
          </p>
        </div>

        <ScoreForm />

        <p className="text-xs text-[var(--muted)] text-center">
          Powered by DGrid AI · 5 live data signals · No wallet required to score
        </p>
      </div>
    </main>
  );
}
