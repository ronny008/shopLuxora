import { OrderSuccessAnimation } from '@/components/storefront/OrderSuccessAnimation';
import Link from 'next/link';
import { api } from '@/lib/services/api';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const orderId = (params.orderId as string) || 'ORD-RECENT';
  
  // Try to find the actual order
  const orders = await api.orders.getAll();
  const order = orders.find(o => o._id === orderId);

  // If order not found in mock, fallback
  const displayOrderNumber = order?.orderNumber || orderId;
  const displayDate = order 
    ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const displayMethod = order?.payment.method || 'Credit Card';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 bg-gray-50">
      <div className="bg-white p-8 md:p-12 border border-black max-w-2xl w-full">
        <OrderSuccessAnimation>
          {/* Order Details Card */}
          <div className="mt-6 p-6 border border-black bg-gray-50 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-black">Order Number</span>
              <span className="text-sm font-bold text-black">{displayOrderNumber}</span>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-black">{displayDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-black">{displayMethod}</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              {order && (
                <Link 
                  href={`/orders/${order._id}/invoice`}
                  className="btn-outline w-full block text-center py-3"
                >
                  View / Print Bill
                </Link>
              )}
              <Link 
                href="/products" 
                className="btn-solid w-full block text-center py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </OrderSuccessAnimation>
      </div>
    </div>
  );
}
