"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { FallbackImage } from '@/components/shared/FallbackImage';
import { deleteProductAction } from '@/app/(admin)/dashboard/products/actions';
import { DeleteButton } from './DeleteButton';

export function ProductTableClient({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showFilter, setShowFilter] = useState(false);

  // Filter logic
  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Slug', 'Price', 'Stock', 'Status', 'Featured'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => 
        [p._id, `"${p.name}"`, p.slug, p.price, p.stock, p.status, p.isFeatured ? 'Yes' : 'No'].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-black rounded-none">
      <div className="px-4 sm:px-6 py-4 border-b border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input 
          type="text" 
          placeholder="SEARCH PRODUCTS..." 
          className="sharp-input w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 relative">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2 border border-black text-xs font-bold uppercase tracking-wider transition-colors rounded-none ${showFilter ? 'bg-black text-white' : 'text-black bg-white hover:bg-black hover:text-white'}`}
          >
            Filter {statusFilter !== 'ALL' && `(${statusFilter})`}
          </button>
          
          {showFilter && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black z-10 shadow-lg">
              <div className="p-2 border-b border-black text-xs font-bold uppercase tracking-wider bg-gray-100">Status</div>
              <ul>
                {['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map(status => (
                  <li key={status}>
                    <button 
                      onClick={() => { setStatusFilter(status); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-xs uppercase hover:bg-gray-100 ${statusFilter === status ? 'font-bold bg-gray-50' : ''}`}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-black text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-black hover:text-white transition-colors rounded-none"
          >
            Export
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full divide-y divide-black">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Product</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Price</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Stock</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Featured</th>
              <th scope="col" className="relative px-6 py-4 border-b border-black"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black/10">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm font-bold uppercase tracking-wider text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-white border border-black rounded-none overflow-hidden aspect-square relative">
                        <FallbackImage src={product.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-black">{product.name}</div>
                        <div className="text-xs text-black uppercase">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-black">
                    <span className={`px-3 py-1 inline-flex text-xs font-bold uppercase tracking-wider rounded-none ${product.stock > 10 ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {product.isFeatured ? (
                      <span className="inline-flex items-center justify-center text-[#D32F2F]">★</span>
                    ) : (
                      <span className="inline-flex items-center justify-center text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tracking-wider uppercase">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/dashboard/products/${product._id}/edit`} className="text-black hover:underline">Edit</Link>
                      <DeleteButton
                        action={deleteProductAction}
                        id={String(product._id)}
                        name={product.name}
                        itemType="product"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
