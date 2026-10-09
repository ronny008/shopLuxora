import { api } from '@/lib/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { CheckCircle2, Clock, Truck, Package, MapPin, CreditCard, ArrowLeft, FileText, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await api.auth.getCurrentUser();
  
  if (!user) {
    notFound();
  }

  // Find order by ID or Order Number
  const order = await api.orders.getById(id);

  if (!order) {
    notFound();
  }

  const products = await api.products.getAll();
  const getProductDetails = (productId: string) => {
    return products.find(p => p._id === productId);
  };

  // Define tracking steps
  const currentStatusIndex = (() => {
    const s = order.status.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'out_for_delivery') return 3;
    if (s === 'shipped') return 2;
    if (s === 'processing' || s === 'pending') return 1;
    return 0; // placed
  })();

  const steps = [
    { title: 'Order Placed', desc: 'Received & Confirmed', icon: Package },
    { title: 'Processing', desc: 'Packing your items', icon: Clock },
    { title: 'Shipped', desc: 'In transit with carrier', icon: Truck },
    { title: 'Out for Delivery', desc: 'With local courier', icon: MapPin },
    { title: 'Delivered', desc: 'Package arrived', icon: CheckCircle2 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen bg-slate-50/50">
      <FadeIn className="max-w-4xl mx-auto space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-mono">
                Order #{order.orderNumber}
              </h1>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Orders
            </Link>
            <Link
              href={`/orders/${order._id}/invoice`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              View / Print Invoice
            </Link>
          </div>
        </div>

        {/* Live Order Tracker Stepper */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Shipment Status Tracker
          </h2>

          <div className="relative">
            {/* Progress Bar background line */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0" />
            
            {/* Active Progress line */}
            <div
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
              style={{
                width: `${(currentStatusIndex / (steps.length - 1)) * 100}%`,
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              Order Items ({order.items.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100 p-6">
            {order.items.map((item, idx) => {
              const product = getProductDetails(item.productId);
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="relative h-20 w-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      {product?.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {product?.name || 'Unknown Product'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Quantity: <span className="font-semibold text-slate-800">{item.quantity}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Price per item: ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Standard Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t border-slate-200 pt-3 mt-3">
              <span>Total Amount Paid</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Address and Payment details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Shipping Address</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {order.address}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Payment Information</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800 capitalize">{order.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-bold text-emerald-600 capitalize bg-emerald-50 px-2 py-0.5 rounded">
                  {order.payment.status}
                </span>
              </div>
              {order.payment.razorpayPaymentId && (
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-700 text-[11px]">{order.payment.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
