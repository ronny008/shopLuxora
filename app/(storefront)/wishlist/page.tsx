import { api } from '@/lib/services/api';
import { WishlistClient } from './WishlistClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wishlist - Luxora',
  description: 'Your saved items and wishlist at Luxora.',
};

export default async function WishlistPage() {
  const products = await api.products.getAll();

  return (
    <div className="bg-white min-h-[60vh]">
      <WishlistClient products={products} />
    </div>
  );
}
