import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { WardrobeItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

export function WardrobePage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['wardrobe'],
    queryFn: () => apiFetch<{ success: boolean; data: WardrobeItem[] }>('/api/wardrobe'),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/wardrobe/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] });
      showToast('Look removed from wardrobe.', 'success');
    },
    onError: (err: Error) => showToast(err.message),
  });

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-2">Saved Looks</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">My Wardrobe</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          {user.analysesUsed}/{user.analysesLimit} analyses used this month
        </p>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        data?.data.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--border)]">
            <p className="text-[var(--text-muted)] mb-4">No saved looks yet.</p>
            <Link to="/analyze" className="btn btn-primary">Analyse Your First Outfit →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data.map(item => (
              <div key={item.id} className="border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg">{item.styleCategory || 'Outfit Analysis'}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="chip chip-rose text-xs">Score {item.score}/100</span>
                    <span className="chip text-xs capitalize">{item.skinTone.replace('_', ' ')}</span>
                    <span className="chip text-xs">{item.gender}</span>
                    <span className="text-xs text-[var(--text-muted)]">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  {item.detectedColors?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.detectedColors.map(c => <span key={c} className="chip chip-gold text-xs">{c}</span>)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-red-500 text-sm hover:underline"
                  aria-label={`Delete look ${item.id}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
