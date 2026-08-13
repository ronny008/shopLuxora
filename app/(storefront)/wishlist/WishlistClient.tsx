"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { ProductCard } from '@/components/shared/ProductCard';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface WishlistClientProps {
  products: Product[];
}

export function WishlistClient({ products }: WishlistClientProps) {
  const { wishlistIds } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p._id));

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <h1 className="text-3xl font-bold uppercase tracking-wider text-black mb-8 text-center">Your Wishlist</h1>

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-4">Your wishlist is empty</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your wishlist yet. Explore our collections and find something you love!
          </p>
          <Link href="/products" className="btn-solid">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
          {wishlistedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
