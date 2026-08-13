"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LogOut, ShieldCheck } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { wishlistIds } = useWishlistStore();
  const { getTotalItems } = useCartStore();
  const { user, logout, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8 relative">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-script text-3xl md:text-4xl text-[#D32F2F] tracking-wide font-normal lowercase italic first-letter:uppercase">
              Luxora
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center justify-center">
          <nav className="hidden md:flex items-center space-x-8 text-[12px] font-semibold tracking-wider text-slate-800">
            <Link href="/" className="flex items-center gap-1 hover:text-red-600 transition-colors uppercase">
              HOME
              <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link href="/products" className="relative flex items-center gap-1 hover:text-red-600 transition-colors uppercase font-bold text-black group py-1">
              SHOP
              <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
            </Link>
            <Link href="/contact" className="hover:text-red-600 transition-colors uppercase">
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end space-x-5">
          <button 
            className="text-slate-800 hover:text-black transition-colors p-1" 
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            suppressHydrationWarning
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>
          {/* User Account Menu */}
          <div className="relative">
            {isMounted && user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 text-slate-800 hover:text-black transition-colors p-1"
                aria-label="User Menu"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
              </button>
            ) : (
              <Link href="/login" className="text-slate-800 hover:text-black transition-colors p-1" aria-label="User Account">
                <User className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}

            {isMounted && user && isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded-full">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5" />
                    My Profile
                  </Link>

                  {user.role === 'Admin' && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium text-indigo-600"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await logout();
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          <Link href="/wishlist" className="relative text-slate-800 hover:text-black transition-colors p-1" aria-label="Wishlist" suppressHydrationWarning>
            <Heart className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D32F2F] text-[9px] font-bold text-white">
              {isMounted ? wishlistIds.length : 0}
            </span>
          </Link>
          <Link href="/cart" className="relative text-slate-800 hover:text-black transition-colors p-1" aria-label="Cart">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D32F2F] text-[9px] font-bold text-white">
              {isMounted ? getTotalItems() : 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-md z-40 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="container mx-auto max-w-3xl flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Search products (e.g., 't-shirt', 'coffee')..." 
              className="flex-1 border border-gray-300 p-3 text-sm outline-none focus:border-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              suppressHydrationWarning
            />
            <button type="submit" className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors" suppressHydrationWarning>
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
