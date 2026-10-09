"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword } from '@/lib/validation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const urlError = searchParams.get('error');

  const { login, user, isLoading, error, clearError, checkAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle URL errors (e.g. from redirect guards)
  useEffect(() => {
    if (urlError === 'admin_access_required') {
      setFormError('Administrator credentials are required to access that area.');
    } else if (urlError === 'unauthorized') {
      setFormError('Please sign in to access your requested page.');
    } else if (urlError === 'session_expired') {
      setFormError('Your session has expired. Please sign in again.');
    }
  }, [urlError]);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        const dest = callbackUrl && callbackUrl.startsWith('/dashboard') ? callbackUrl : '/dashboard';
        router.push(dest);
      } else {
        const dest = callbackUrl && !callbackUrl.startsWith('/dashboard') ? callbackUrl : '/profile';
        router.push(dest);
      }
    }
  }, [user, router, callbackUrl]);

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(email);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    } else if (field === 'password') {
      const err = validatePassword(password);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (formError) setFormError(null);
    clearError();
    if (touched.email) {
      const err = validateEmail(val);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (formError) setFormError(null);
    clearError();
    if (touched.password) {
      const err = validatePassword(val);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Mark all touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    const errors: { email?: string; password?: string } = {};
    if (emailErr) errors.email = emailErr;
    if (passwordErr) errors.password = passwordErr;

    setFieldErrors(errors);

    if (emailErr || passwordErr) {
      setFormError('Please resolve the errors below before submitting.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success && result.user) {
      // Role-based destination
      if (result.user.role === 'Admin') {
        const destination = callbackUrl && callbackUrl.startsWith('/dashboard')
          ? callbackUrl
          : '/dashboard';
        router.push(destination);
      } else {
        const destination = callbackUrl && !callbackUrl.startsWith('/dashboard')
          ? callbackUrl
          : '/profile';
        router.push(destination);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link href="/register" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      {(formError || error) && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{formError || error}</span>
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate suppressHydrationWarning>
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            suppressHydrationWarning
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlur('email')}
            aria-invalid={!!(touched.email && fieldErrors.email)}
            aria-describedby={touched.email && fieldErrors.email ? 'email-error' : undefined}
            className={`block w-full rounded-xl border px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm ${
              touched.email && fieldErrors.email
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'
            }`}
            placeholder="you@example.com"
          />
          {touched.email && fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              suppressHydrationWarning
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password')}
              aria-invalid={!!(touched.password && fieldErrors.password)}
              aria-describedby={touched.password && fieldErrors.password ? 'password-error' : undefined}
              className={`block w-full rounded-xl border px-4 py-2.5 pr-11 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm ${
                touched.password && fieldErrors.password
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.password && fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {fieldErrors.password}
            </p>
          )}
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
