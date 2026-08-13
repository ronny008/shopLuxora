"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/lib/mocks/data';
import { ProductCard } from '@/components/shared/ProductCard';
import { ChevronDown, ChevronUp, Check, X, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1250);
  const [sortBy, setSortBy] = useState<string>('alpha-asc');
  const [showRecentToast, setShowRecentToast] = useState(true);
  const [priceAccordionOpen, setPriceAccordionOpen] = useState(true);
  const [availabilityAccordionOpen, setAvailabilityAccordionOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductsList(data);
          }
        }
      } catch (err) {
        console.error('Error fetching products from API:', err);
      }
    }
    fetchProducts();
  }, []);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (inStockOnly && !outOfStockOnly) {
      result = result.filter(p => !p.isSoldOut);
    } else if (outOfStockOnly && !inStockOnly) {
      result = result.filter(p => p.isSoldOut);
    }

    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (sortBy === 'alpha-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'alpha-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [productsList, inStockOnly, outOfStockOnly, minPrice, maxPrice, sortBy]);

  const gridColsClass = useMemo(() => {
    if (columns === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (columns === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }, [columns]);

  return (
    <div className="min-h-screen bg-white font-sans-clean">
      {/* 1. Hero Banner Section */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop"
          alt="Luxora Clothing Banner"
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Breadcrumb Top Left */}
        <div className="absolute top-4 left-6 md:left-12 text-[11px] font-semibold text-slate-300 tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-white">Products</span>
        </div>

        {/* Banner Center Titles */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.15em] text-white drop-shadow-md">
            ALL PRODUCTS
          </h1>
          <p className="mt-2 text-xs md:text-sm italic font-serif text-slate-200 tracking-wide">
            Shop Our Favorites Styles
          </p>
        </div>
      </div>

      {/* 2. Main Store Layout */}
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            
            {/* Someone Recently Bought Toast / Card */}
            {showRecentToast && (
              <div className="relative border border-slate-200 bg-white p-3 shadow-xs transition-all">
                <button
                  onClick={() => setShowRecentToast(false)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-black transition-colors"
                  aria-label="Close widget"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-slate-100 flex-shrink-0 overflow-hidden">
                    <Image
                      src={productsList[0]?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'}
                      alt="Recent purchase product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 pr-3">
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">
                      Someone recently bought
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Filter Accordion */}
            <div className="border-b border-slate-200 pb-5">
              <button
                onClick={() => setAvailabilityAccordionOpen(!availabilityAccordionOpen)}
                className="w-full flex items-center justify-between py-1 text-[13px] font-bold text-slate-900 uppercase tracking-wider"
              >
                <span>Availability</span>
                {availabilityAccordionOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {availabilityAccordionOpen && (
                <div className="mt-4 space-y-2.5 text-[12px]">
                  <label className="flex items-center space-x-2.5 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded-none border-slate-300 text-black focus:ring-0 cursor-pointer"
                    />
                    <span>In stock ({productsList.filter(p => !p.isSoldOut).length})</span>
                  </label>
                  <label className="flex items-center space-x-2.5 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => setOutOfStockOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded-none border-slate-300 text-black focus:ring-0 cursor-pointer"
                    />
                    <span>Out of stock ({productsList.filter(p => p.isSoldOut).length})</span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Filter Accordion */}
            <div className="border-b border-slate-200 pb-5">
              <button
                onClick={() => setPriceAccordionOpen(!priceAccordionOpen)}
                className="w-full flex items-center justify-between py-1 text-[13px] font-bold text-slate-900 uppercase tracking-wider"
              >
                <span>Price</span>
                {priceAccordionOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {priceAccordionOpen && (
                <div className="mt-4 space-y-4">
                  {/* Slider visual representation */}
                  <div className="relative py-2">
                    <div className="h-1.5 w-full bg-slate-900 rounded-full relative">
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black cursor-pointer shadow-xs" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black cursor-pointer shadow-xs" />
                    </div>
                  </div>

                  {/* Price Range inputs */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center border border-slate-300 px-2.5 py-1.5 text-[12px] bg-white">
                      <span className="text-slate-500 mr-1.5">₹</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                        className="w-full bg-transparent outline-none text-slate-900 text-xs"
                        min={0}
                      />
                    </div>
                    <div className="flex-1 flex items-center border border-slate-300 px-2.5 py-1.5 text-[12px] bg-white">
                      <span className="text-slate-500 mr-1.5">₹</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value) || 1250)}
                        className="w-full bg-transparent outline-none text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="flex-1">
            
            {/* Grid Switcher & Sorting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              
              {/* Grid Column Selector Icons (2, 3, 4 bars) */}
              <div className="flex items-center space-x-2">
                {/* 2 columns */}
                <button
                  onClick={() => setColumns(2)}
                  className={`p-1.5 border transition-colors ${columns === 2 ? 'border-black text-black bg-slate-50' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
                  title="2 Columns View"
                  aria-label="2 Columns View"
                >
                  <div className="flex space-x-0.5">
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                  </div>
                </button>

                {/* 3 columns */}
                <button
                  onClick={() => setColumns(3)}
                  className={`p-1.5 border transition-colors ${columns === 3 ? 'border-black text-black bg-slate-50' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
                  title="3 Columns View"
                  aria-label="3 Columns View"
                >
                  <div className="flex space-x-0.5">
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                  </div>
                </button>

                {/* 4 columns */}
                <button
                  onClick={() => setColumns(4)}
                  className={`p-1.5 border transition-colors ${columns === 4 ? 'border-black text-black bg-slate-50' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
                  title="4 Columns View"
                  aria-label="4 Columns View"
                >
                  <div className="flex space-x-0.5">
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                    <span className="w-1 h-4 bg-current rounded-xs" />
                  </div>
                </button>
              </div>

              {/* Right Side: Sort By & Product Counter */}
              <div className="flex items-center space-x-6 text-[12px]">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-black transition-colors cursor-pointer"
                  >
                    <option value="alpha-asc">Alphabetically, A-Z</option>
                    <option value="alpha-desc">Alphabetically, Z-A</option>
                    <option value="price-low">Price, low to high</option>
                    <option value="price-high">Price, high to low</option>
                  </select>
                </div>
                <span className="text-slate-500 font-medium">
                  {filteredProducts.length} Products
                </span>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <p className="text-sm">No products found matching your current filter selection.</p>
                <button
                  onClick={() => {
                    setInStockOnly(false);
                    setOutOfStockOnly(false);
                    setMinPrice(0);
                    setMaxPrice(1250);
                  }}
                  className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${gridColsClass} gap-6 md:gap-8`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls at Bottom */}
            <div className="mt-12 pt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-9 h-9 flex items-center justify-center border text-[12px] font-bold transition-colors ${
                  currentPage === 1
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-9 h-9 flex items-center justify-center border text-[12px] font-bold transition-colors ${
                  currentPage === 2
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 2))}
                className="w-9 h-9 flex items-center justify-center border border-slate-300 bg-white text-slate-700 hover:border-black transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
