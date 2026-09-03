"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { ShieldCheck, Lock, AlertCircle, Loader2, Info } from 'lucide-react';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutClient() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Form states prefilled from authenticated user if available
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Pre-load Razorpay checkout script
    loadRazorpayScript();
  }, []);

  // Update prefilled user fields when user loads
  useEffect(() => {
    if (user) {
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.name && (!firstName && !lastName)) {
        const parts = user.name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [user, email, phone, firstName, lastName]);

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

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusNotice(null);
    setIsProcessing(true);
    setProcessingStage('Creating secure payment order...');

    try {
      // 1. Ensure Razorpay script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Could not load Razorpay checkout gateway. Please check your internet connection and try again.');
      }

      // 2. Prepare payload for server-side order creation
      const customerName = `${firstName} ${lastName}`.trim() || user?.name || 'Customer';
      const formattedAddress = `${firstName} ${lastName}, ${address}, ${city}, ${postalCode}${phone ? `, Phone: ${phone}` : ''}`;

      const payload = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          phone,
        },
        customerName,
        customerEmail: email,
        customerPhone: phone,
        userId: user?._id || user?.name || customerName,
      };

      // 3. Call backend to create Razorpay order with server-calculated price
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order on server.');
      }

      setProcessingStage('Opening Razorpay Checkout...');

      // 4. Configure Razorpay Standard Checkout options
      const options = {
        key: orderData.key,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'LUXORA',
        description: `Order #${orderData.orderNumber}`,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setProcessingStage('');
            setStatusNotice('Payment was cancelled or window closed. Your cart items are preserved.');
          },
        },
        handler: async function (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          setProcessingStage('Verifying payment signature with server...');
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed on the server.');
            }

            // Successfully verified! Clear cart and redirect
            clearCart();
            router.push(`/checkout/success?orderId=${orderData.orderId}`);
          } catch (vErr: any) {
            setIsProcessing(false);
            setProcessingStage('');
            setErrorMessage(vErr.message || 'Payment signature verification failed. Please contact support.');
          }
        },
      };

      const razorpayCheckout = new (window as any).Razorpay(options);

      razorpayCheckout.on('payment.failed', function (failureResponse: any) {
        setIsProcessing(false);
        setProcessingStage('');
        const desc =
          failureResponse?.error?.description ||
          'Payment processing failed or was declined by the bank.';
        setErrorMessage(desc);
      });

      razorpayCheckout.open();
    } catch (err: any) {
      setIsProcessing(false);
      setProcessingStage('');
      setErrorMessage(err.message || 'An error occurred during checkout initialization.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="sr-only">Checkout</h2>

      {/* Notifications and Alert Banners */}
      {errorMessage && (
        <div className="mb-8 border border-red-600 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-800">Payment Error</h3>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {statusNotice && (
        <div className="mb-8 border border-amber-500 bg-amber-50 p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Payment Notice</h3>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">{statusNotice}</p>
          </div>
        </div>
      )}

      <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleRazorpayPayment} suppressHydrationWarning>
        <div>
          {/* Contact Information */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Contact information</h2>
              {user && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Signed in as {user.name}
                </span>
              )}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="email-address" className="block text-xs font-bold tracking-wider uppercase text-black">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="email"
                    id="email-address"
                    name="email-address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    placeholder="you@example.com"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone-number" className="block text-xs font-bold tracking-wider uppercase text-black">
                  Phone number <span className="text-slate-400 font-normal">(for delivery & SMS updates)</span>
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="phone-number"
                    name="phone-number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    placeholder="+91 98765 43210"
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mt-10 border-t border-black pt-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Shipping information</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="first-name" className="block text-xs font-bold tracking-wider uppercase text-black">
                  First name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    id="first-name"
                    name="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last-name" className="block text-xs font-bold tracking-wider uppercase text-black">
                  Last name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    id="last-name"
                    name="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-bold tracking-wider uppercase text-black">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    placeholder="Flat / Building / Street"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-bold tracking-wider uppercase text-black">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postal-code" className="block text-xs font-bold tracking-wider uppercase text-black">
                  Postal code <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    autoComplete="postal-code"
                    className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none"
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="mt-10 border-t border-black pt-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Payment method</h2>
            <div className="mt-6 border border-black p-5 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="razorpay-method"
                    name="payment-method"
                    defaultChecked
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="razorpay-method" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
                    Razorpay Secure Checkout
                  </label>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Official Gateway
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Pay safely using UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), NetBanking (50+ Banks), or Wallets.
              </p>

              {/* Supported payment badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                <span className="px-2 py-1 bg-white border border-slate-300">UPI</span>
                <span className="px-2 py-1 bg-white border border-slate-300">Cards</span>
                <span className="px-2 py-1 bg-white border border-slate-300">NetBanking</span>
                <span className="px-2 py-1 bg-white border border-slate-300">Wallets</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>256-bit encrypted. Card/banking credentials never touch our server.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">Order summary</h2>
          <div className="mt-6 border border-black bg-white rounded-none">
            <h3 className="sr-only">Items in your cart</h3>
            <ul role="list" className="divide-y divide-black max-h-[380px] overflow-y-auto">
              {items.map((item) => (
                <li key={item.id || item.product._id} className="flex px-4 py-6 sm:px-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.images[0] || 'https://placehold.co/100x100?text=Thumb'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-20 border border-black bg-slate-50 rounded-none object-cover aspect-square"
                    />
                  </div>
                  <div className="ml-6 flex flex-1 flex-col justify-center">
                    <div className="flex justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-black">{item.product.name}</div>
                      <p className="text-xs font-bold text-black">
                        Rs. {item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    {item.size && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-black/60">Size: {item.size}</p>
                    )}
                    <p className="mt-1 text-xs font-bold text-slate-500 uppercase">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-4 border-t border-black px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Subtotal</dt>
                <dd className="text-sm font-bold text-black">
                  Rs. {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Shipping</dt>
                <dd className="text-sm font-bold text-black">
                  Rs. {shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-bold tracking-wider uppercase text-slate-600">Taxes (8%)</dt>
                <dd className="text-sm font-bold text-black">
                  Rs. {tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-black pt-4">
                <dt className="text-sm font-bold tracking-[0.1em] uppercase text-black">Total</dt>
                <dd className="text-lg font-bold text-black">
                  Rs. {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </dd>
              </div>
            </dl>

            <div className="border-t border-black px-4 py-6 sm:px-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-solid w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{processingStage || 'Processing...'}</span>
                  </>
                ) : (
                  <span>Pay with Razorpay • Rs. {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-3">
                By clicking pay, you will be redirected to the official Razorpay secure payment gateway.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
