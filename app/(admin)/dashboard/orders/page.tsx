import { api } from '@/lib/services/api';
import Link from 'next/link';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await api.orders.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Orders</h1>
        <Link href="/dashboard/orders/create" className="btn-solid !w-fit px-6 py-3">
          Add Order
        </Link>
      </div>

      <div className="bg-white border border-black rounded-none">
        <div className="px-4 sm:px-6 py-4 border-b border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="SEARCH ORDERS..."
            className="sharp-input w-full sm:w-64"
          />
          <div className="flex gap-2 shrink-0">
            <button className="px-4 py-2 border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors rounded-none">Filter</button>
            <button className="px-4 py-2 border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors rounded-none">Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Total</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider border-b border-black">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{order.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <OrderStatusSelect orderId={String(order._id)} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tracking-wider uppercase">
                    <Link href={`/dashboard/orders/${order._id}`} className="text-black hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
