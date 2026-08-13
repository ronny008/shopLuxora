import { api } from '@/lib/services/api';
import { OrderForm } from '@/components/admin/OrderForm';

export default async function CreateOrderPage() {
  const products = await api.products.getAll();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Create New Order</h1>
      </div>
      
      <OrderForm products={products} />
    </div>
  );
}
