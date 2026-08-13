"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { createCheckoutOrder } from './actions';

export function CheckoutClient() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-black mb-8">Your cart is empty</h2>
        <Link href="/products" className="btn-solid">
          Go back to store
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 5.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert cart items to order items
    const orderItems = items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const form = e.target as HTMLFormElement;
    const address = `${form['first-name'].value} ${form['last-name'].value}, ${form['address'].value}, ${form['city'].value}, ${form['postal-code'].value}`;

    const customerName = form['first-name'].value ? `${form['first-name'].value} ${form['last-name'].value}` : 'Customer';
    const userId = user?._id || user?.name || customerName;

    // Call server action to create order in MongoDB
    const orderId = await createCheckoutOrder(userId, orderItems, total, address, 'Credit Card');

    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="sr-only">Checkout</h2>

      <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleSubmit} suppressHydrationWarning>
        <div>
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Contact information</h2>
            <div className="mt-6">
              <label htmlFor="email-address" className="block text-xs font-bold tracking-wider uppercase text-black">Email address</label>
              <div className="mt-2">
                <input required type="email" id="email-address" name="email-address" autoComplete="email" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-black pt-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Shipping information</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="first-name" className="block text-xs font-bold tracking-wider uppercase text-black">First name</label>
                <div className="mt-2">
                  <input required type="text" id="first-name" name="first-name" autoComplete="given-name" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>

              <div>
                <label htmlFor="last-name" className="block text-xs font-bold tracking-wider uppercase text-black">Last name</label>
                <div className="mt-2">
                  <input required type="text" id="last-name" name="last-name" autoComplete="family-name" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-bold tracking-wider uppercase text-black">Address</label>
                <div className="mt-2">
                  <input required type="text" name="address" id="address" autoComplete="street-address" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-bold tracking-wider uppercase text-black">City</label>
                <div className="mt-2">
                  <input required type="text" name="city" id="city" autoComplete="address-level2" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>

              <div>
                <label htmlFor="postal-code" className="block text-xs font-bold tracking-wider uppercase text-black">Postal code</label>
                <div className="mt-2">
                  <input required type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-black pt-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Payment</h2>
            <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
              <div className="col-span-4">
                <label htmlFor="card-number" className="block text-xs font-bold tracking-wider uppercase text-black">Card number</label>
                <div className="mt-2">
                  <input required type="text" id="card-number" name="card-number" autoComplete="cc-number" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" placeholder="0000 0000 0000 0000" suppressHydrationWarning />
                </div>
              </div>

              <div className="col-span-3 sm:col-span-2">
                <label htmlFor="expiration-date" className="block text-xs font-bold tracking-wider uppercase text-black">Expiration date (MM/YY)</label>
                <div className="mt-2">
                  <input required type="text" name="expiration-date" id="expiration-date" autoComplete="cc-exp" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" placeholder="MM/YY" suppressHydrationWarning />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="cvc" className="block text-xs font-bold tracking-wider uppercase text-black">CVC</label>
                <div className="mt-2">
                  <input required type="text" name="cvc" id="cvc" autoComplete="csc" className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" suppressHydrationWarning />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Order summary</h2>
          <div className="mt-6 border border-black bg-white rounded-none">
            <h3 className="sr-only">Items in your cart</h3>
            <ul role="list" className="divide-y divide-black">
              {items.map((item) => (
                <li key={item.id || item.product._id} className="flex px-4 py-6 sm:px-6">
                  <div className="flex-shrink-0">
                    <Image src={item.product.images[0] || 'https://placehold.co/100x100?text=Thumb'} alt={item.product.name} width={80} height={80} className="w-20 border border-black bg-slate-50 rounded-none object-cover aspect-square" />
                  </div>
                  <div className="ml-6 flex flex-1 flex-col justify-center">
                    <div className="flex justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-black">{item.product.name}</div>
                      <p className="text-xs font-bold text-black">Rs. {item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    {item.size && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-black/60">Size: {item.size}</p>
                    )}
                    <p className="mt-1 text-xs font-bold text-slate-500 uppercase">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <dl className="space-y-6 border-t border-black px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Subtotal</dt>
                <dd className="text-sm font-bold text-black">Rs. {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Shipping</dt>
                <dd className="text-sm font-bold text-black">Rs. {shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Taxes</dt>
                <dd className="text-sm font-bold text-black">Rs. {tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-black pt-6">
                <dt className="text-sm font-bold tracking-[0.1em] uppercase text-black">Total</dt>
                <dd className="text-lg font-bold text-black">Rs. {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd>
              </div>
            </dl>

            <div className="border-t border-black px-4 py-6 sm:px-6">
              <button type="submit" className="btn-solid w-full">Confirm order</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
