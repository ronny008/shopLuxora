"use server";

import { revalidatePath } from "next/cache";
import { Brand } from "@/types";
import dbConnect from "@/lib/db/connect";
import BrandModel from "@/lib/models/Brand";
import mongoose from "mongoose";

function safeRevalidate() {
  try {
    revalidatePath("/dashboard/brands");
    revalidatePath("/");
  } catch {}
}

export async function deleteBrand(id: string) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await BrandModel.findByIdAndDelete(id);
    } else {
      await BrandModel.deleteOne({ $or: [{ _id: id }] });
    }
  } catch (err) {
    console.error('DB delete brand failed:', err);
  }
  safeRevalidate();
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
    const created = await BrandModel.create({
      name: brandData.name,
      logo: brandData.logo,
      description: brandData.description,
      website: brandData.website,
      status: brandData.status || 'active',
    });
    safeRevalidate();
    return { success: true, brand: JSON.parse(JSON.stringify(created)) };
  } catch (err: any) {
    console.error('DB create brand failed:', err);
    return { success: false, error: err.message };
  }
}

export async function updateBrand(id: string, brandData: Partial<Brand>) {
  try {
    await dbConnect();
    await BrandModel.findByIdAndUpdate(id, brandData);
    safeRevalidate();
    return { success: true };
  } catch (err: any) {
    console.error('DB update brand failed:', err);
    return { success: false, error: err.message };
  }
}
