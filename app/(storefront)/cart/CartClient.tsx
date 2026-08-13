"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { ShoppingBag } from 'lucide-react';

export function CartClient() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-black mb-8">Shopping Cart</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-slate-100 p-6 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-4">Your cart is empty</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Explore our collections!
          </p>
          <Link href="/products" className="btn-solid">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 5.00;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <h1 className="text-3xl font-bold uppercase tracking-wider text-black mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <ul role="list" className="divide-y divide-black border-t border-black">
            {items.map((item) => (
              <li key={item.id || item.product._id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <Image
                      src={item.product.images[0] || 'https://placehold.co/200x200?text=Thumb'}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover object-center sm:h-32 sm:w-32 bg-slate-100 border border-black rounded-none aspect-square"
                    />
                  </Link>
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                          <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                        </h3>
                      </div>
                      {item.size && (
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-black/60">Size: {item.size}</p>
                      )}
                      <p className="mt-1 text-sm font-medium text-black line-clamp-1">{item.product.description}</p>
                      <p className="mt-2 text-sm font-bold text-black">Rs. {item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                      <label htmlFor={`quantity-${item.id || item.product._id}`} className="sr-only">Quantity, {item.product.name}</label>
                      <select
                        id={`quantity-${item.id || item.product._id}`}
                        name={`quantity-${item.id || item.product._id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id || item.product._id, parseInt(e.target.value, 10))}
                        className="max-w-[80px] rounded-none border border-black bg-white px-3 py-2 text-left text-sm font-bold text-black focus:border-black focus:outline-none focus:ring-0"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>

                      <div className="absolute right-0 top-0 sm:relative sm:top-auto sm:ml-4 sm:pr-0">
                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item.id || item.product._id)}
                          className="-m-2 inline-flex p-2 text-slate-400 hover:text-black transition-colors"
                        >
                          <span className="sr-only">Remove</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex space-x-2 text-xs font-bold uppercase tracking-wider text-black">
                    <svg className="h-4 w-4 flex-shrink-0 text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span>{item.product.isSoldOut ? 'Out of stock' : 'In stock'}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <section aria-labelledby="summary-heading" className="mt-16 border border-black bg-white px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8 h-fit rounded-none">
          <h2 id="summary-heading" className="text-sm font-bold tracking-[0.2em] uppercase text-black">Order summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Subtotal</dt>
              <dd className="text-sm font-bold text-black">Rs. {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <dt className="flex items-center text-xs font-bold tracking-wider uppercase text-slate-600">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-bold text-black">Rs. {shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <dt className="flex text-xs font-bold tracking-wider uppercase text-slate-600">
                <span>Tax estimate</span>
              </dt>
              <dd className="text-sm font-bold text-black">Rs. {tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-black pt-4">
              <dt className="text-sm font-bold tracking-[0.1em] uppercase text-black">Order total</dt>
              <dd className="text-lg font-bold text-black">Rs. {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link 
              href="/checkout"
              className="btn-solid block text-center"
            >
              Checkout
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
