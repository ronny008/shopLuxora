import Link from 'next/link';
import { api } from '@/lib/services/api';
import { ProductCard } from '@/components/shared/ProductCard';
import { HeroCarousel } from '@/components/storefront/HeroCarousel';
import { FadeIn } from '@/components/shared/FadeIn';
import Image from 'next/image';
import { Package, Truck, Gem, User } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StorefrontHomePage() {
  const [products, landingConfig] = await Promise.all([
    api.products.getAll(),
    api.landingPage.get(),
  ]);
  
  // Use products for different sections
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 5);

  const { banners, collectionSection, marqueeText, features, heroSlides } = landingConfig;

  // Icon map for features
  const iconMap: Record<string, any> = {
    Package,
    Truck,
    Gem,
    User,
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Hero Carousel Section */}
      <HeroCarousel slides={heroSlides} />

      {/* 2. Featured Products Section */}
      <section className="container mx-auto px-4 py-16 overflow-hidden">
        <FadeIn delay={0.1}>
          <h2 className="text-xl font-bold tracking-[0.1em] uppercase text-black mb-8">
            Featured Products
          </h2>
        </FadeIn>
        {featuredProducts.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold uppercase tracking-wider text-gray-400 border border-gray-200">
            No featured products selected yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product._id} delay={0.2 + (i * 0.1)}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* 3. Shop Categories Banners */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-16 container mx-auto overflow-hidden">
        {/* Banner 1 */}
        <FadeIn direction="left" delay={0.1}>
          <div className="relative h-[400px] md:h-[500px] group overflow-hidden bg-slate-900">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${banners.banner1.image}")` }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {banners.banner1.subtitle && (
                <span className="text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 drop-shadow">
                  {banners.banner1.subtitle}
                </span>
              )}
              <Link 
                href={banners.banner1.link || '/categories/men'} 
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-colors"
              >
                {banners.banner1.buttonText || 'SHOP NOW'}
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Banner 2 */}
        <FadeIn direction="right" delay={0.2}>
          <div className="relative h-[400px] md:h-[500px] group overflow-hidden bg-slate-900">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${banners.banner2.image}")` }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {banners.banner2.subtitle && (
                <span className="text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 drop-shadow">
                  {banners.banner2.subtitle}
                </span>
              )}
              <Link 
                href={banners.banner2.link || '/categories/women'} 
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-colors"
              >
                {banners.banner2.buttonText || 'SHOP NOW'}
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
              {collectionSection.title || 'LUXORA'}
            </h2>
            <p className="text-xs text-slate-500 font-sans-clean mt-1">
              {collectionSection.subtitle || 'Discover the Ready-to-Wear Collections'}
            </p>
          </div>
        </FadeIn>
        
        {/* 4 Cards Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collectionSection.cards.map((card, idx) => (
            <FadeIn key={idx} delay={0.2 + (idx * 0.1)}>
              <Link href={card.link || '/products'} className="block relative aspect-[3/4] w-full overflow-hidden bg-slate-100 group">
                {card.badge && (
                  <div className="absolute left-2 top-2 z-10 bg-[#C8102E] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                    {card.badge}
                  </div>
                )}
                <Image
                  src={card.image}
                  alt={`${collectionSection.title} card ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. Marquee Section */}
      <section className="w-full overflow-hidden py-10 border-y border-black mb-16 bg-white">
        <div className="flex w-max animate-marquee">
          {/* First Group */}
          <div className="flex space-x-16 pr-16 flex-shrink-0">
            {Array(10).fill(marqueeText || 'NEW IN').map((text, i) => (
              <span key={`m1-${i}`} className="text-4xl font-extrabold uppercase tracking-tighter text-black">
                {text}
              </span>
            ))}
          </div>
          {/* Second Group (Clone for seamless loop) */}
          <div className="flex space-x-16 pr-16 flex-shrink-0">
            {Array(10).fill(marqueeText || 'NEW IN').map((text, i) => (
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
          {features.map((feature, i) => {
            const IconComponent = iconMap[feature.iconName || 'Package'] || Package;
            return (
              <FadeIn key={i} delay={0.1 + (i * 0.1)} className="flex flex-col items-center">
                <IconComponent className="w-8 h-8 text-[#f26552] mb-4 stroke-[1]" />
                <h4 className="text-[14px] font-bold uppercase tracking-wide text-black mb-3">
                  {feature.title}
                </h4>
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-[240px]">
                  {feature.description}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </div>
  );
}
