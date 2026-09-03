import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-[70vh] bg-white font-sans-clean py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="border-b border-black pb-6 mb-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Link href="/" className="hover:text-black">Home</Link> / Policies
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-2">Effective Date: September 2026</p>
        </div>

        <div className="prose max-w-none text-xs text-slate-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Luxora online boutique (luxora.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">2. Products and Pricing</h2>
            <p>
              All prices listed on Luxora are in Indian Rupees (INR) and are inclusive of all applicable taxes. We reserve the right to correct pricing errors, modify product descriptions, or discontinue items at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">3. Orders and Payments</h2>
            <p>
              Payments are securely processed via Razorpay. We do not store sensitive credit card or UPI banking credentials on our servers. An order is deemed confirmed only upon successful payment verification.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">4. Contact Information</h2>
            <p>
              Questions regarding these Terms should be sent to <a href="mailto:luxoraclothing@gmail.com" className="underline font-bold text-black">luxoraclothing@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
