"use client";

import { useTransition } from 'react';

interface DeleteButtonProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  name?: string;
  itemType?: string;
  className?: string;
}

export function DeleteButton({
  action,
  id,
  name,
  itemType = 'item',
  className = 'text-red-600 hover:underline font-bold cursor-pointer disabled:opacity-50',
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const message = name
      ? `Are you sure you want to delete ${itemType} "${name}"? This action cannot be undone.`
      : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;

    if (!confirm(message)) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      await action(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={className}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
