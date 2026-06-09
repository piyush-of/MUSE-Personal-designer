import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export function CartPage() {
  const { items, removeItem, updateTarget, alerts } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Wishlist</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Cart</h1>
        {alerts.length > 0 && (
          <p className="text-[#6A8F72] text-sm mt-2">
            {alerts.length} item{alerts.length > 1 ? 's are' : ' is'} within your target price!
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border)]">
          <p className="text-[var(--text-muted)] mb-4">Your cart is empty.</p>
          <Link to="/shopping" className="btn btn-primary">Browse Shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="border border-[var(--border)] bg-[var(--bg-surface)] p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg">{item.item}</h3>
                  <span className="chip text-xs mt-1">{item.priceRange}</span>
                  {item.story && <span className="chip chip-rose text-xs ml-2">{item.story}</span>}
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
              {item.why && <p className="text-sm text-[var(--text-muted)] mb-3">{item.why}</p>}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.retailers?.map(r => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener" className="chip chip-sage text-xs hover:opacity-80">{r.name} ↗</a>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-[var(--text-muted)]">Target price (₹):</label>
                <input
                  type="number"
                  value={item.targetPrice ?? ''}
                  onChange={e => updateTarget(item.id, e.target.value ? Number(e.target.value) : null)}
                  className="border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1 text-sm w-28 rounded"
                  placeholder="e.g. 1500"
                  aria-label={`Target price for ${item.item}`}
                />
                {item.targetPrice && item.currentFloor && item.currentFloor <= item.targetPrice && (
                  <span className="text-xs text-[#6A8F72]">✓ Within target</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
