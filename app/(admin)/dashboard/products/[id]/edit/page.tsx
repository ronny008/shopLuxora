import { api } from '@/lib/services/api';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await api.products.getById(id);
  
  if (!product) {
    notFound();
  }

  const categories = await api.categories.getAll();
  const brands = await api.brands.getAll();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Edit Product</h1>
      </div>
      
      <ProductForm initialData={product} categories={categories} brands={brands} />
    </div>
  );
}
