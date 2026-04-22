import type { Metadata } from 'next';
import { Syne, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: '4racle — Pre-Launch Meme Intelligence',
  description: 'Score your meme concept before launching on Four.meme. 6 live signals. OpenAI-powered. BSC.',
  openGraph: {
    title: '4racle — Pre-Launch Meme Intelligence',
    description: 'Score your meme concept before launching on Four.meme with 6 live signals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${outfit.variable} ${jetbrains.variable}`}>
        <div className="cosmic-bg" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
