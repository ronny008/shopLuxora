"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, ArrowRightLeft, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCompareStore } from '@/lib/store/useCompareStore';
import { useEffect, useState } from 'react';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.discountPercent || 10;
  const originalPrice = product.originalPrice || Math.round(product.price * 1.15);
  const rating = product.rating ?? 5;
  const reviewCount = product.reviewCount ?? 3;
  const colors = product.colors || ['#000000', '#FFFFFF'];

  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { addToCart, items } = useCartStore();
  const { compareProducts, toggleCompare } = useCompareStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isWishlisted = isMounted ? wishlistIds.includes(product._id) : false;
  const isInCart = isMounted ? items.some(item => item.product._id === product._id) : false;
  const isCompared = isMounted ? compareProducts.some(p => p._id === product._id) : false;

  return (
    <div className="group flex flex-col items-center bg-white transition-transform duration-300">
      {/* Product Image Container */}
      <div className="relative block aspect-[3/4] w-full overflow-hidden bg-slate-100 mb-3 group/image">
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          {/* Primary Image */}
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'}
            alt={product.name}
            fill
            className="object-cover object-center transition-opacity duration-500 group-hover/image:opacity-0"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
          />
          {/* Secondary Image */}
          <Image
            src={product.images?.[1] || product.images?.[0] || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'}
            alt={`${product.name} alternate view`}
            fill
            className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
          />
        </Link>

        {/* Badges Container Top Left */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5 pointer-events-none">
          <div className="bg-[#C8102E] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-2xs">
            OFFER -{discountPercent}%
          </div>
          {product.isSoldOut && (
            <div className="bg-white border border-slate-300 text-slate-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              Sold Out
            </div>
          )}
        </div>
      </div>
      
      {/* Product Information */}
      <div className="flex flex-col items-center text-center px-1 w-full">
        {/* Product Title */}
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 line-clamp-1 hover:text-red-600 transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* Green Star Ratings */}
        <div className="flex items-center justify-center space-x-1 mt-1 mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= rating
                  ? 'fill-[#006437] text-[#006437]'
                  : 'fill-transparent text-[#006437]'
              }`}
            />
          ))}
          <span className="text-[9px] text-slate-500 ml-1 font-normal">
            {reviewCount} reviews
          </span>
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold mb-1.5">
          <span className="text-slate-900">
            Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-slate-400 line-through font-normal text-[10px]">
            Rs. {originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        {/* Color Swatch Dots */}
        <div className="flex items-center justify-center space-x-1.5 mb-3">
          {colors.map((colorHex, idx) => (
            <span
              key={idx}
              className="w-3 h-3 rounded-full border border-slate-300 inline-block cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: colorHex }}
              title={`Color option ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Toolbar Row (Shopping Bag, Quick View, Wishlist, Compare) */}
        <div className="flex items-center justify-center space-x-3 pt-1">
          <button 
            suppressHydrationWarning
            className={`${isInCart ? 'text-[#006437]' : 'text-slate-700'} hover:text-black transition-colors`} 
            title={isInCart ? "Add Another to Cart" : "Add to Cart"}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingBag className={`w-4 h-4 stroke-[1.5] ${isInCart ? 'fill-[#006437] stroke-[#006437]' : ''}`} />
          </button>
          <button 
            suppressHydrationWarning
            className="text-slate-700 hover:text-black transition-colors" 
            title="Quick View"
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
          >
            <Eye className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button 
            suppressHydrationWarning
            className={`${isWishlisted ? 'text-[#C8102E]' : 'text-slate-700'} hover:text-black transition-colors`} 
            title="Add to Wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product._id);
            }}
          >
            <Heart className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-[#C8102E] stroke-[#C8102E]' : ''}`} />
          </button>
          {/* Compare Button with Tooltip */}
          <div className="relative group/tooltip">
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
              {isCompared ? "Remove Compare" : "Compare"}
            </span>
            <button 
              suppressHydrationWarning
              className={`w-7 h-7 rounded-full text-white flex items-center justify-center transition-colors shadow-xs ${
                isCompared 
                  ? "bg-[#006437] hover:bg-[#004e2b]" 
                  : "bg-slate-800 hover:bg-black"
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(product);
              }}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
}
