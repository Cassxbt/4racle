import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { decodeScore } from '@/lib/score-codec';

export const runtime = 'nodejs';

function loadCharacter(file: string): string {
  const imgPath = join(process.cwd(), 'public', 'characters', file);
  const buffer = readFileSync(imgPath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

const ARCHETYPE_BG: Record<string, string> = {
  'Actually Alpha': '#1a1200',
  'Sleeping Giant': '#0a1228',
  'CT Consensus': '#1a0d00',
  'Late to the Party': '#1a0a00',
  'Exit Liquidity Material': '#1a0000',
  'Dead on Arrival': '#111111',
};

const ARCHETYPE_ACCENT: Record<string, string> = {
  'Actually Alpha': '#f5c518',
  'Sleeping Giant': '#60a5fa',
  'CT Consensus': '#fb923c',
  'Late to the Party': '#f87171',
  'Exit Liquidity Material': '#dc2626',
  'Dead on Arrival': '#6b7280',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = decodeScore(params.id);
  if (!result) return new Response('Not found', { status: 404 });

  const charSrc = loadCharacter(result.characterFile);
  const bg = ARCHETYPE_BG[result.archetype] ?? '#0d0d0d';
  const accent = ARCHETYPE_ACCENT[result.archetype] ?? '#9b4dff';

  const dims = [
    { label: 'Meme Energy', value: result.dimensions.memeEnergy },
    { label: 'Narrative Alpha', value: result.dimensions.narrativeAlpha },
    { label: 'DexGod Timing', value: result.dimensions.dexgodTiming },
    { label: 'CT Potential', value: result.dimensions.ctPotential },
    { label: 'Wagmi Factor', value: result.dimensions.wagmiFactor },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: bg,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          fontFamily: 'sans-serif',
          border: `4px solid ${accent}`,
          boxSizing: 'border-box',
        }}
      >
        {/* Left: character */}
        <div
          style={{
            width: 300,
            background: `${accent}18`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            borderRight: `2px solid ${accent}33`,
            padding: 24,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={charSrc} alt="" width={180} height={180} style={{ objectFit: 'contain' }} />
          <div style={{ color: accent, fontWeight: 900, fontSize: 13, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 }}>
            {result.character}
          </div>
        </div>

        {/* Right: content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 48px', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 3 }}>🔮 4racle</div>
              <div style={{ color: '#fff', fontSize: 26, fontWeight: 900 }}>{result.concept.name}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>Score</div>
              <div style={{ color: accent, fontSize: 54, fontWeight: 900, lineHeight: 1 }}>{result.total}</div>
              <div style={{ color: '#555', fontSize: 12 }}>/100</div>
            </div>
          </div>

          <div style={{ color: accent, fontSize: 17, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>
            ✦ {result.archetype} ✦
          </div>

          <div style={{ color: '#aaa', fontSize: 15, fontStyle: 'italic' }}>
            "{result.cardCopy}"
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 4 }}>
            {dims.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ color: '#777', fontSize: 12, width: 120, flexShrink: 0 }}>{label}</div>
                <div style={{ flex: 1, height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(value / 20) * 100}%`, height: '100%', background: accent, borderRadius: 3 }} />
                </div>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, width: 20, textAlign: 'right' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 18, color: '#555', fontSize: 12 }}>
              <span>Social: <span style={{ color: result.signals.socialTrending ? '#4ade80' : '#fff' }}>{result.signals.socialTrending ? '🔥 trending' : 'stable'}</span></span>
              <span>Saturation: <span style={{ color: '#fff' }}>{result.signals.saturationLevel}</span></span>
              <span>Timing: <span style={{ color: '#fff' }}>{result.signals.timingLabel}</span></span>
            </div>
            <div style={{ color: '#333', fontSize: 11 }}>4racle.xyz · powered by DGrid</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
