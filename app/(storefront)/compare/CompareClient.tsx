"use client";

import { useEffect, useState } from 'react';
import { useCompareStore } from '@/lib/store/useCompareStore';
import { useCartStore } from '@/lib/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Star, Check, ArrowRightLeft } from 'lucide-react';

export function CompareClient() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart, items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (compareProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-black mb-8">Compare Products</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-slate-100 p-6 rounded-full mb-6">
            <ArrowRightLeft className="w-12 h-12 text-slate-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-4">No products to compare</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
            You haven&apos;t selected any products to compare yet. Browse our store and click the compare icon to add items here.
          </p>
          <Link href="/products" className="btn-solid">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-black">Compare Products</h1>
        <button 
          onClick={clearCompare}
          className="text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-black underline underline-offset-4"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="w-1/5 p-4 border border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Features
              </th>
              {compareProducts.map((product) => (
                <th key={`header-${product._id}`} className="w-1/5 p-4 border border-slate-200 relative align-top">
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors z-10"
                    title="Remove from compare"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Link href={`/products/${product.slug}`} className="block group">
                    <div className="relative aspect-square w-full mb-4 bg-slate-50">
                      <Image
                        src={product.images[0] || 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black line-clamp-2 min-h-[40px] group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </th>
              ))}
              {/* Fill empty columns up to 4 */}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <th key={`empty-header-${i}`} className="w-1/5 p-4 border border-slate-200 bg-slate-50/50 align-middle text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                      <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Product</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr>
              <td className="p-4 border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800">
                Price
              </td>
              {compareProducts.map((product) => (
                <td key={`price-${product._id}`} className="p-4 border border-slate-200 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-black">
                      Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </td>
              ))}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <td key={`empty-price-${i}`} className="p-4 border border-slate-200 bg-slate-50/50"></td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr>
              <td className="p-4 border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800">
                Rating
              </td>
              {compareProducts.map((product) => {
                const rating = product.rating ?? 5;
                const reviewCount = product.reviewCount ?? 3;
                return (
                  <td key={`rating-${product._id}`} className="p-4 border border-slate-200">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-[#006437]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-[#006437]' : 'fill-transparent'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">({reviewCount} reviews)</span>
                    </div>
                  </td>
                );
              })}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <td key={`empty-rating-${i}`} className="p-4 border border-slate-200 bg-slate-50/50"></td>
              ))}
            </tr>

            {/* Availability Row */}
            <tr>
              <td className="p-4 border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800">
                Availability
              </td>
              {compareProducts.map((product) => (
                <td key={`stock-${product._id}`} className="p-4 border border-slate-200 text-center">
                  <span className={`text-xs font-bold uppercase tracking-wider ${product.isSoldOut ? 'text-red-600' : 'text-[#006437]'}`}>
                    {product.isSoldOut ? 'Out of Stock' : 'In Stock'}
                  </span>
                </td>
              ))}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <td key={`empty-stock-${i}`} className="p-4 border border-slate-200 bg-slate-50/50"></td>
              ))}
            </tr>

            {/* Description Row */}
            <tr>
              <td className="p-4 border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800 align-top">
                Description
              </td>
              {compareProducts.map((product) => (
                <td key={`desc-${product._id}`} className="p-4 border border-slate-200 align-top text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </td>
              ))}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <td key={`empty-desc-${i}`} className="p-4 border border-slate-200 bg-slate-50/50"></td>
              ))}
            </tr>

            {/* Actions Row */}
            <tr>
              <td className="p-4 border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800">
                Actions
              </td>
              {compareProducts.map((product) => {
                const isInCart = items.some(item => item.product._id === product._id);
                return (
                  <td key={`action-${product._id}`} className="p-4 border border-slate-200 text-center">
                    <button 
                      disabled={product.isSoldOut}
                      onClick={() => addToCart(product)}
                      className={`w-full flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        isInCart ? "bg-[#006437] text-white hover:bg-[#004e2b]" : "btn-solid"
                      }`}
                    >
                      {isInCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      <span className="text-xs">{product.isSoldOut ? 'Out of Stock' : isInCart ? 'Add Another' : 'Add to Cart'}</span>
                    </button>
                  </td>
                );
              })}
              {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                <td key={`empty-action-${i}`} className="p-4 border border-slate-200 bg-slate-50/50"></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
