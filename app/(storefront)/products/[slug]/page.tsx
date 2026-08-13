import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/services/api';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductActions } from '@/components/storefront/ProductActions';
import { ProductAccordion } from '@/components/storefront/ProductAccordion';
import { ShareButton } from '@/components/storefront/ShareButton';
import { ReviewSection } from '@/components/storefront/ReviewSection';
import { 
  ChevronRight, Star, Eye, 
  Truck, ShieldCheck, HeadphonesIcon
} from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = await api.products.getAll();
  const product = allProducts.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Calculate fake original price for the discount badge
  const originalPrice = product.price * 1.15;
  const saveAmount = originalPrice - product.price;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black/60">
            <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li><Link href="/products" className="hover:text-black transition-colors">Products</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li className="text-black">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT: Image Gallery (Takes up 7 cols on lg screens) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 h-full">
            {/* Thumbnails (Vertical on MD+, Horizontal on Mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-[15%] snap-x hide-scrollbar shrink-0">
              {[product.images[0] || 'https://placehold.co/800x800', 
                product.images[0] || 'https://placehold.co/800x800', 
                product.images[0] || 'https://placehold.co/800x800', 
                product.images[0] || 'https://placehold.co/800x800'].map((img, i) => (
                <button 
                  key={i} 
                  className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden bg-slate-100 border ${i === 0 ? 'border-black' : 'border-transparent'} hover:border-black transition-colors shrink-0 snap-start`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative w-full aspect-[3/4] bg-[#a81023] md:w-[85%] grow">
              <Image
                src={product.images[0] || 'https://placehold.co/1000x1200'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white text-black shadow">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white text-black shadow">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info (Takes up 5 cols on lg screens) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Title */}
            <h1 className="text-3xl lg:text-[2rem] leading-none font-extrabold uppercase tracking-widest text-black mb-4">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="flex flex-wrap items-end gap-3 mb-2">
              <span className="text-xl font-bold text-black">Rs. {product.price.toFixed(2)}</span>
              <span className="text-xs font-medium text-black/50 line-through mb-1">Rs. {originalPrice.toFixed(2)}</span>
              <span className="bg-[#E2552B] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 mb-1">
                Save Rs. {saveAmount.toFixed(2)}
              </span>
            </div>
            
            <p className="text-[10px] text-black/60 mb-6 font-medium">Tax included and shipping calculated at checkout</p>
            
            {/* Viewer Count */}
            <div className="flex items-center gap-2 mb-6 bg-slate-50 border border-slate-100 p-2 text-xs font-bold text-black">
              <Eye className="w-4 h-4 text-[#E2552B]" />
              <span className="text-[#E2552B]">16 people</span> <span className="font-normal text-black/70">are viewing this right now</span>
            </div>

            {/* Description/Features (Short) */}
            <div className="mb-8">
              <p className="text-xs text-black font-semibold mb-2">Core profile:</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-black text-black" />)}
                </div>
                <span className="text-[10px] text-black font-bold uppercase tracking-wider">5 reviews</span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-black mb-3">Color: <span className="font-normal text-black/60">White</span></p>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center p-[2px]">
                   <span className="w-full h-full rounded-full bg-white border border-gray-200 block"></span>
                </button>
              </div>
            </div>

            <ProductActions product={product} />

            {/* Feature Icons */}
            <div className="grid grid-cols-1 gap-4 py-6 border-y border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-black" strokeWidth={1.5} />
                <span className="text-xs font-bold text-black">Free Shipping on orders over Rs. 2000</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-black" strokeWidth={1.5} />
                <span className="text-xs font-bold text-black">Secure payment processing</span>
              </div>
              <div className="flex items-center gap-3">
                <HeadphonesIcon className="w-5 h-5 text-black" strokeWidth={1.5} />
                <span className="text-xs font-bold text-black">24/7 customer support available</span>
              </div>
            </div>

            {/* Safe Checkout Badge */}
            <div className="py-6 flex flex-col items-center border-b border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-3">Guaranteed Safe Checkout</p>
              <div className="flex gap-2">
                {/* Mock payment icons */}
                <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold">VISA</div>
                <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold">MC</div>
                <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold">AMEX</div>
                <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[8px] font-bold">PAYPAL</div>
              </div>
            </div>

            {/* Description Dropdowns */}
            <ProductAccordion 
              title="Shipping Information" 
              content={
                <ul className="list-disc pl-4 space-y-2">
                  <li>Free standard shipping on all orders over Rs. 2,000</li>
                  <li>Standard shipping takes 5-7 business days</li>
                  <li>Express shipping (2-3 days) available at checkout</li>
                  <li>International shipping currently unavailable</li>
                </ul>
              } 
            />
            
            {/* Share */}
            <div className="flex justify-center pt-8">
               <ShareButton title={`Luxora - ${product.name}`} url={`/products/${product.slug}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-100 mt-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Details</h2>
        <div className="text-sm text-black/80 font-medium leading-relaxed max-w-3xl space-y-4">
          <p>{product.description}</p>
          <p>The Hello Hinlers tee features our iconic logo printed on premium heavy-weight cotton. Crafted for everyday durability and unmatched style. The boxy fit and dropped shoulders give it a relaxed, streetwear aesthetic that pairs perfectly with any bottom.</p>
          <ul className="list-disc pl-5 mt-4 space-y-1">
            <li>100% Premium Cotton</li>
            <li>Oversized, boxy fit</li>
            <li>Heavy-weight fabric (240gsm)</li>
            <li>High-density puff print graphic</li>
            <li>Machine wash cold, tumble dry low</li>
            <li>Made with care in Kerala, India</li>
          </ul>
        </div>
      </div>

      <ReviewSection />

      {/* You May Also Like */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-100">
        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-black mb-12">You May Also Like</h2>
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allProducts.slice(0, 5).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-100">
        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-black mb-12">Recently Viewed</h2>
        <div className="w-48 mx-auto">
          <div className="relative aspect-[3/4] bg-[#a81023] group border border-transparent hover:border-black transition-colors">
             <div className="absolute top-2 left-2 z-10 bg-[#E2552B] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5">
               Offer -10%
             </div>
             <Image 
               src={product.images[0] || 'https://placehold.co/400x500'} 
               alt="Recently viewed" 
               fill 
               className="object-cover" 
             />
          </div>
        </div>
      </div>



    </div>
  );
}
