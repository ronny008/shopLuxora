"use server";

import { revalidatePath } from "next/cache";
import { Category } from "@/types";
import dbConnect from "@/lib/db/connect";
import CategoryModel from "@/lib/models/Category";
import mongoose from "mongoose";

function safeRevalidate() {
  try {
    revalidatePath("/dashboard/categories");
    revalidatePath("/categories");
    revalidatePath("/");
  } catch {}
}

export async function deleteCategory(id: string) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await CategoryModel.findByIdAndDelete(id);
    } else {
      await CategoryModel.deleteOne({ $or: [{ _id: id }, { slug: id }] });
    }
  } catch (err) {
    console.error('DB delete category failed:', err);
  }
  safeRevalidate();
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await deleteCategory(id);
  }
}

export async function createCategory(categoryData: Partial<Category>) {
  try {
    await dbConnect();
    const slug = categoryData.slug || categoryData.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;
    const created = await CategoryModel.create({
      name: categoryData.name,
      slug,
      image: categoryData.image,
      description: categoryData.description,
      status: categoryData.status || 'active',
    });
    safeRevalidate();
    return { success: true, category: JSON.parse(JSON.stringify(created)) };
  } catch (err: any) {
    console.error('DB create category failed:', err);
    return { success: false, error: err.message };
  }
}

export async function updateCategory(id: string, categoryData: Partial<Category>) {
  try {
    await dbConnect();
    await CategoryModel.findByIdAndUpdate(id, categoryData);
    safeRevalidate();
    return { success: true };
  } catch (err: any) {
    console.error('DB update category failed:', err);
    return { success: false, error: err.message };
  }
}
