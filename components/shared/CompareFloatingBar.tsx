"use client";

import { useEffect, useState } from 'react';
import { useCompareStore } from '@/lib/store/useCompareStore';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRightLeft } from 'lucide-react';

export function CompareFloatingBar() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompareStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted || compareProducts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 animate-in slide-in-from-bottom-full duration-300">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {compareProducts.map((product) => (
            <div key={product._id} className="relative flex items-center gap-3 bg-slate-50 p-2 pr-6 border border-slate-200 min-w-[200px]">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white">
                <Image
                  src={product.images[0] || 'https://placehold.co/100x100?text=Thumb'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black truncate">
                  {product.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  Rs. {product.price.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => removeFromCompare(product._id)}
                className="absolute top-1 right-1 text-slate-400 hover:text-black transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {compareProducts.length < 4 && (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 w-[200px] h-[66px] text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Add {4 - compareProducts.length} more
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={clearCompare}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-black underline underline-offset-4"
          >
            Clear All
          </button>
          <Link
            href="/compare"
            className="btn-solid flex items-center justify-center gap-2 whitespace-nowrap !py-2.5 !px-6 text-[11px]"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Compare Now ({compareProducts.length})</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
