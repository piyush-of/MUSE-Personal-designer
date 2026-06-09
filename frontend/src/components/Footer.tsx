import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl mb-3">
            MU<span className="text-[#B5674D]">S</span>E
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            AI-powered personal fashion intelligence. Analyse outfits, discover your best colours, and shop with confidence.
          </p>
        </div>
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-4">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link to="/analyze" className="hover:text-[#B5674D]">Outfit Analysis</Link>
            <Link to="/shopping" className="hover:text-[#B5674D]">Shopping</Link>
            <Link to="/trends" className="hover:text-[#B5674D]">Trends</Link>
            <Link to="/wardrobe" className="hover:text-[#B5674D]">My Wardrobe</Link>
          </div>
        </div>
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-4">Account</p>
          <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link to="/auth" className="hover:text-[#B5674D]">Sign In</Link>
            <Link to="/cart" className="hover:text-[#B5674D]">Cart</Link>
            <Link to="/about" className="hover:text-[#B5674D]">About</Link>
          </div>
        </div>
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#B5674D] mb-4">Tech</p>
          <p className="text-sm text-[var(--text-muted)]">
            React · TypeScript · Express · PostgreSQL · Prisma · Cloudinary · Gemini AI
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-6 py-4 text-center text-xs text-[var(--text-muted)]">
        © 2026 MUSE Studio. All rights reserved.
      </div>
    </footer>
  );
}
