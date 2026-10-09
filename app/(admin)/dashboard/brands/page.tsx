import { api } from '@/lib/services/api';
import Link from 'next/link';
import { deleteBrandAction } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBrandsPage() {
  const brands = await api.brands.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Brands</h1>
        <Link href="/dashboard/brands/create" className="btn-solid !w-fit px-6 py-3">
          Add Brand
        </Link>
      </div>

      <div className="bg-white border border-black rounded-none">
        <div className="px-6 py-4 border-b border-black flex items-center justify-between">
          <input
            type="text"
            placeholder="SEARCH BRANDS..."
            className="sharp-input w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
                <th scope="col" className="relative px-6 py-4 border-b border-black"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{brand.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none">
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tracking-wider uppercase flex justify-end items-center">
                    <Link href={`/dashboard/brands/${brand._id}/edit`} className="text-black hover:underline mr-4">Edit</Link>
                    <form 
                      action={deleteBrandAction}
                      onSubmit={(e) => {
                        if (!confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={brand._id} />
                      <button type="submit" className="text-red-600 hover:underline font-bold cursor-pointer">Delete</button>
                    </form>
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
