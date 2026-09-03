import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[70vh] bg-white font-sans-clean py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="border-b border-black pb-6 mb-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Link href="/" className="hover:text-black">Home</Link> / Policies
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">Effective Date: September 2026</p>
        </div>

        <div className="prose max-w-none text-xs text-slate-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, make a purchase, participate in interactive features, or communicate with us. This includes your name, shipping address, email address, phone number, and order details.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">2. How We Use Your Information</h2>
            <p>
              We use the collected information solely to process orders, facilitate doorstep delivery through our courier partners, send order status updates, and provide customer support. We do not sell or rent your personal data to any third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">3. Payment Security</h2>
            <p>
              Your payment information is handled with end-to-end encryption by Razorpay, a PCI-DSS Level 1 compliant payment gateway. Luxora does not collect or store credit card numbers, CVVs, or bank login credentials.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2">4. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us at <a href="mailto:luxoraclothing@gmail.com" className="underline font-bold text-black">luxoraclothing@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
