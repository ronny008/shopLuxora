import { api } from '@/lib/services/api';
import Link from 'next/link';
import { deleteUserAction } from './actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await api.auth.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Users</h1>
      </div>

      <div className="bg-white border border-black rounded-none">
        <div className="px-4 sm:px-6 py-4 border-b border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="SEARCH USERS..."
            className="sharp-input w-full sm:w-64"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors rounded-none">Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-black">Status</th>
                <th scope="col" className="relative px-6 py-4 border-b border-black"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-black">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-black uppercase">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-3 py-1 text-white text-xs font-bold uppercase tracking-wider rounded-none ${user.status === 'active' ? 'bg-black' : 'bg-red-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tracking-wider uppercase">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/dashboard/users/${user._id}/edit`} className="text-black hover:underline">Edit</Link>
                      <DeleteButton
                        action={deleteUserAction}
                        id={String(user._id)}
                        name={user.name}
                        itemType="user"
                      />
                    </div>
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
