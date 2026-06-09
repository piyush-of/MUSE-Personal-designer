export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-4">About MUSE</p>
      <h1 className="font-[family-name:var(--font-display)] text-5xl mb-8">Fashion Intelligence,<br /><em className="text-[#B5674D]">Reimagined</em></h1>

      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
        <p>
          MUSE is an AI-powered personal fashion intelligence platform that helps you understand your unique colouring,
          analyse outfits, discover trends, and shop with confidence.
        </p>
        <p>
          Our rule-based colour engine analyses outfit photos using advanced image processing, enhanced by Google Gemini AI
          for editorial-quality styling advice. With 11 skin tone profiles and curated shopping picks, MUSE bridges the
          gap between fashion expertise and everyday dressing.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6">
        {[
          { title: 'Mission', desc: 'Democratise personal styling through accessible AI technology.' },
          { title: 'Philosophy', desc: 'Great style starts with understanding your unique colouring.' },
          { title: 'Technology', desc: 'React, TypeScript, Express, PostgreSQL, Prisma, Cloudinary, Gemini.' },
          { title: 'Privacy', desc: 'Your images are processed securely. Account data is encrypted at rest.' },
        ].map(item => (
          <div key={item.title} className="border border-[var(--border)] p-6 bg-[var(--bg-surface)]">
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
