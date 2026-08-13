import { api } from '@/lib/services/api';
import { UserForm } from '@/components/admin/UserForm';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const users = await api.auth.getAll();
  const user = users.find(u => u._id === id);
  
  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Edit User</h1>
      </div>
      
      <UserForm initialData={user} />
    </div>
  );
}
