import { api } from '@/lib/services/api';
import { BrandForm } from '@/components/admin/BrandForm';
import { notFound } from 'next/navigation';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brands = await api.brands.getAll();
  const brand = brands.find(b => b._id === id);
  
  if (!brand) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Edit Brand</h1>
      </div>
      
      <BrandForm initialData={brand} />
    </div>
  );
}
