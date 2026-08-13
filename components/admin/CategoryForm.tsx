"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { createCategory, updateCategory } from '@/app/(admin)/dashboard/categories/actions';

interface CategoryFormProps {
  initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>(
    initialData || {
      name: '',
      slug: '',
      status: 'active',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!initialData) {
        await createCategory(formData);
      } else {
        await updateCategory(initialData._id, formData);
      }
      
      router.push('/dashboard/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-8 border border-black rounded-none shadow-sm">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-black">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              placeholder="CATEGORY NAME"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-black">Slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={formData.slug}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              placeholder="CATEGORY-SLUG"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-black">Status</label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="sharp-input w-full h-12"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-black">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-solid w-auto min-w-[150px]"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Category')}
        </button>
      </div>
    </form>
  );
}
