"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-8 relative font-sans-clean">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Newsletter Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
              SUBSCRIBE TO OUR NEWSLETTER
            </h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              Sign up for private sales, new launches, style tips and more.
            </p>
            <form className="mt-2 space-y-4" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  suppressHydrationWarning
                  className="w-full border border-white bg-transparent px-4 py-3 text-xs text-white placeholder-white/60 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                suppressHydrationWarning
                className="bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-colors duration-200"
              >
                SUBSCRIBE
              </button>
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center space-x-5 pt-4">
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Pinterest" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.6.03-2.29.14-.6.92-3.86.92-3.86s-.24-.47-.24-1.17c0-1.1.64-1.92 1.44-1.92.68 0 1.01.51 1.01 1.12 0 .68-.43 1.7-.66 2.65-.19.78.39 1.42 1.16 1.42 1.4 0 2.46-1.48 2.46-3.62 0-1.9-1.37-3.23-3.32-3.23-2.26 0-3.58 1.69-3.58 3.44 0 .68.26 1.41.59 1.81.06.07.07.15.05.23l-.19.79c-.03.11-.1.13-.21.08-1.47-.68-2.39-2.82-2.39-4.54 0-3.7 2.69-7.1 7.76-7.1 4.07 0 7.23 2.9 7.23 6.76 0 4.05-2.55 7.3-6.09 7.3-1.19 0-2.31-.62-2.7-1.35 0 0-.59 2.25-.73 2.78-.26.97-.97 2.18-1.45 2.91A11.96 11.96 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Policies Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
              POLICIES
            </h3>
            <ul className="space-y-4 text-[12px] text-white/80 font-medium">
              <li><Link href="/return-policy" className="hover:text-white hover:underline transition-colors">Return Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white hover:underline transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white hover:underline transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
              CONTACT US
            </h3>
            <ul className="space-y-4 text-[12px] text-white/80 font-medium">
              <li>Email: <a href="mailto:luxoraclothing@gmail.com" className="hover:text-white hover:underline transition-colors">luxoraclothing@gmail.com</a></li>
              <li>Phone: <a href="tel:+918848907268" className="hover:text-white hover:underline transition-colors">+91 8848 907 268</a></li>
              <li className="leading-relaxed">Business Hours : Monday - Friday : 9AM - 9PM IST</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 pt-6 border-t border-white/20 flex justify-between items-center text-[11px] text-white/70 font-medium relative">
          <p>© 2026, Luxora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
