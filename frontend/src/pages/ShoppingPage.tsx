import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';
import { CardSkeleton } from '../components/Skeleton';

interface ShoppingItem {
  item: string;
  category: string;
  priceRange: string;
  why: string;
  styleTip: string;
  story: string;
  styleKey: string;
  lineArtSvg?: string;
  retailers: { name: string; url: string }[];
  recommendedPalette?: { headline: string };
}

export function ShoppingPage() {
  const [category, setCategory] = useState('all');
  const [skinTone, setSkinTone] = useState('medium');
  const [gender, setGender] = useState('women');
  const [itemType, setItemType] = useState('all');
  const { addItem } = useCart();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['shopping', category, skinTone, gender, itemType],
    queryFn: () => apiFetch<{
      success: boolean;
      data: ShoppingItem[];
      filters: { skinTones: string[]; itemTypes: string[]; genders: string[] };
      categories: string[];
      context: { aiContent?: { headline: string; copy: string }; paletteHeadline?: { headline: string } };
    }>(`/api/shopping?category=${category}&skinTone=${skinTone}&gender=${gender}&itemType=${itemType}`),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Curated Picks</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Shopping</h1>
        {data?.context?.aiContent && (
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl">{data.context.aiContent.copy}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm rounded">
          {(data?.categories || ['all']).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={skinTone} onChange={e => setSkinTone(e.target.value)} className="border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm rounded">
          {(data?.filters?.skinTones || ['medium']).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <select value={gender} onChange={e => setGender(e.target.value)} className="border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm rounded">
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
        <select value={itemType} onChange={e => setItemType(e.target.value)} className="border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm rounded">
          {(data?.filters?.itemTypes || ['all']).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data?.data.map((item, i) => (
            <div key={i} className="border border-[var(--border)] bg-[var(--bg-surface)] p-6 hover:shadow-md transition-shadow">
              {item.lineArtSvg && (
                <div className="w-24 h-24 mb-4" dangerouslySetInnerHTML={{ __html: item.lineArtSvg }} />
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-[family-name:var(--font-display)] text-lg">{item.item}</h3>
                <span className="chip text-xs">{item.priceRange}</span>
              </div>
              <span className="chip chip-sage text-xs mb-3">{item.category}</span>
              <p className="text-sm text-[var(--text-muted)] mb-2">{item.why}</p>
              {item.styleTip && <p className="text-sm text-[#A8864A] mb-4">💡 {item.styleTip}</p>}
              <div className="flex flex-wrap gap-2">
                {item.retailers?.map(r => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener" className="chip chip-sage text-xs hover:opacity-80">{r.name} ↗</a>
                ))}
                <button
                  className="chip chip-rose text-xs cursor-pointer"
                  onClick={() => { addItem(item); showToast('Saved to cart!', 'success'); }}
                >
                  Save to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
