import { api } from '@/lib/services/api';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight, FileText, Eye, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await api.auth.getCurrentUser();
  const orders = user ? await api.orders.getByUser(user._id) : [];
  const products = await api.products.getAll();

  const getProductDetails = (productId: string) => {
    return products.find(p => p._id === productId);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your profile</h2>
        <Link href="/login" className="text-indigo-600 mt-4 inline-block font-semibold">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Account Overview</h1>
          {user.role === 'Admin' && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Admin Dashboard</span>
            </Link>
          )}
        </div>

        {user.role === 'Admin' && (
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-sm">Administrator Privileges Active</p>
                <p className="text-xs text-slate-300">You have full admin access to manage products, categories, orders, and users.</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0"
            >
              Go to Admin Portal &rarr;
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Profile Info</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Name</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Email</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Member Since</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
              <button className="mt-6 w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors uppercase tracking-wider">
                Edit Profile
              </button>
            </div>
            
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Wishlist</h3>
                <p className="text-xs text-slate-500 mt-0.5">Saved items</p>
              </div>
              <Link href="/wishlist" className="text-xs font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1">
                View Wishlist &rarr;
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-slate-900">Recent Orders</h3>
                  <p className="text-xs text-slate-500 mt-0.5">View your latest purchases and track delivery</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs font-bold text-slate-900 hover:text-indigo-600 inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors"
                >
                  View All Orders
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <ul role="list" className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <li key={order._id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-900 font-mono">Order #{order.orderNumber}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">₹{order.total.toFixed(2)}</p>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 mt-0.5 capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {order.items.map((item, idx) => {
                        const product = getProductDetails(item.productId);
                        return (
                          <div key={idx} className="relative h-16 w-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            {product?.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <div className="flex items-center gap-3">
                        <Link href={`/orders/${order._id}/invoice`} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          Invoice
                        </Link>
                        <Link href={`/orders/${order._id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
                {orders.length === 0 && (
                  <li className="p-8 text-center text-sm text-slate-500">No orders found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
