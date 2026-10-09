"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/types";
import dbConnect from "@/lib/db/connect";
import ProductModel from "@/lib/models/Product";
import mongoose from "mongoose";

function sanitizeProductPayload(productData: Partial<Product>) {
  const payload: any = { ...productData };

  // Auto-generate slug if missing
  if (!payload.slug && payload.name) {
    payload.slug = payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Remove empty or invalid ObjectIds
  if (!payload.categoryId || typeof payload.categoryId !== 'string' || !mongoose.Types.ObjectId.isValid(payload.categoryId)) {
    delete payload.categoryId;
  }
  if (!payload.brandId || typeof payload.brandId !== 'string' || !mongoose.Types.ObjectId.isValid(payload.brandId)) {
    delete payload.brandId;
  }

  // Ensure stock and price are numeric
  if (payload.price !== undefined) payload.price = Number(payload.price);
  if (payload.stock !== undefined) payload.stock = Number(payload.stock);

  return payload;
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await ProductModel.findByIdAndDelete(id);
    } else {
      await ProductModel.deleteOne({ $or: [{ _id: id }, { slug: id }] });
    }
  } catch (err) {
    console.error('DB delete product failed:', err);
  }
  try {
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch {
    // Ignore in non-request contexts
  }
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await deleteProduct(id);
  }
}

export async function createProduct(productData: Partial<Product>) {
  try {
    await dbConnect();
    const payload = sanitizeProductPayload(productData);

    const created = await ProductModel.create(payload);
    try {
      revalidatePath("/dashboard/products");
      revalidatePath("/products");
      revalidatePath("/");
    } catch {}
    return { success: true, product: JSON.parse(JSON.stringify(created)) };
  } catch (err: any) {
    console.error('Error creating product:', err);
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  try {
    await dbConnect();
    const payload = sanitizeProductPayload(productData);

    await ProductModel.findByIdAndUpdate(id, payload);
    try {
      revalidatePath("/dashboard/products");
      revalidatePath("/products");
      revalidatePath("/");
    } catch {}
    return { success: true };
  } catch (err: any) {
    console.error('Error updating product:', err);
    return { success: false, error: err.message || 'Failed to update product' };
  }
}
