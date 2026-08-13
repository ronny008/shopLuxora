import { api } from '@/lib/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { updateOrderStatusAction } from '../actions';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orders = await api.orders.getAll();
  const order = orders.find(o => o._id === id);

  if (!order) {
    notFound();
  }

  // Get products for the order items
  const products = await api.products.getAll();

  const getProductDetails = (productId: string) => {
    return products.find(p => p._id === productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Order {order.orderNumber}</h1>
        <Link href="/dashboard/orders" className="btn-outline w-auto px-6 py-3">
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-black p-6 rounded-none">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => {
                const product = getProductDetails(item.productId);
                return (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-black/10 last:border-0">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 bg-gray-100 flex-shrink-0 border border-black overflow-hidden">
                        {product?.images[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-black">{product?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-black uppercase mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-black uppercase">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-black flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-wider text-black">Total</span>
              <span className="text-xl font-bold text-black">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white border border-black p-6 rounded-none">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Customer Details</h2>
            <div className="space-y-2 text-xs uppercase tracking-wider">
              <p><span className="font-bold">User ID:</span> {order.userId}</p>
              <p><span className="font-bold">Address:</span> {order.address}</p>
              <p><span className="font-bold">Payment:</span> {order.payment.method} ({order.payment.status})</p>
              <p><span className="font-bold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white border border-black p-6 rounded-none">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Update Status</h2>
            <form action={updateOrderStatusAction}>
              <input type="hidden" name="orderId" value={order._id} />
              <div className="space-y-4">
                <select
                  name="status"
                  defaultValue={order.status}
                  className="sharp-input w-full h-12"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" className="btn-solid w-full">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
