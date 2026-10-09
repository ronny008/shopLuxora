"use client";

import { useState } from 'react';
import { Minus, Plus, Heart, ArrowRightLeft, X } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCompareStore } from '@/lib/store/useCompareStore';
import { useRouter } from 'next/navigation';

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [agreed, setAgreed] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const router = useRouter();

  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { toggleCompare } = useCompareStore();

  const isWishlisted = wishlistIds.includes(product._id);

  const [isAdded, setIsAdded] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push('/cart');
  };

  return (
    <>
      {/* Size Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-black">Size: <span className="font-normal text-black/60">{selectedSize}</span></p>
          <button onClick={() => setShowSizeChart(true)} className="text-[10px] text-black underline flex items-center gap-1 font-bold hover:text-black/70 transition-colors">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M22 6l-10 7L2 6"></path></svg>
            Size Chart
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-10 px-4 text-xs font-bold uppercase border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'} transition-colors`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Warning */}
      <div className="mb-6 text-[11px] font-bold text-[#E2552B] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E2552B] animate-pulse"></span>
        Only {product.stock} items left in stock!
      </div>

      {/* Add to Cart Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-3">
          {/* Quantity */}
          <div className="flex items-center border border-black w-24 h-12">
            <button onClick={decreaseQuantity} className="w-8 h-full flex items-center justify-center text-black hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
            <input type="text" value={quantity} readOnly className="w-8 h-full text-center text-sm font-bold bg-transparent outline-none" />
            <button onClick={increaseQuantity} className="w-8 h-full flex items-center justify-center text-black hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 text-xs font-bold uppercase tracking-widest transition-all duration-300 h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAdded 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                : 'bg-black text-white hover:bg-black/90'
            }`}
          >
            {product.stock === 0 ? (
              'Sold Out'
            ) : isAdded ? (
              <>
                <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Added to Cart!
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2 cursor-pointer mt-2">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 accent-black" 
          />
          <span className="text-[10px] font-bold text-black/70">I agree with the terms and conditions</span>
        </label>

        {/* Buy It Now */}
        <button 
          onClick={handleBuyNow}
          disabled={!agreed || product.stock === 0}
          className={`w-full text-white text-xs font-bold uppercase tracking-widest transition-colors h-12 flex items-center justify-center ${agreed && product.stock > 0 ? 'bg-[#7a7a7a] hover:bg-[#666666]' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
        >
          Buy it now
        </button>
      </div>

      {/* Action Links */}
      <div className="flex flex-wrap gap-6 mb-8 text-[10px] font-bold uppercase tracking-wider text-black">
        <button onClick={() => toggleWishlist(product._id)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C8102E] text-[#C8102E] stroke-[#C8102E]' : ''}`} /> {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        </button>
        <button onClick={() => toggleCompare(product)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowRightLeft className="w-4 h-4" /> Compare
        </button>
      </div>
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 max-w-md w-full relative">
            <button onClick={() => setShowSizeChart(false)} className="absolute top-4 right-4 text-black hover:text-black/70">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-black">Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] tracking-wider text-black">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200">Size</th>
                    <th className="px-4 py-3 border-b border-gray-200">Chest (in)</th>
                    <th className="px-4 py-3 border-b border-gray-200">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-bold">XS</td>
                    <td className="px-4 py-3">36</td>
                    <td className="px-4 py-3">26</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-bold">S</td>
                    <td className="px-4 py-3">38</td>
                    <td className="px-4 py-3">27</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-bold">M</td>
                    <td className="px-4 py-3">40</td>
                    <td className="px-4 py-3">28</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-bold">L</td>
                    <td className="px-4 py-3">42</td>
                    <td className="px-4 py-3">29</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-bold">XL</td>
                    <td className="px-4 py-3">44</td>
                    <td className="px-4 py-3">30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">XXL</td>
                    <td className="px-4 py-3">46</td>
                    <td className="px-4 py-3">31</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[10px] text-gray-500">* All measurements are approximate and may vary slightly.</p>
          </div>
        </div>
      )}
    </>
  );
}
