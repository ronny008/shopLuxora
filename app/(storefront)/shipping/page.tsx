import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-[70vh] bg-white font-sans-clean py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="border-b border-black pb-6 mb-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Link href="/" className="hover:text-black">Home</Link> / Policies
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Shipping Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: September 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-black p-6 bg-slate-50">
            <Truck className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Pan-India Delivery</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We ship to over 19,000 pincodes across India via premium courier partners.
            </p>
          </div>
          <div className="border border-black p-6 bg-slate-50">
            <Clock className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">2 - 7 Working Days</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Standard delivery takes 2 to 7 business days depending on delivery location.
            </p>
          </div>
          <div className="border border-black p-6 bg-slate-50">
            <ShieldCheck className="w-6 h-6 text-black mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Free Standard Shipping</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Enjoy complimentary shipping on all orders over Rs. 2,000.
            </p>
          </div>
        </div>

        <div className="prose max-w-none text-xs text-slate-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">1. Order Processing Time</h2>
            <p>
              All orders are processed and verified within 24 to 48 hours of payment confirmation (excluding Sundays and national holidays). Once your order is dispatched, tracking details are sent directly to your registered email address and phone number.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">2. Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders above Rs. 2,000: <strong>FREE Standard Shipping</strong>.</li>
              <li>Standard Flat Rate for orders below Rs. 2,000: Rs. 99 flat fee across India.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">3. Tracking Your Shipment</h2>
            <p>
              You can track your live shipment directly in your account under <Link href="/orders" className="underline font-bold text-black">My Orders</Link>. You will also receive SMS and WhatsApp tracking notifications from our courier partners once the package is out for delivery.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">4. Damaged or Tampered Shipments</h2>
            <p>
              If the exterior packaging appears damaged or tampered upon delivery, please do not accept the package or record an unboxing video and report it to <a href="mailto:luxoraclothing@gmail.com" className="underline font-bold text-black">luxoraclothing@gmail.com</a> within 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
