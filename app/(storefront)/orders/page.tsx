import { api } from '@/lib/services/api';
import Link from 'next/link';
import { CustomerOrdersClient } from './CustomerOrdersClient';
import { FadeIn } from '@/components/shared/FadeIn';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const user = await api.auth.getCurrentUser();
  const orders = user ? await api.orders.getByUser(user._id) : [];
  const products = await api.products.getAll();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Please Log In</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Log in to your Luxora account to view your order history and track shipments.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 px-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
      <FadeIn className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500 mt-1">
              View and track all your Luxora orders, invoices, and delivery status.
            </p>
          </div>
          <div>
            <Link
              href="/profile"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Account Overview
            </Link>
          </div>
        </div>

        <CustomerOrdersClient orders={orders} products={products} />
      </FadeIn>
    </div>
  );
}
