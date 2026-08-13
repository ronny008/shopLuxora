import { api } from '@/lib/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await api.auth.getCurrentUser();
  const orders = user ? await api.orders.getByUser(user._id) : [];
  const order = orders.find(o => o._id === id);

  if (!order || !user) {
    notFound();
  }

  const products = await api.products.getAll();
  const getProductDetails = (productId: string) => {
    return products.find(p => p._id === productId);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
      <FadeIn className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="px-4 py-2 border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-colors">
              Back to Profile
            </Link>
            <Link href={`/orders/${order._id}/invoice`} className="px-4 py-2 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">
              View Invoice
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Order Items</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {order.items.map((item, idx) => {
              const product = getProductDetails(item.productId);
              return (
                <div key={idx} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                      {product?.images[0] && (
                        <Image src={product.images[0]} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-slate-900">
                        {product?.name || 'Unknown Product'}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-slate-50 p-6 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-slate-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Delivery Address</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 whitespace-pre-line">{order.address}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Payment Summary</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-medium text-slate-900 capitalize">{order.payment.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium capitalize ${order.payment.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.payment.status}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-3 mt-3">
                <span className="text-slate-500">Order Status</span>
                <span className="font-medium text-indigo-600 uppercase tracking-wider text-xs bg-indigo-50 px-2 py-1 rounded">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
