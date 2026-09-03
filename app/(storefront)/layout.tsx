"use client";

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CompareFloatingBar } from '@/components/shared/CompareFloatingBar';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { useCompareStore } from '@/lib/store/useCompareStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { compareProducts } = useCompareStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="print:hidden">
        <Header />
      </div>
      
      {/* Floating Compare Tab Left Edge */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 print:hidden">
        <Link
          href="/compare"
          className="bg-white text-slate-900 border border-l-0 border-slate-300 py-3 px-1.5 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
          aria-label="Compare Items"
        >
          <span className="w-1.5 h-3 bg-slate-400" />
          <span
            className="text-[9px] font-bold uppercase tracking-widest text-slate-800 [writing-mode:vertical-rl] rotate-180"
          >
            COMPARE
          </span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
            {isMounted ? compareProducts.length : 0}
          </span>
        </Link>
      </div>

      <main className="flex-1">
        {children}
        <CompareFloatingBar />
        <CartDrawer />
      </main>

      {/* Floating Scroll To Top Button Bottom Right */}
      <div className="fixed right-6 bottom-6 z-40 print:hidden">
        <button
          suppressHydrationWarning
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
