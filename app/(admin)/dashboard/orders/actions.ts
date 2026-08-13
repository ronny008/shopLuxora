"use server";

import { revalidatePath } from "next/cache";
import { mockOrders } from "@/lib/mocks/data";
import { Order } from "@/types";
import dbConnect from "@/lib/db/connect";
import OrderModel from "@/lib/models/Order";

export async function updateOrderStatus(id: string, status: Order['status']) {
  try {
    await dbConnect();
    await OrderModel.findByIdAndUpdate(id, { status });
  } catch (err) {
    console.warn('DB update failed, updating mock orders:', err);
  }

  const index = mockOrders.findIndex((o) => o._id === id);
  if (index !== -1) {
    mockOrders[index].status = status;
  }
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as Order['status'];
  if (orderId && status) {
    await updateOrderStatus(orderId, status);
  }
}

export async function createOrder(orderData: Partial<Order>) {
  const orderId = `o${Date.now()}`;
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder: Order = {
    _id: orderId,
    orderNumber: orderNumber,
    userId: orderData.userId || 'u1',
    items: orderData.items || [],
    address: orderData.address || '123 Main St, City, Country',
    payment: {
      method: orderData.payment?.method || 'Cash',
      status: orderData.payment?.status || 'paid',
    },
    total: orderData.total || 0,
    status: orderData.status || 'pending',
    createdAt: new Date().toISOString(),
  };

  mockOrders.unshift(newOrder);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return newOrder;
}
