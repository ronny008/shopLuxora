"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  Loader2,
  LogOut,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Users,
  Palette,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Categories', href: '/dashboard/categories', icon: Layers },
  { name: 'Brands', href: '/dashboard/brands', icon: Tag },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Landing Page UI', href: '/dashboard/landing-page', icon: Palette },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, isLoading, checkAuth, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
    try {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {}
  }, [checkAuth]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

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
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-black flex flex-col transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-black font-bold tracking-[0.2em] uppercase text-xs">
          <span>ADMIN PORTAL</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1.5 text-xs font-bold uppercase tracking-wider">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border transition-colors ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'text-black border-transparent hover:border-black hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-black">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-black" />
            <span>Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-black text-black transition-[width] duration-300 ease-in-out shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-black px-4 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed ? (
            <>
              <span className="font-bold tracking-[0.2em] uppercase text-xs">ADMIN</span>
              <button
                onClick={toggleCollapse}
                title="Collapse Sidebar"
                className="p-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer border border-transparent hover:border-black"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleCollapse}
              title="Expand Sidebar"
              className="p-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer border border-transparent hover:border-black"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className={`space-y-1.5 text-xs font-bold uppercase tracking-wider ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center transition-colors border ${
                    isCollapsed
                      ? 'justify-center py-3 px-2'
                      : 'gap-3 px-4 py-3'
                  } ${
                    isActive
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'text-black border-transparent hover:border-black hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-black">
          <Link
            href="/"
            title={isCollapsed ? "Storefront" : undefined}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline underline-offset-4 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-black" />
            {!isCollapsed && <span>Storefront</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-black shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 md:hidden hover:bg-black hover:text-white transition-colors border border-black cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Quick Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1.5 hover:bg-black hover:text-white transition-colors border border-black cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-black truncate">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-black hidden sm:block truncate max-w-[150px]">
              {user.name}
            </div>
            <div className="h-8 w-8 bg-black text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              title="Sign Out"
              className="p-1 hover:text-red-600 transition-colors text-black cursor-pointer shrink-0"
              suppressHydrationWarning
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
