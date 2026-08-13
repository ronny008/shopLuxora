import Link from 'next/link';
import { api } from '@/lib/services/api';
import { ProductCard } from '@/components/shared/ProductCard';
import { HeroCarousel } from '@/components/storefront/HeroCarousel';
import { FadeIn } from '@/components/shared/FadeIn';
import Image from 'next/image';
import { Package, Truck, Gem, User } from "lucide-react";

export default async function StorefrontHomePage() {
  const products = await api.products.getAll();
  
  // Use products for different sections
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 5);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Hero Carousel Section */}
      <HeroCarousel />

      {/* 2. Featured Products Section */}
      <section className="container mx-auto px-4 py-16 overflow-hidden">
        <FadeIn delay={0.1}>
          <h2 className="text-xl font-bold tracking-[0.1em] uppercase text-black mb-8">
            Featured Products
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
          {featuredProducts.map((product, i) => (
            <FadeIn key={product._id} delay={0.2 + (i * 0.1)}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 3. Shop Categories Banners */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-16 container mx-auto overflow-hidden">
        <FadeIn direction="left" delay={0.1}>
          <div className="relative h-[400px] md:h-[500px] group overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop")' }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/categories/men" className="bg-white/80 backdrop-blur-sm hover:bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-colors">
                SHOP NOW
              </Link>
            </div>
          </div>
        </FadeIn>
        <FadeIn direction="right" delay={0.2}>
          <div className="relative h-[400px] md:h-[500px] group overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop")' }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/categories/women" className="bg-white/80 backdrop-blur-sm hover:bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-colors">
                SHOP NOW
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Luxora Collection Section (Ready-to-Wear) */}
      <section className="w-full px-4 md:px-8 py-10 container mx-auto">
        <FadeIn delay={0.1}>
          <div className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-black">
              LUXORA
            </h2>
            <p className="text-xs text-slate-500 font-sans-clean mt-1">
              Discover the Ready-to-Wear Collections
            </p>
          </div>
        </FadeIn>
        
        {/* 4 Cards Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1 */}
          <FadeIn delay={0.2}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 group">
              <Image
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop"
                alt="Luxora Coffee Back Graphic"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn delay={0.3}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 group">
              <div className="absolute left-2 top-2 z-10 bg-[#C8102E] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                OFFER -10%
              </div>
              <Image
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
                alt="Hello Luxora White Tee Red Studio"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </FadeIn>

          {/* Card 3 */}
          <FadeIn delay={0.4}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 group">
              <div className="absolute left-2 top-2 z-10 bg-[#C8102E] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                OFFER -10%
              </div>
              <Image
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
                alt="Luxora Left Hand Legacy Black Tee"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </FadeIn>

          {/* Card 4 */}
          <FadeIn delay={0.5}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 group">
              <div className="absolute left-2 top-2 z-10 bg-[#C8102E] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                OFFER -23%
              </div>
              <Image
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop"
                alt="Luxora Coffee Brown Tee Studio"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. Marquee Section */}
      <section className="w-full overflow-hidden py-10 border-y border-black mb-16 bg-white">
        <div className="flex w-max animate-marquee">
          {/* First Group */}
          <div className="flex space-x-16 pr-16 flex-shrink-0">
            {Array(10).fill('NEW IN').map((text, i) => (
              <span key={`m1-${i}`} className="text-4xl font-extrabold uppercase tracking-tighter text-black">
                {text}
              </span>
            ))}
          </div>
          {/* Second Group (Clone for seamless loop) */}
          <div className="flex space-x-16 pr-16 flex-shrink-0">
            {Array(10).fill('NEW IN').map((text, i) => (
              <span key={`m2-${i}`} className="text-4xl font-extrabold uppercase tracking-tighter text-black">
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Features Section */}
      <section className="container mx-auto px-4 pb-20 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center pt-8">
          <FadeIn delay={0.1} className="flex flex-col items-center">
            <Package className="w-8 h-8 text-[#f26552] mb-4 stroke-[1]" />
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-black mb-3">Customer Service</h4>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[240px]">We&apos;re available from Monday to Friday to help with your queries</p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-[#f26552] mb-4 stroke-[1]" />
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-black mb-3">Nationwide Shipping</h4>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[240px]">We Provide Pan India shipping with delivery timelines of 2-7 working days</p>
          </FadeIn>
          <FadeIn delay={0.3} className="flex flex-col items-center">
            <Gem className="w-8 h-8 text-[#f26552] mb-4 stroke-[1]" />
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-black mb-3">Secure Payment</h4>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[240px]">Your payment information is processed securely.</p>
          </FadeIn>
          <FadeIn delay={0.4} className="flex flex-col items-center">
            <User className="w-8 h-8 text-[#f26552] mb-4 stroke-[1]" />
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-black mb-3">Contact Us</h4>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[240px]">For all inquiries, please contact us via email at hinlersclothing@gmail.com</p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
