import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/services/api';
import { FadeIn } from '@/components/shared/FadeIn';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoriesIndexPage() {
  const [categories, products] = await Promise.all([
    api.categories.getAll(),
    api.products.getAll(),
  ]);

  const featuredBanners = [
    {
      title: "Men's Street & Luxury",
      slug: 'men',
      image:
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
      desc: 'Discover tailored blazers, oversized tees, and premium outerwear.',
    },
    {
      title: "Women's Ready-to-Wear",
      slug: 'women',
      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
      desc: 'Explore pure mulberry silk gowns, slip dresses, and statement totes.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans-clean">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-[0.15em]">
          All Collections
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-300 tracking-wider">
          Explore curated fashion by wardrobe category and signature aesthetics
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 space-y-16">
        {/* Curated Genders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredBanners.map((banner, i) => (
            <FadeIn key={banner.slug} delay={i * 0.1}>
              <Link
                href={`/categories/${banner.slug}`}
                className="group relative block aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-200"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider">
                    {banner.title}
                  </h2>
                  <p className="text-xs text-slate-200 mt-1 max-w-md">{banner.desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold uppercase tracking-widest text-white underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                    Explore Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Standard Categories Grid */}
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.15em] text-slate-900 mb-8">
            Wardrobe Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const count = products.filter(
                (p) => p.categoryId === cat._id || p.categoryId === cat.slug
              ).length;

              return (
                <FadeIn key={cat._id} delay={0.05 * i}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group block border border-slate-200 bg-white hover:border-black transition-colors"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-black">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {count > 0 ? `${count} Products` : 'Curated collection'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
