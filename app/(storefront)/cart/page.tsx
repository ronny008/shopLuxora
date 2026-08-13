import { Metadata } from 'next';
import { CartClient } from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart - Luxora',
  description: 'View and manage items in your shopping cart.',
};

export default function CartPage() {
  return (
    <div className="bg-white min-h-[60vh]">
      <CartClient />
    </div>
  );
}
