"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isLoading, error, clearError, checkAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Customer' | 'Admin'>('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!name || !email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const result = await register(name, email, password, role);
    if (result.success && result.user) {
      if (result.user.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link href="/login" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
            sign in to your existing account
          </Link>
        </p>
      </div>

      {(formError || error) && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{formError || error}</span>
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} suppressHydrationWarning>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            suppressHydrationWarning
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            suppressHydrationWarning
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              suppressHydrationWarning
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
            Account Type
          </label>
          <select
            id="role"
            value={role}
            suppressHydrationWarning
            onChange={(e) => setRole(e.target.value as 'Customer' | 'Admin')}
            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
          >
            <option value="Customer">Customer (Storefront)</option>
            <option value="Admin">Administrator (Dashboard)</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
