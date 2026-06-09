import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
import type { AnalysisResult } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/LoadingSpinner';

const SKIN_TONES = ['porcelain', 'fair', 'light', 'light_medium', 'medium', 'olive', 'tan', 'deep', 'rich', 'ebony', 'dark'];

export function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [skinTone, setSkinTone] = useState('medium');
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { addItem } = useCart();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Please upload an image first.');
      const form = new FormData();
      form.append('image', file);
      form.append('skinTone', skinTone);
      form.append('gender', gender);
      return apiFetch<{ success: boolean; data: AnalysisResult; savedRecordId?: string }>(
        '/api/analyze',
        { method: 'POST', body: form },
      );
    },
    onSuccess: (res) => {
      setResult(res.data);
      showToast('Analysis complete!', 'success');
    },
    onError: (err: Error) => showToast(err.message),
  });

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { showToast('Please upload an image file.'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const oa = result?.outfit_analysis;
  const sp = result?.skin_palette;
  const score = Math.max(0, Math.min(100, Number(oa?.score ?? 0)));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Outfit Studio</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Analyse Your Look</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[#B5674D] transition-colors min-h-[280px] flex flex-col items-center justify-center"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload outfit image"
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {preview ? (
            <img src={preview} alt="Outfit preview" className="max-h-60 mx-auto rounded object-contain" />
          ) : (
            <>
              <p className="text-4xl mb-3">📸</p>
              <p className="text-[var(--text-secondary)]">Drop an outfit photo or click to upload</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">JPEG, PNG, WebP · Max 10MB</p>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-3">Skin Tone</label>
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setSkinTone(t)}
                  className={`chip capitalize cursor-pointer ${skinTone === t ? 'chip-rose' : ''}`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-3">Gender</label>
            <div className="flex gap-3">
              {(['women', 'men'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)} className={`btn ${gender === g ? 'btn-primary' : 'btn-outline'} text-xs py-2 capitalize`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => mutation.mutate()}
            disabled={!file || mutation.isPending}
          >
            {mutation.isPending ? 'Analysing...' : 'Analyse Outfit →'}
          </button>
        </div>
      </div>

      {mutation.isPending && <LoadingSpinner label="Analysing your outfit..." />}

      {result && oa && sp && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-6">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Outfit Assessment</p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl mb-4">{oa.style_category}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{oa.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="chip chip-rose">Score {score}/100</span>
              <span className="chip">{oa.occasion}</span>
            </div>
            <div className="h-2 bg-[var(--bg-muted)] rounded-full mb-4">
              <div className="h-full bg-[#B5674D] rounded-full transition-all" style={{ width: `${score}%` }} />
            </div>
            <p className="text-sm">{oa.feedback}</p>
            {oa.detected_colors?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {oa.detected_colors.map(c => <span key={c} className="chip chip-gold">{c}</span>)}
              </div>
            )}
          </div>

          <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-6">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Colour Palette</p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl mb-4">Your Best Colours</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{sp.summary}</p>
            {sp.hex_palette?.length > 0 && (
              <div className="flex gap-2 mb-4">
                {sp.hex_palette.slice(0, 6).map(h => (
                  <div key={h} className="w-8 h-8 rounded-full border border-[var(--border)]" style={{ background: h }} />
                ))}
              </div>
            )}
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Wear These</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {sp.best_colors?.map(c => <span key={c} className="chip chip-rose">{c}</span>)}
            </div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Avoid</p>
            <div className="flex flex-wrap gap-2">
              {sp.avoid_colors?.map(c => <span key={c} className="chip">{c}</span>)}
            </div>
          </div>

          {result.shopping_picks?.items?.length > 0 && (
            <div className="md:col-span-2 border border-[var(--border)] bg-[var(--bg-surface)] p-6">
              <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Shopping Picks</p>
              <p className="text-sm text-[var(--text-secondary)] mb-6">{result.shopping_picks.intro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {result.shopping_picks.items.map((item, i) => (
                  <div key={i} className="border border-[var(--border)] p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-[family-name:var(--font-display)]">{item.item}</h3>
                      <span className="chip text-xs">{item.price_range}</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">{item.why}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.retailers?.map(r => (
                        <a key={r.url} href={r.url} target="_blank" rel="noopener" className="chip chip-sage text-xs hover:opacity-80">
                          {r.name} ↗
                        </a>
                      ))}
                      <button
                        className="chip chip-rose text-xs cursor-pointer"
                        onClick={() => { addItem({ ...item, priceRange: item.price_range, styleTip: item.style_tip || '', story: oa.style_category }); showToast('Saved to cart!', 'success'); }}
                      >
                        Save to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
