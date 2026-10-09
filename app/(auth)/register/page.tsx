"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isLoading, error, clearError, checkAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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

  const strength = getPasswordStrength(password);

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'name') {
      const err = validateName(name);
      setFieldErrors((prev) => ({ ...prev, name: err || undefined }));
    } else if (field === 'email') {
      const err = validateEmail(email);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    } else if (field === 'password') {
      const err = validatePassword(password, true);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
      if (touched.confirmPassword || confirmPassword) {
        const cErr = validateConfirmPassword(password, confirmPassword);
        setFieldErrors((prev) => ({ ...prev, confirmPassword: cErr || undefined }));
      }
    } else if (field === 'confirmPassword') {
      const err = validateConfirmPassword(password, confirmPassword);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: err || undefined }));
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (formError) setFormError(null);
    clearError();
    if (touched.name) {
      const err = validateName(val);
      setFieldErrors((prev) => ({ ...prev, name: err || undefined }));
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
      const err = validatePassword(val, true);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
    if (touched.confirmPassword && confirmPassword) {
      const cErr = validateConfirmPassword(val, confirmPassword);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: cErr || undefined }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (formError) setFormError(null);
    clearError();
    if (touched.confirmPassword) {
      const err = validateConfirmPassword(password, val);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, true);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (passwordErr) errors.password = passwordErr;
    if (confirmPasswordErr) errors.confirmPassword = confirmPasswordErr;

    setFieldErrors(errors);

    if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
      setFormError('Please resolve the errors highlighted below.');
      return;
    }

    const result = await register(name.trim(), email.trim(), password, 'Customer');
    if (result.success && result.user) {
      router.push('/profile');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create an account
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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate suppressHydrationWarning>
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            suppressHydrationWarning
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={!!(touched.name && fieldErrors.name)}
            aria-describedby={touched.name && fieldErrors.name ? 'name-error' : undefined}
            className={`block w-full rounded-xl border px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm ${
              touched.name && fieldErrors.name
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'
            }`}
            placeholder="John Doe"
          />
          {touched.name && fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password <span className="text-red-500">*</span>
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
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password')}
              aria-invalid={!!(touched.password && fieldErrors.password)}
              aria-describedby={touched.password && fieldErrors.password ? 'password-error' : undefined}
              className={`block w-full rounded-xl border px-4 py-2.5 pr-11 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm ${
                touched.password && fieldErrors.password
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'
              }`}
              placeholder="At least 6 characters"
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

          {/* Password strength meter */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Strength:</span>
                <span className={`font-semibold ${strength.color.split(' ')[1]}`}>
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-colors duration-200 ${
                      step <= strength.score ? strength.color.split(' ')[0] : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Must be at least 6 characters with a letter and a number.
              </p>
            </div>
          )}

          {touched.password && fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              suppressHydrationWarning
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              aria-invalid={!!(touched.confirmPassword && fieldErrors.confirmPassword)}
              aria-describedby={
                touched.confirmPassword && fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
              }
              className={`block w-full rounded-xl border px-4 py-2.5 pr-11 text-slate-900 placeholder-slate-400 outline-none transition-all text-sm ${
                touched.confirmPassword && fieldErrors.confirmPassword
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword
                  ? 'border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'
              }`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {fieldErrors.confirmPassword}
            </p>
          )}
          {confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword && (
            <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Passwords match
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 transition-all cursor-pointer"
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
