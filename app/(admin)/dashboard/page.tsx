import { api } from '@/lib/services/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [orders, products, users] = await Promise.all([
    api.orders.getAll(),
    api.products.getAll(),
    api.auth.getAll(),
  ]);
  
  // Calculate real metrics from database
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const totalOrders = orders.length;
  const activeCustomers = users.filter(u => u.role === 'Customer').length;
  const totalStock = products.reduce((acc, prod) => acc + (prod.stock || 0), 0);

  return (
    <div className="space-y-12">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Dashboard</h1>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 border border-black rounded-none">
          <p className="text-xs font-bold uppercase tracking-wider text-black">Total Revenue</p>
          <p className="mt-4 text-3xl font-bold text-black">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 border border-black rounded-none">
          <p className="text-xs font-bold uppercase tracking-wider text-black">Total Orders</p>
          <p className="mt-4 text-3xl font-bold text-black">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 border border-black rounded-none">
          <p className="text-xs font-bold uppercase tracking-wider text-black">Active Customers</p>
          <p className="mt-4 text-3xl font-bold text-black">{activeCustomers}</p>
        </div>
        <div className="bg-white p-6 border border-black rounded-none">
          <p className="text-xs font-bold uppercase tracking-wider text-black">Products in Stock</p>
          <p className="mt-4 text-3xl font-bold text-black">{totalStock}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-black rounded-none">
        <div className="px-6 py-5 border-b border-black flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-xs font-bold uppercase tracking-wider text-black hover:underline underline-offset-4">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 10).map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{order.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">₹{order.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
