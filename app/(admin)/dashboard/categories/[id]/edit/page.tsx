import { api } from '@/lib/services/api';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await api.categories.getAll();
  const category = categories.find(c => c._id === id);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Edit Category</h1>
      </div>
      
      <CategoryForm initialData={category} />
    </div>
  );
}
