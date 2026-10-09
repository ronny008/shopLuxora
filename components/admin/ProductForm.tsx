"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@/types';
import { createProduct, updateProduct } from '@/app/(admin)/dashboard/products/actions';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  brands: Brand[];
}

export function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      images: [''],
      categoryId: '',
      brandId: '',
      status: 'active',
      isFeatured: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'images') {
      setFormData(prev => ({ ...prev, images: [value] }));
      return;
    }

    if (name === 'name' && !initialData) {
      const autoSlug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: autoSlug,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let res: { success: boolean; error?: string };
      if (!initialData) {
        res = await createProduct(formData);
      } else {
        res = await updateProduct(initialData._id, formData);
      }

      if (res.success) {
        router.push('/dashboard/products');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to save product');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      setErrorMessage(error.message || 'An unexpected error occurred while saving the product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 border border-black rounded-none shadow-sm">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-black">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name || ''}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              placeholder="PRODUCT NAME"
              suppressHydrationWarning
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-black">Slug *</label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={formData.slug || ''}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              placeholder="PRODUCT-SLUG"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-black">Description *</label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            className="sharp-input w-full"
            placeholder="PRODUCT DESCRIPTION..."
            suppressHydrationWarning
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-black">Price (₹) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.price ?? 0}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              suppressHydrationWarning
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-black">Stock *</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              value={formData.stock ?? 0}
              onChange={handleChange}
              className="sharp-input w-full h-12"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-xs font-bold uppercase tracking-wider text-black">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleChange}
              className="sharp-input w-full h-12 bg-white"
              suppressHydrationWarning
            >
              <option value="">None / Unassigned</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="brandId" className="text-xs font-bold uppercase tracking-wider text-black">Brand</label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId || ''}
              onChange={handleChange}
              className="sharp-input w-full h-12 bg-white"
              suppressHydrationWarning
            >
              <option value="">None / Unassigned</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-black">Status</label>
            <select
              id="status"
              name="status"
              required
              value={formData.status || 'active'}
              onChange={handleChange}
              className="sharp-input w-full h-12 bg-white"
              suppressHydrationWarning
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={formData.isFeatured || false}
            onChange={handleChange}
            className="w-5 h-5 accent-black cursor-pointer"
            suppressHydrationWarning
          />
          <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
            Featured Product (Show on Storefront Home)
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="images" className="text-xs font-bold uppercase tracking-wider text-black">Image URL</label>
          <input
            id="images"
            name="images"
            type="url"
            value={formData.images?.[0] || ''}
            onChange={handleChange}
            className="sharp-input w-full h-12"
            placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-black">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline w-auto cursor-pointer"
          suppressHydrationWarning
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-solid w-auto min-w-[150px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          suppressHydrationWarning
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Save Changes' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
}
