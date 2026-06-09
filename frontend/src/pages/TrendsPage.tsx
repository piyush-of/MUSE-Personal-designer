import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
import type { Trend } from '../types';
import { CardSkeleton } from '../components/Skeleton';

export function TrendsPage() {
  const [tab, setTab] = useState<'women' | 'men'>('women');

  const { data, isLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: () => apiFetch<{
      success: boolean;
      data: { women: Trend[]; men: Trend[]; content?: { headline: string; summary: string } };
    }>('/api/trends'),
  });

  const trends = tab === 'women' ? data?.data.women : data?.data.men;
  const content = data?.data.content;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Trend Radar</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Fashion Trends</h1>
        {content && <p className="text-[var(--text-secondary)] mt-4 max-w-2xl">{content.summary}</p>}
      </div>

      <div className="flex gap-3 mb-8">
        {(['women', 'men'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn text-xs py-2 capitalize ${tab === t ? 'btn-primary' : 'btn-outline'}`}>
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {trends?.map(trend => (
            <article key={trend.id} className="border border-[var(--border)] bg-[var(--bg-surface)] p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="chip chip-rose text-xs">{trend.tag}</span>
                <span className="text-xs text-[var(--text-muted)]">{trend.season}</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl mb-3">{trend.trend}</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{trend.description}</p>
              <div className="flex gap-2 mb-4">
                {trend.hexColors.map((h, i) => (
                  <div key={h} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full border border-[var(--border)]" style={{ background: h }} />
                    <span className="text-[0.6rem] text-[var(--text-muted)]">{trend.colors[i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Key Pieces</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {trend.keyPieces.map(p => <span key={p} className="chip text-xs">{p}</span>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {trend.recommendations.map(r => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener" className="chip chip-sage text-xs hover:opacity-80">
                    {r.item} · {r.price} ↗
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
