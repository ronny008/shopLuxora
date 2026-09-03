import Link from 'next/link';
import { RotateCcw, PackageCheck, AlertCircle } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-[70vh] bg-white font-sans-clean py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="border-b border-black pb-6 mb-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Link href="/" className="hover:text-black">Home</Link> / Policies
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Return & Exchange Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">Hassle-free 7-day return and exchange policy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-black p-6 bg-slate-50">
            <RotateCcw className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">7-Day Window</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Initiate return or exchange requests within 7 calendar days of delivery.
            </p>
          </div>
          <div className="border border-black p-6 bg-slate-50">
            <PackageCheck className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Free Reverse Pickup</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Our courier will pick up the item directly from your doorstep at no additional charge.
            </p>
          </div>
          <div className="border border-black p-6 bg-slate-50">
            <AlertCircle className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Original Condition</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Garments must be unworn, unwashed with all original tags and packaging intact.
            </p>
          </div>
        </div>

        <div className="prose max-w-none text-xs text-slate-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">How to Request a Return or Exchange</h2>
            <p>
              To initiate a return or size exchange:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Log in to your account and navigate to <Link href="/orders" className="underline font-bold text-black">My Orders</Link>.</li>
              <li>Select the order and items you wish to return or exchange.</li>
              <li>Alternatively, email our customer concierge at <a href="mailto:luxoraclothing@gmail.com" className="underline font-bold text-black">luxoraclothing@gmail.com</a> with your Order ID and photos.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Refund Processing</h2>
            <p>
              Once your returned item arrives at our fulfillment warehouse and passes quality inspection (usually within 48 hours of receipt), your refund is credited back to your original payment method (via Razorpay) within 5 to 7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
