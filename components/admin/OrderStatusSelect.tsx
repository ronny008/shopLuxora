"use client";

import { useState, useTransition } from 'react';
import { Loader2, Check } from 'lucide-react';
import { updateOrderStatus } from '@/app/(admin)/dashboard/orders/actions';
import { Order } from '@/types';

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: Order['status'];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-300' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-300' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-300' },
};

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<Order['status']>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [showSaved, setShowSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order['status'];
    setStatus(newStatus);

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      } catch (err) {
        console.error('Failed to update status:', err);
        setStatus(currentStatus);
      }
    });
  };

  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={handleChange}
        className={`text-xs font-bold uppercase tracking-wider py-1.5 px-2.5 border transition-all cursor-pointer rounded-none outline-none ${style.bg} ${style.text} ${style.border} hover:border-black disabled:opacity-50`}
      >
        <option value="pending">PENDING</option>
        <option value="processing">PROCESSING</option>
        <option value="shipped">SHIPPED</option>
        <option value="delivered">DELIVERED</option>
        <option value="cancelled">CANCELLED</option>
      </select>

      {isPending && (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-black shrink-0" />
      )}
      {!isPending && showSaved && (
        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider shrink-0">
          <Check className="w-3 h-3 mr-0.5" /> Saved
        </span>
      )}
    </div>
  );
}
