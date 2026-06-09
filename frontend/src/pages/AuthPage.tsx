import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('reset');

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const resetForm = useForm<{ password: string }>({
    resolver: zodResolver(z.object({
      password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/, 'Must contain a number'),
    })),
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      showToast('Welcome back!', 'success');
      navigate('/wardrobe');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      await register(data.name, data.email, data.password);
      showToast('Account created!', 'success');
      navigate('/analyze');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const onReset = async (data: { password: string }) => {
    if (!resetToken) return;
    try {
      await apiFetch(`/api/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      });
      showToast('Password reset! Please log in.', 'success');
      navigate('/auth');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Reset failed');
    }
  };

  if (resetToken) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8 text-center">Reset Password</h1>
        <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
          <input type="password" placeholder="New password" {...resetForm.register('password')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {resetForm.formState.errors.password && <p className="text-red-500 text-xs">{resetForm.formState.errors.password.message}</p>}
          <button type="submit" className="btn btn-primary w-full">Reset Password</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-2 text-center">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p className="text-center text-[var(--text-muted)] text-sm mb-8">
        {mode === 'login' ? 'Sign in to save looks and track your wardrobe.' : 'Join MUSE for personalised fashion intelligence.'}
      </p>

      <div className="flex gap-2 mb-8">
        <button onClick={() => setMode('login')} className={`flex-1 btn text-xs py-2 ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`}>Sign In</button>
        <button onClick={() => setMode('register')} className={`flex-1 btn text-xs py-2 ${mode === 'register' ? 'btn-primary' : 'btn-outline'}`}>Register</button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" noValidate>
          <input type="email" placeholder="Email" autoComplete="email" {...loginForm.register('email')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {loginForm.formState.errors.email && <p className="text-red-500 text-xs">{loginForm.formState.errors.email.message}</p>}
          <input type="password" placeholder="Password" autoComplete="current-password" {...loginForm.register('password')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {loginForm.formState.errors.password && <p className="text-red-500 text-xs">{loginForm.formState.errors.password.message}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loginForm.formState.isSubmitting}>
            {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" noValidate>
          <input type="text" placeholder="Full name" autoComplete="name" {...registerForm.register('name')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {registerForm.formState.errors.name && <p className="text-red-500 text-xs">{registerForm.formState.errors.name.message}</p>}
          <input type="email" placeholder="Email" autoComplete="email" {...registerForm.register('email')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {registerForm.formState.errors.email && <p className="text-red-500 text-xs">{registerForm.formState.errors.email.message}</p>}
          <input type="password" placeholder="Password (min 8, 1 uppercase, 1 number)" autoComplete="new-password" {...registerForm.register('password')} className="w-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 rounded text-sm" />
          {registerForm.formState.errors.password && <p className="text-red-500 text-xs">{registerForm.formState.errors.password.message}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={registerForm.formState.isSubmitting}>
            {registerForm.formState.isSubmitting ? 'Creating...' : 'Create Account →'}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        <Link to="/" className="hover:text-[#B5674D]">← Back to home</Link>
      </p>
    </div>
  );
}
