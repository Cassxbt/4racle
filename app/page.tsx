import Link from 'next/link';

const SIGNALS = [
  { name: 'Google Trends', desc: 'Real-time search interest and momentum detection' },
  { name: 'Social Momentum', desc: 'Short-form social trend velocity and hashtag discovery' },
  { name: 'X / CT Buzz', desc: 'Crypto Twitter mentions, sentiment, and hype level' },
  { name: 'Reddit Pulse', desc: 'Community chatter across 6 major crypto subreddits' },
  { name: 'Four.meme Saturation', desc: 'How crowded your narrative already is on-chain' },
  { name: 'DexScreener BSC', desc: 'What is graduating right now on BNB Chain' },
];

const ARCHETYPES = [
  { name: 'Actually Alpha', range: '85-100', color: 'text-yellow-400', desc: 'Rare. Undiscovered. Move fast.' },
  { name: 'Sleeping Giant', range: '70-84', color: 'text-blue-400', desc: 'Strong signal. Market hasn\'t caught on.' },
  { name: 'CT Consensus', range: '55-69', color: 'text-orange-400', desc: 'Everyone sees it. Timing is everything.' },
  { name: 'Late to the Party', range: '40-54', color: 'text-red-400', desc: 'Narrative exists. You\'re in the fire.' },
  { name: 'Exit Liquidity', range: '20-39', color: 'text-red-600', desc: 'Crowded. Derivative. Rethink.' },
  { name: 'Dead on Arrival', range: '0-19', color: 'text-gray-500', desc: 'Even the chart would flatline.' },
];

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <div className="oracle-orb anim-fade-up" />
          <h1 className="hero-title anim-fade-up delay-1">
            <span className="gradient-text">4racle</span>
          </h1>
          <p className="hero-subtitle anim-fade-up delay-2">
            Tamper-proof launch intelligence for Four.meme creators.
            <br />
            6 live signals. AI verdicts. Signed public proof.
          </p>
          <p className="hero-description anim-fade-up delay-3">
            Before you deploy on <strong>Four.meme</strong>, know whether your concept
            is worth launching, worth watching, or not ready yet. 4racle turns 6 live
            market and social signals into an AI verdict, then signs the public result
            so your share link, evidence, and seal flow can be verified instead of edited.
          </p>
          <div className="hero-actions anim-fade-up delay-4">
            <Link href="/dashboard" className="btn-oracle">
              Launch App
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              How it works
            </a>
          </div>
          <div className="hero-stats anim-fade-in delay-5">
            <div className="hero-stat">
              <span className="hero-stat-value">6</span>
              <span className="hero-stat-label">Live Signals</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">AI</span>
              <span className="hero-stat-label">Powered Scoring</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">BSC</span>
              <span className="hero-stat-label">On-Chain Seal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="signals">
        <div className="section-inner">
          <h2 className="section-eyebrow anim-fade-up">Signal Intelligence</h2>
          <h3 className="section-title anim-fade-up delay-1">
            6 data sources. Zero guesswork.
          </h3>
          <p className="section-subtitle anim-fade-up delay-2">
            Every score is backed by real-time data pulled the moment you submit.
            No cached results. No placeholder sources.
          </p>
          <div className="signal-grid anim-fade-up delay-3">
            {SIGNALS.map((s, i) => (
              <div key={s.name} className="signal-card" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
                <div className="signal-card-indicator" />
                <h4 className="signal-card-name">{s.name}</h4>
                <p className="signal-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <div className="section-inner">
          <h2 className="section-eyebrow anim-fade-up">How It Works</h2>
          <h3 className="section-title anim-fade-up delay-1">
            Three steps to a trusted launch call
          </h3>
          <div className="steps-row anim-fade-up delay-2">
            <div className="step-card-landing">
              <div className="step-number">1</div>
              <h4 className="step-title">Describe your concept</h4>
              <p className="step-desc">
                Name, theme, target community. The oracle needs context to read the signals.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card-landing">
              <div className="step-number">2</div>
              <h4 className="step-title">6 signals analyzed</h4>
              <p className="step-desc">
                Google Trends, social momentum, X/CT, Reddit, Four.meme saturation, and DexScreener BSC fire in parallel.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card-landing">
              <div className="step-number">3</div>
              <h4 className="step-title">Get your verdict</h4>
              <p className="step-desc">
                4racle returns a score, launch decision, signed proof page, and optional on-chain seal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="archetypes">
        <div className="section-inner">
          <h2 className="section-eyebrow anim-fade-up">Oracle Archetypes</h2>
          <h3 className="section-title anim-fade-up delay-1">
            Every concept gets classified
          </h3>
          <div className="archetype-grid anim-fade-up delay-2">
            {ARCHETYPES.map((a) => (
              <div key={a.name} className="archetype-row">
                <span className={`archetype-name ${a.color}`}>{a.name}</span>
                <span className="archetype-range">{a.range}</span>
                <span className="archetype-desc">{a.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-inner">
          <h2 className="section-eyebrow anim-fade-up">On-Chain Proof</h2>
          <h3 className="section-title anim-fade-up delay-1">
            Seal a verified result on BNB Chain
          </h3>
          <p className="section-subtitle anim-fade-up delay-2">
            Every signed result can be permanently sealed on BSC for ~$0.02.
            That gives creators a public receipt for what the market looked like before launch,
            not an editable screenshot made after the fact.
          </p>
          <div className="chain-badges anim-fade-up delay-3">
            <span className="chain-badge">BNB Smart Chain</span>
            <span className="chain-badge">MetaMask</span>
            <span className="chain-badge">Immutable</span>
            <span className="chain-badge">~$0.02</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner anim-fade-up">
          <div className="oracle-orb !w-16 !h-16" />
          <h2 className="cta-title">Ready to consult the oracle?</h2>
          <p className="cta-subtitle">
            Verify the narrative before you launch. Free to use.
          </p>
          <Link href="/dashboard" className="btn-oracle">
            Launch App
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-brand gradient-text">4racle</span>
          <span className="footer-tagline">The trust layer for Four.meme launches</span>
          <div className="footer-badges">
            <span className="signal-badge">BNB Chain</span>
            <span className="signal-badge">Four.meme</span>
            <span className="signal-badge">AI Powered</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
