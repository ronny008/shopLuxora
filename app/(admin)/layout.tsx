"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Loader2, LogOut, ArrowLeft } from 'lucide-react';

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
    if (isMounted && isInitialized && (!user || user.role !== 'Admin')) {
      router.replace('/login');
    }
  }, [user, isInitialized, isMounted, router]);

  if (!isMounted || !isInitialized || isLoading || !user || user.role !== 'Admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <p className="text-xs font-bold uppercase tracking-wider text-black">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

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
          <div className="text-xs font-bold uppercase tracking-wider text-black">Admin Portal</div>
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
