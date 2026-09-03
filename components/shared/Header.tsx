"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LogOut, ShieldCheck, Package } from 'lucide-react';

const categoryLinks = [
  { name: 'All Products', href: '/products', badge: '16' },
  { name: "Men's Collection", href: '/categories/men', badge: 'Hot' },
  { name: "Women's Collection", href: '/categories/women', badge: 'New' },
  { name: 'Dresses', href: '/categories/dresses' },
  { name: 'Outerwear', href: '/categories/outerwear' },
  { name: 'Footwear', href: '/categories/footwear' },
  { name: 'Accessories', href: '/categories/accessories' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { wishlistIds } = useWishlistStore();
  const { getTotalItems, openCart } = useCartStore();
  const { user, logout, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Close mobile menu on page navigation
  const pathname = usePathname();
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

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

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navItems = [
    { id: 'home', label: 'HOME', href: '/', hasDropdown: false },
    { id: 'shop', label: 'SHOP', href: '/products', hasDropdown: true },
    { id: 'categories', label: 'COLLECTIONS', href: '/categories', hasDropdown: false },
    { id: 'contact', label: 'CONTACT', href: '/contact', hasDropdown: false },
  ];

  const getActiveNav = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/products') || pathname.startsWith('/shop') || pathname.startsWith('/checkout')) return 'shop';
    return 'shop';
  };

  const activeNav = getActiveNav();
  const currentIndicator = hoveredNav || activeNav;

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8 relative">
        {/* Left: Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-800 hover:text-black p-1 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="font-script text-3xl md:text-4xl text-[#D32F2F] tracking-wide font-normal lowercase italic first-letter:uppercase">
              Luxora
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="flex items-center justify-center">
          <nav
            className="hidden md:flex items-center space-x-8 text-[12px] tracking-wider relative"
            onMouseLeave={() => {
              setHoveredNav(null);
              setIsShopDropdownOpen(false);
            }}
          >
            {navItems.map((item) => {
              const isCurrent = currentIndicator === item.id;
              if (item.id === 'shop') {
                return (
                  <div
                    key={item.id}
                    className="relative py-1"
                    onMouseEnter={() => {
                      setHoveredNav('shop');
                      setIsShopDropdownOpen(true);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 transition-colors uppercase ${
                        isCurrent ? 'font-bold text-black' : 'font-semibold text-slate-700 hover:text-black'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isShopDropdownOpen ? 'rotate-180 text-black' : 'text-slate-500'
                        }`}
                      />
                    </Link>

                    {/* Desktop Shop Mega Dropdown */}
                    <AnimatePresence>
                      {isShopDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-64"
                        >
                          <div className="bg-white border border-slate-200 shadow-xl py-3 px-2 rounded-xs">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1 mb-1">
                              Browse by Category
                            </div>
                            {categoryLinks.map((cat) => (
                              <Link
                                key={cat.href}
                                href={cat.href}
                                onClick={() => setIsShopDropdownOpen(false)}
                                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-colors uppercase tracking-wider"
                              >
                                <span>{cat.name}</span>
                                {cat.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-900 text-white rounded-xs">
                                    {cat.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isCurrent && (
                      <motion.span
                        layoutId="header-nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black pointer-events-none"
                        transition={{
                          type: 'spring',
                          stiffness: 450,
                          damping: 32,
                        }}
                      />
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => {
                    setHoveredNav(item.id);
                    setIsShopDropdownOpen(false);
                  }}
                  className={`relative flex items-center gap-1 py-1 transition-colors uppercase ${
                    isCurrent ? 'font-bold text-black' : 'font-semibold text-slate-700 hover:text-black'
                  }`}
                >
                  {item.label}
                  {isCurrent && (
                    <motion.span
                      layoutId="header-nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-black pointer-events-none"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                </Link>
              );
            })}
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

                  <Link
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium text-slate-900"
                  >
                    <Package className="w-3.5 h-3.5" />
                    My Orders
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
          <button
            type="button"
            onClick={openCart}
            className="relative text-slate-800 hover:text-black transition-colors p-1 cursor-pointer"
            aria-label="Cart"
            suppressHydrationWarning
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D32F2F] text-[9px] font-bold text-white"
              suppressHydrationWarning
            >
              {isMounted ? getTotalItems() : 0}
            </span>
          </button>
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

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[90] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slideout Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header in Drawer */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-script text-3xl text-[#D32F2F] italic">
                    Luxora
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="py-3 px-4 space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>Collections</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>Contact Us</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>

                {/* Categories Quick Links */}
                <div className="pt-2 pb-4 px-4 border-t border-slate-100">
                  <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Categories
                  </p>
                  <div className="space-y-0.5">
                    {categoryLinks.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-3 text-xs font-semibold text-slate-700 hover:text-black hover:bg-slate-50 rounded-md transition-colors uppercase tracking-wider"
                      >
                        <span>{cat.name}</span>
                        {cat.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-900 text-white rounded-xs">
                            {cat.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Footer in Drawer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                {isMounted && user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center py-2 px-3 bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-900 rounded-md hover:border-black"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center py-2 px-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800"
                      >
                        Orders
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2.5 px-3 bg-white border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-900 rounded-md hover:border-black"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2.5 px-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
