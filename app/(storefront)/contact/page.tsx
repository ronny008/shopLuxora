import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';

export const metadata = {
  title: 'Contact Us | LUXORA',
  description: 'Get in touch with Luxora customer service.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-12 pb-16 px-4 md:px-8 max-w-[1200px] mx-auto">
      <FadeIn>
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-[0.2em] mb-4">Contact Us</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            We are here to assist you with any inquiries regarding our collections, your orders, or our services.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <FadeIn delay={0.2} direction="up">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-[0.1em] mb-8 border-b border-black pb-4">Send a Message</h2>
            <form className="space-y-6" suppressHydrationWarning>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider">First Name</label>
                  <input type="text" id="firstName" className="sharp-input w-full" placeholder="JOHN" suppressHydrationWarning />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider">Last Name</label>
                  <input type="text" id="lastName" className="sharp-input w-full" placeholder="DOE" suppressHydrationWarning />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email Address</label>
                <input type="email" id="email" className="sharp-input w-full" placeholder="JOHN@EXAMPLE.COM" suppressHydrationWarning />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider">Subject</label>
                <input type="text" id="subject" className="sharp-input w-full" placeholder="HOW CAN WE HELP?" suppressHydrationWarning />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider">Message</label>
                <textarea id="message" rows={5} className="sharp-input w-full resize-none" placeholder="YOUR MESSAGE..." suppressHydrationWarning></textarea>
              </div>

              <button type="button" className="btn-solid group mt-4" suppressHydrationWarning>
                Send Message
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </FadeIn>

        {/* Contact Info */}
        <FadeIn delay={0.3} direction="up">
          <div className="space-y-12 h-full flex flex-col justify-start mt-2">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-[0.1em] mb-8 border-b border-black pb-4">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Our Boutique</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      123 Fashion Street<br />
                      Mumbai, 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Phone</h3>
                    <p className="text-sm text-gray-500">
                      +91 9876543210
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Mon-Fri, 9am - 6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Email</h3>
                    <a href="mailto:support@luxora.com" className="text-sm text-gray-500 hover:text-black transition-colors hover:underline underline-offset-4">
                      support@luxora.com
                    </a>
                    <p className="text-xs text-gray-400 mt-1">We aim to reply within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-black/10 mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
