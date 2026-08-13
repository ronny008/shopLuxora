import { api } from '@/lib/services/api';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function CreateProductPage() {
  const categories = await api.categories.getAll();
  const brands = await api.brands.getAll();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Add New Product</h1>
      </div>
      
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
