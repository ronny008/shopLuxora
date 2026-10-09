import { api } from '@/lib/services/api';
import Link from 'next/link';
import { ProductTableClient } from '@/components/admin/ProductTableClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await api.products.getAll();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Products</h1>
        <Link href="/dashboard/products/create" className="btn-solid !w-fit px-6 py-3">
          Add Product
        </Link>
      </div>
      
      <ProductTableClient initialProducts={products} />
    </div>
  );
}
