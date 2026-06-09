import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../hooks/useCart';

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/shopping', label: 'Shopping' },
  { to: '/trends', label: 'Trends' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-md" style={{ background: 'var(--nav-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-[family-name:var(--font-display)] text-xl tracking-widest">
          MU<span className="text-[#B5674D]">S</span>E
        </Link>

        <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-16 left-0 right-0 md:top-auto flex-col md:flex-row md:items-center gap-1 md:gap-6 p-4 md:p-0 border-b md:border-0 border-[var(--border)] bg-[var(--nav-bg)]`}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm tracking-wide py-2 md:py-0 transition-colors ${isActive ? 'text-[#B5674D]' : 'text-[var(--text-secondary)] hover:text-[#B5674D]'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[#B5674D] transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-full text-sm hover:border-[#B5674D]"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span>{user.name}</span>
                {count > 0 && (
                  <span className="bg-[#B5674D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface)] border border-[var(--border)] shadow-lg rounded-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[var(--border)]">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                  </div>
                  <Link to="/cart" className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)]" onClick={() => setProfileOpen(false)}>
                    Cart / Wishlist ({count})
                  </Link>
                  <Link to="/wardrobe" className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)]" onClick={() => setProfileOpen(false)}>
                    My Wardrobe
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-muted)] text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn btn-outline text-xs px-4 py-2">Sign In</Link>
          )}

          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="w-5 h-0.5 bg-current" />
            <span className="w-5 h-0.5 bg-current" />
            <span className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>
    </nav>
  );
}
