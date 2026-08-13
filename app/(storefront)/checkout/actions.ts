"use server";

import { OrderItem } from "@/types";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db/connect";
import OrderModel from "@/lib/models/Order";

export async function createCheckoutOrder(
  userId: string,
  items: OrderItem[],
  total: number,
  address: string,
  paymentMethod: string
) {
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderPayload = {
    orderNumber,
    userId: userId || 'Customer',
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    address,
    payment: {
      method: paymentMethod || 'Credit Card',
      status: 'Paid',
    },
    total,
    status: 'processing' as const,
  };

  let newOrderId = `o_${Date.now()}`;

  try {
    await dbConnect();
    const created = await OrderModel.create(orderPayload);
    newOrderId = created._id.toString();
  } catch (err) {
    console.error('Error creating order in DB:', err);
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/profile");

  return newOrderId;
}
