import { api } from '@/lib/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FadeIn } from '@/components/shared/FadeIn';
import { PrintButton } from '@/components/shared/PrintButton';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="container mx-auto px-4 py-8 lg:py-12 bg-gray-50 min-h-screen flex justify-center">
      <FadeIn className="w-full max-w-4xl bg-white shadow-sm border border-slate-200 p-8 md:p-12">
        {/* Header Action */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Back to Profile
          </Link>
          <PrintButton />
        </div>

        {/* Invoice Content */}
        <div className="print:text-black">
          <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">INVOICE</h1>
              <p className="text-sm text-slate-500 mt-2">Order #{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black tracking-widest uppercase">LUXORA</h2>
              <p className="text-sm text-slate-500 mt-1">123 Fashion Street</p>
              <p className="text-sm text-slate-500">New York, NY 10001</p>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Billed To:</h3>
              <p className="text-sm text-slate-700 font-medium">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">{order.address}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Invoice Date:</h3>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Payment Status:</h3>
                <p className="text-sm text-slate-500 capitalize">{order.payment.status} via {order.payment.method}</p>
              </div>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                <th className="py-3 px-2">Item</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => {
                const product = getProductDetails(item.productId);
                return (
                  <tr key={idx} className="text-sm text-slate-700">
                    <td className="py-4 px-2">
                      <p className="font-medium text-slate-900">{product?.name || 'Unknown Product'}</p>
                    </td>
                    <td className="py-4 px-2 text-center">{item.quantity}</td>
                    <td className="py-4 px-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right font-medium text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={3} className="py-4 px-2 text-right text-sm font-semibold text-slate-900">Subtotal</td>
                <td className="py-4 px-2 text-right text-sm font-medium text-slate-900">${order.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-2 px-2 text-right text-sm text-slate-500">Shipping</td>
                <td className="py-2 px-2 text-right text-sm text-slate-500">$0.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-4 px-2 text-right text-lg font-bold text-slate-900 uppercase">Total</td>
                <td className="py-4 px-2 text-right text-lg font-bold text-slate-900">${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-16 text-center border-t border-slate-200 pt-8 text-sm text-slate-500">
            <p>Thank you for shopping with LUXORA.</p>
            <p className="mt-1">If you have any questions about this invoice, please contact support@luxora.com.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
