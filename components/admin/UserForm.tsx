"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { updateUser } from '@/app/(admin)/dashboard/users/actions';

interface UserFormProps {
  initialData: User;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    role: initialData.role,
    status: initialData.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUser(initialData._id, formData);
      router.push('/dashboard/users');
      router.refresh();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-8 border border-black rounded-none shadow-sm">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black">Name</label>
            <input
              type="text"
              value={initialData.name}
              disabled
              className="sharp-input w-full h-12 bg-slate-100/80 text-slate-800 font-semibold cursor-not-allowed border-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black">Email</label>
            <input
              type="text"
              value={initialData.email}
              disabled
              className="sharp-input w-full h-12 bg-slate-100/80 text-slate-800 font-semibold cursor-not-allowed border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-black">Role</label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="sharp-input w-full h-12 bg-white"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-black">Status</label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="sharp-input w-full h-12 bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-black">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline w-auto cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-solid w-auto min-w-[150px] cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
