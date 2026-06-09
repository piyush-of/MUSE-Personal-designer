import { Link } from 'react-router-dom';

const features = [
  { icon: '🎨', title: 'Colour Intelligence', desc: '11 skin tone profiles with personalised palette recommendations.' },
  { icon: '📸', title: 'Outfit Analysis', desc: 'Upload any outfit photo for instant AI-powered style scoring.' },
  { icon: '🛍️', title: 'Curated Shopping', desc: 'Filter picks by category, skin tone, and gender with retailer links.' },
  { icon: '📈', title: 'Trend Radar', desc: 'Spring/Summer 2026 trends for women and men with shop links.' },
];

const steps = [
  { num: '01', title: 'Upload', desc: 'Snap or upload an outfit photo.' },
  { num: '02', title: 'Analyse', desc: 'AI detects colours and scores your look.' },
  { num: '03', title: 'Discover', desc: 'Get palette, combos, and shopping picks.' },
  { num: '04', title: 'Shop', desc: 'Save items to cart and track prices.' },
];

export function HomePage() {
  return (
    <>
      <section className="grid lg:grid-cols-2 min-h-[85vh]">
        <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-9 h-px bg-[#B5674D]" />
            <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.22em] uppercase text-[#B5674D]">
              Fashion Intelligence
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl font-normal leading-tight mb-6">
            Your Personal<br /><em className="text-[#B5674D]">Style Expert</em>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            MUSE analyses your outfits, reveals your best colours, and curates shopping picks tailored to your unique skin tone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/analyze" className="btn btn-primary">Analyse My Outfit →</Link>
            <Link to="/shopping" className="btn btn-outline">Browse Shopping</Link>
          </div>
          <div className="flex gap-12 mt-12 pt-8 border-t border-[var(--border)]">
            {[{ n: '11', l: 'Skin Profiles' }, { n: '30+', l: 'Shopping Picks' }, { n: '10', l: 'Trend Stories' }].map(s => (
              <div key={s.l}>
                <span className="font-[family-name:var(--font-display)] text-3xl text-[#B5674D]">{s.n}</span>
                <p className="font-[family-name:var(--font-mono)] text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--bg-inverse)] flex items-center justify-center p-8 relative overflow-hidden">
          <div className="flex flex-col gap-3 max-w-sm w-full relative z-10">
            {[
              { label: 'Style Score', value: '87 / 100', sub: 'Monochrome Chic' },
              { label: 'Best Colour', value: 'Camel & Ivory', sub: 'Warm undertone match' },
              { label: 'Trend Signal', value: 'Quiet Luxury', sub: 'Spring/Summer 2026' },
            ].map((card, i) => (
              <div
                key={card.label}
                className="bg-white/5 border border-white/10 backdrop-blur-sm p-5 text-[#F0EBE3] animate-[fadeUp_0.7s_ease_forwards] opacity-0"
                style={{ animationDelay: `${0.15 * (i + 1)}s` }}
              >
                <p className="font-[family-name:var(--font-mono)] text-[0.55rem] tracking-[0.18em] uppercase text-[#C4A060] mb-1">{card.label}</p>
                <p className="font-[family-name:var(--font-display)] text-lg">{card.value}</p>
                <p className="text-xs text-white/40 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <div key={f.title} className="p-8 border-r border-[var(--border)] last:border-r-0 hover:bg-[var(--bg-muted)] transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-[family-name:var(--font-display)] text-base mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-8 bg-[var(--bg-muted)]">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto border border-[var(--border)]">
          {steps.map(s => (
            <div key={s.num} className="p-8 border-r border-[var(--border)] last:border-r-0">
              <p className="font-[family-name:var(--font-display)] text-4xl text-[#B5674D] opacity-50 mb-3">{s.num}</p>
              <h3 className="font-[family-name:var(--font-display)] text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-8 text-center bg-[var(--bg-inverse)] text-[var(--text-inverse)]">
        <h2 className="font-[family-name:var(--font-display)] text-4xl mb-4">Ready to discover your style?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Upload an outfit and get your personalised fashion intelligence report in seconds.</p>
        <Link to="/analyze" className="btn btn-primary">Start Free Analysis →</Link>
      </section>
    </>
  );
}
