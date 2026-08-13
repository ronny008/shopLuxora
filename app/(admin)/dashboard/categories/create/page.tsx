import { CategoryForm } from '@/components/admin/CategoryForm';

export default function CreateCategoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Add Category</h1>
      </div>
      
      <CategoryForm />
    </div>
  );
}
