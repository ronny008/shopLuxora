import { api } from '@/lib/services/api';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await api.auth.getCurrentUser();
  const orders = user ? await api.orders.getByUser(user._id) : [];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your profile</h2>
        <Link href="/login" className="text-indigo-600 mt-4 inline-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Account Overview</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 border border-slate-200">
              <h2 className="text-lg font-medium text-slate-900 border-b pb-4 mb-4">Profile Info</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 font-medium">Name</dt>
                  <dd className="text-slate-900 mt-1">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Email</dt>
                  <dd className="text-slate-900 mt-1">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Member Since</dt>
                  <dd className="text-slate-900 mt-1">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
              <button className="mt-6 w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                Edit Profile
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Wishlist</h3>
                <p className="text-sm text-slate-500 mt-1">2 items saved</p>
              </div>
              <Link href="/wishlist" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View</Link>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200">
                <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Orders</h3>
              </div>
              <ul role="list" className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <li key={order._id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Order #{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-slate-500 capitalize">{order.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="h-16 w-16 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400 border">
                          Img
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4">
                      <Link href={`/orders/${order._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View Order
                      </Link>
                      <Link href={`/orders/${order._id}/invoice`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Invoice
                      </Link>
                    </div>
                  </li>
                ))}
                {orders.length === 0 && (
                  <li className="p-6 text-center text-sm text-slate-500">No orders found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
