"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Loader2, LogOut, ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitialized, isLoading, checkAuth, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isMounted && isInitialized && !isLoading) {
      if (!user) {
        router.replace('/login?callbackUrl=/dashboard');
      }
    }
  }, [user, isInitialized, isLoading, isMounted, router]);

  // Loading state while verifying authentication
  if (!isMounted || !isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <p className="text-xs font-bold uppercase tracking-wider text-black">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <p className="text-xs font-bold uppercase tracking-wider text-black">Redirecting to Login...</p>
        </div>
      </div>
    );
  }

  // Logged in, but NOT an Admin (Role-Based Access Guard)
  if (user.role !== 'Admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="bg-white max-w-md w-full border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
            <p className="text-sm text-slate-600 mt-2">
              You do not have permission to view the Administrator Portal. This area is reserved strictly for administrative personnel.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1">
            <p className="text-slate-500">Current Session:</p>
            <p className="font-semibold text-slate-800">{user.name} ({user.email})</p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
              Role: {user.role}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/"
              className="block w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
            >
              Return to Storefront
            </Link>
            <Link
              href="/profile"
              className="block w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Go to My Account
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push('/login?callbackUrl=/dashboard');
              }}
              className="block w-full text-xs text-red-600 hover:text-red-700 font-semibold py-2"
            >
              Sign In with an Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is confirmed Admin -> Render Admin Layout
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-black text-black flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-black font-bold tracking-[0.2em] uppercase text-xs">
          ADMIN
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-2 text-xs font-bold uppercase tracking-wider">
            <Link href="/dashboard" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/orders" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Orders
            </Link>
            <Link href="/dashboard/products" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/dashboard/categories" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/dashboard/brands" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Brands
            </Link>
            <Link href="/dashboard/users" className="block px-4 py-3 border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Users
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-black">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline underline-offset-4">
            <ArrowLeft className="w-4 h-4 shrink-0 text-black" />
            <span>Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-black">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-black">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-black">{user.name}</div>
            <div className="h-8 w-8 bg-black text-white flex items-center justify-center font-bold text-xs uppercase">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              title="Sign Out"
              className="p-1 hover:text-red-600 transition-colors text-black cursor-pointer"
              suppressHydrationWarning
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
