"use server";

import { revalidatePath } from "next/cache";
import { Order } from "@/types";
import dbConnect from "@/lib/db/connect";
import OrderModel from "@/lib/models/Order";
import mongoose from "mongoose";

function safeRevalidate(id?: string) {
  try {
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
    if (id) {
      revalidatePath(`/dashboard/orders/${id}`);
    }
  } catch {}
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await OrderModel.findByIdAndUpdate(id, { status });
    } else {
      await OrderModel.updateOne(
        { $or: [{ _id: id }, { orderNumber: id }] },
        { status }
      );
    }
  } catch (err) {
    console.error('DB update order status failed:', err);
  }
  safeRevalidate(id);
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as Order['status'];
  if (orderId && status) {
    await updateOrderStatus(orderId, status);
  }
}

export async function deleteOrder(id: string) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await OrderModel.findByIdAndDelete(id);
    } else {
      await OrderModel.deleteOne({ $or: [{ _id: id }, { orderNumber: id }] });
    }
  } catch (err) {
    console.error('DB delete order failed:', err);
  }
  safeRevalidate();
}

export async function deleteOrderAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await deleteOrder(id);
  }
}

export async function createOrder(orderData: Partial<Order>) {
  try {
    await dbConnect();
    const orderNumber = orderData.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const created = await OrderModel.create({
      orderNumber,
      userId: orderData.userId || 'Customer',
      items: orderData.items || [],
      address: orderData.address || 'Standard Delivery',
      payment: {
        method: orderData.payment?.method || 'Cash',
        status: orderData.payment?.status || 'paid',
      },
      total: orderData.total || 0,
      status: orderData.status || 'pending',
    });
    safeRevalidate();
    return JSON.parse(JSON.stringify(created));
  } catch (err) {
    console.error('DB create order failed:', err);
    return null;
  }
}
