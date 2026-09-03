import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/services/api';
import { ProductCard } from '@/components/shared/ProductCard';
import { FadeIn } from '@/components/shared/FadeIn';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

const categoryMeta: Record<string, { title: string; subtitle: string; image: string }> = {
  men: {
    title: "Men's Collection",
    subtitle: 'Contemporary tailoring, refined silhouettes, and street luxury',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
  },
  women: {
    title: "Women's Collection",
    subtitle: 'Signature evening wear, silk essentials, and modern silhouettes',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop',
  },
  dresses: {
    title: 'Luxury Dresses',
    subtitle: 'Exquisite evening gowns and tailored daytime silhouettes',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1600&auto=format&fit=crop',
  },
  outerwear: {
    title: 'Designer Outerwear',
    subtitle: 'Handcrafted leather jackets, virgin wool coats, and modern blazers',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1600&auto=format&fit=crop',
  },
  footwear: {
    title: 'Handcrafted Footwear',
    subtitle: 'Goodyear welted boots, Italian leather loafers, and statement shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop',
  },
  accessories: {
    title: 'Luxury Accessories',
    subtitle: 'Calfskin handbags, precision timepieces, and silk scarves',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  const [allProducts, categories] = await Promise.all([
    api.products.getAll(),
    api.categories.getAll(),
  ]);

  const category = categories.find(
    (c) => c.slug.toLowerCase() === lowerSlug || c._id === slug
  );

  let filteredProducts: Product[] = [];

  if (lowerSlug === 'men') {
    filteredProducts = allProducts.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return (
        name.includes('biker') ||
        name.includes('blazer') ||
        name.includes('sweater') ||
        name.includes('trousers') ||
        name.includes('loafers') ||
        name.includes('boots') ||
        name.includes('wristwatch') ||
        name.includes('sunglasses') ||
        name.includes('scarf') ||
        name.includes('tee') ||
        desc.includes('men')
      );
    });
  } else if (lowerSlug === 'women') {
    filteredProducts = allProducts.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return (
        name.includes('dress') ||
        name.includes('gown') ||
        name.includes('handbag') ||
        name.includes('coat') ||
        name.includes('blazer') ||
        name.includes('boots') ||
        name.includes('scarf') ||
        desc.includes('women') ||
        desc.includes('silk')
      );
    });
  } else if (category) {
    filteredProducts = allProducts.filter(
      (p) => p.categoryId === category._id || p.categoryId === category.slug
    );
  }

  // If filter produces 0, fallback gracefully to all products
  if (filteredProducts.length === 0) {
    filteredProducts = allProducts.slice(0, 8);
  }

  const meta = categoryMeta[lowerSlug] || {
    title: category?.name || slug.replace('-', ' ').toUpperCase(),
    subtitle: category?.description || 'Explore the curated collection from Luxora',
    image:
      category?.image ||
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
  };

  return (
    <div className="min-h-screen bg-white font-sans-clean">
      {/* 1. Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-slate-900">
        <Image
          src={meta.image}
          alt={meta.title}
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        {/* Breadcrumb Top Left */}
        <div className="absolute top-4 left-6 md:left-12 text-[11px] font-semibold text-slate-300 tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/categories" className="hover:text-white transition-colors">
            Categories
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-white capitalize">{meta.title}</span>
        </div>

        {/* Banner Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.15em] text-white drop-shadow-md">
            {meta.title}
          </h1>
          <p className="mt-2 text-xs md:text-sm italic font-serif text-slate-200 tracking-wide max-w-xl">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Products Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Showing {filteredProducts.length} Items
          </p>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1"
          >
            All Products <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, i) => (
            <FadeIn key={product._id} delay={0.05 * (i % 6)}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
