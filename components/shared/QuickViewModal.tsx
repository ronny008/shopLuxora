"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import Link from 'next/link';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { addToCart, items } = useCartStore();
  const isWishlisted = wishlistIds.includes(product._id);
  const isInCart = items.some(item => item.product._id === product._id);
  
  const discountPercent = product.discountPercent || 10;
  const originalPrice = product.originalPrice || Math.round(product.price * 1.15);
  const rating = product.rating ?? 5;
  const reviewCount = product.reviewCount ?? 3;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl animate-in zoom-in-95 duration-200 rounded-sm">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-slate-500 hover:text-black hover:bg-slate-100 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image Section */}
          <div className="relative aspect-[4/5] w-full bg-slate-50">
            <Image
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <div className="bg-[#C8102E] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                OFFER -{discountPercent}%
              </div>
              {product.isSoldOut && (
                <div className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Sold Out
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-black mb-2">
              {product.name}
            </h2>

            {/* Ratings */}
            <div className="flex items-center space-x-1 mb-4">
              <div className="flex text-[#006437]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'fill-[#006437]' : 'fill-transparent'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 ml-2 font-medium">({reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-2xl font-bold text-black">
                Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-slate-400 line-through font-medium">
                Rs. {originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center space-x-4">
                <button 
                  disabled={product.isSoldOut}
                  onClick={() => addToCart(product)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    isInCart 
                      ? "bg-[#006437] text-white hover:bg-[#004e2b]" 
                      : "btn-solid"
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 ${isInCart ? "fill-[#006437]" : ""}`} />
                  <span>
                    {product.isSoldOut 
                      ? 'Out of Stock' 
                      : isInCart ? 'Add Another' : 'Add to Cart'
                    }
                  </span>
                </button>
                <button 
                  onClick={() => toggleWishlist(product._id)}
                  className="p-3.5 border-2 border-black hover:bg-slate-50 transition-colors"
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C8102E] text-[#C8102E] stroke-[#C8102E]' : 'text-black stroke-[1.5]'}`} />
                </button>
              </div>
              <div className="text-center">
                <Link href={`/products/${product.slug}`} onClick={onClose} className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-black underline underline-offset-4 transition-colors">
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
