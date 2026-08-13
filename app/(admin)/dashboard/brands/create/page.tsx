import { BrandForm } from '@/components/admin/BrandForm';

export default function CreateBrandPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Add Brand</h1>
      </div>
      
      <BrandForm />
    </div>
  );
}
