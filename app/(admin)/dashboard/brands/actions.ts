"use server";

import { revalidatePath } from "next/cache";
import { mockBrands } from "@/lib/mocks/data";
import { Brand } from "@/types";
import dbConnect from "@/lib/db/connect";
import BrandModel from "@/lib/models/Brand";

export async function deleteBrand(id: string) {
  try {
    await dbConnect();
    await BrandModel.findByIdAndDelete(id);
  } catch (err) {
    console.warn('DB delete brand failed, fallback to mock:', err);
  }

  const index = mockBrands.findIndex((b) => b._id === id);
  if (index !== -1) {
    mockBrands.splice(index, 1);
  }
  revalidatePath("/dashboard/brands");
}

export async function deleteBrandAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await deleteBrand(id);
  }
}

export async function createBrand(brandData: Partial<Brand>) {
  try {
    await dbConnect();
    await BrandModel.create(brandData);
  } catch (err) {
    console.warn('DB create brand failed, fallback to mock:', err);
  }

  const newBrand: Brand = {
    ...brandData,
    _id: `b${Date.now()}`,
  } as Brand;

  mockBrands.unshift(newBrand);
  revalidatePath("/dashboard/brands");
}

export async function updateBrand(id: string, brandData: Partial<Brand>) {
  try {
    await dbConnect();
    await BrandModel.findByIdAndUpdate(id, brandData);
  } catch (err) {
    console.warn('DB update brand failed, fallback to mock:', err);
  }

  const index = mockBrands.findIndex((b) => b._id === id);
  if (index !== -1) {
    mockBrands[index] = {
      ...mockBrands[index],
      ...brandData,
    } as Brand;
  }
  revalidatePath("/dashboard/brands");
}
