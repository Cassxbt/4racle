import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '4racle — Pre-Launch Meme Intelligence',
  description: "Score your meme concept before launching on Four.meme. 5 live signals. DGrid AI. BSC.",
  openGraph: {
    title: '4racle — Pre-Launch Meme Intelligence',
    description: 'Know your odds before you mint.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
