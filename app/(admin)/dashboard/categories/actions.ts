"use server";

import { revalidatePath } from "next/cache";
import { mockCategories } from "@/lib/mocks/data";
import { Category } from "@/types";
import dbConnect from "@/lib/db/connect";
import CategoryModel from "@/lib/models/Category";

export async function deleteCategory(id: string) {
  try {
    await dbConnect();
    await CategoryModel.findByIdAndDelete(id);
  } catch (err) {
    console.warn('DB delete category failed, fallback to mock:', err);
  }

  const index = mockCategories.findIndex((c) => c._id === id);
  if (index !== -1) {
    mockCategories.splice(index, 1);
  }
  revalidatePath("/dashboard/categories");
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
    await CategoryModel.create(categoryData);
  } catch (err) {
    console.warn('DB create category failed, fallback to mock:', err);
  }

  const newCategory: Category = {
    ...categoryData,
    _id: `c${Date.now()}`,
  } as Category;

  mockCategories.unshift(newCategory);
  revalidatePath("/dashboard/categories");
}

export async function updateCategory(id: string, categoryData: Partial<Category>) {
  try {
    await dbConnect();
    await CategoryModel.findByIdAndUpdate(id, categoryData);
  } catch (err) {
    console.warn('DB update category failed, fallback to mock:', err);
  }

  const index = mockCategories.findIndex((c) => c._id === id);
  if (index !== -1) {
    mockCategories[index] = {
      ...mockCategories[index],
      ...categoryData,
    } as Category;
  }
  revalidatePath("/dashboard/categories");
}
