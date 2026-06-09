export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-label={label}>
      <div className="w-8 h-8 border-2 border-[#B5674D] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-mono)] tracking-wider uppercase text-xs">
        {label}
      </span>
    </div>
  );
}
