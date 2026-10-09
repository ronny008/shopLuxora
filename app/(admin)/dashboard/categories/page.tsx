import { api } from '@/lib/services/api';
import Link from 'next/link';
import { deleteCategoryAction } from './actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await api.categories.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Categories</h1>
        <Link href="/dashboard/categories/create" className="btn-solid !w-fit px-6 py-3">
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-black rounded-none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Slug</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
                <th scope="col" className="relative px-6 py-4 border-b border-black"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-black uppercase">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none">
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tracking-wider uppercase flex justify-end items-center">
                    <Link href={`/dashboard/categories/${category._id}/edit`} className="text-black hover:underline mr-4">Edit</Link>
                    <DeleteButton
                      action={deleteCategoryAction}
                      id={String(category._id)}
                      name={category.name}
                      itemType="category"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
