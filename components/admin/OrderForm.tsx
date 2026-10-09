"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, OrderItem, Order } from '@/types';
import { createOrder } from '@/app/(admin)/dashboard/orders/actions';
import { Plus, Trash2 } from 'lucide-react';

interface OrderFormProps {
  products: Product[];
}

export function OrderForm({ products }: OrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [orderStatus, setOrderStatus] = useState<Order['status']>('pending');

  // Selected Order Items
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Handle adding an item to the order
  const handleAddItem = () => {
    if (!selectedProductId) return;

    const product = products.find(p => p._id === selectedProductId);
    if (!product) return;

    // Check if item already exists in list
    const existingIndex = items.findIndex(i => i.productId === selectedProductId);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += selectedQuantity;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: selectedProductId,
          quantity: selectedQuantity,
          price: product.price,
        },
      ]);
    }

    // Reset selection
    setSelectedProductId('');
    setSelectedQuantity(1);
  };

  // Handle removing item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate order total
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one product to the order.');
      return;
    }

    setIsLoading(true);

    try {
      const userIdDisplay = customerName ? `${customerName} (${customerEmail || 'No Email'})` : 'Guest Customer';

      await createOrder({
        userId: userIdDisplay,
        items,
        address: address || 'Store Pickup / Counter Sale',
        payment: {
          method: paymentMethod,
          status: paymentStatus,
        },
        total: totalAmount,
        status: orderStatus,
      });

      router.push('/dashboard/orders');
      router.refresh();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 border border-black rounded-none shadow-sm">
      {/* Customer Info */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-2">
          Customer & Shipping Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-xs font-bold uppercase tracking-wider text-black">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="sharp-input w-full h-12"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="customerEmail" className="text-xs font-bold uppercase tracking-wider text-black">
              Customer Email
            </label>
            <input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="sharp-input w-full h-12"
              placeholder="e.g. john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-black">
            Shipping Address
          </label>
          <textarea
            id="address"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="sharp-input w-full"
            placeholder="123 Street Name, City, Pincode..."
          />
        </div>
      </div>

      {/* Add Products Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-2">
          Order Items
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 border border-slate-200">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-black">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="sharp-input w-full h-12 bg-white"
            >
              <option value="">-- Choose Product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price.toFixed(2)} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-32 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-black">Quantity</label>
            <input
              type="number"
              min="1"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="sharp-input w-full h-12 bg-white text-center"
            />
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={!selectedProductId}
            className="btn-solid !w-auto h-12 px-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Selected Items Table */}
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 border-b border-black">
              <tr className="text-xs font-bold text-black uppercase tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 font-medium uppercase tracking-wider">
                    No items added yet. Please select a product above.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const product = products.find(p => p._id === item.productId);
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-black uppercase">
                        {product?.name || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">₹{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-bold text-black">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-black font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-black">
                    Grand Total:
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-black">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Payment & Order Status */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-2">
          Payment & Status Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="paymentMethod" className="text-xs font-bold uppercase tracking-wider text-black">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sharp-input w-full h-12"
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI / GPay</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentStatus" className="text-xs font-bold uppercase tracking-wider text-black">
              Payment Status
            </label>
            <select
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="sharp-input w-full h-12"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="orderStatus" className="text-xs font-bold uppercase tracking-wider text-black">
              Order Status
            </label>
            <select
              id="orderStatus"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as Order['status'])}
              className="sharp-input w-full h-12"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
          disabled={isLoading || items.length === 0}
          className="btn-solid w-auto min-w-[150px] disabled:opacity-50"
        >
          {isLoading ? 'Creating Order...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}
