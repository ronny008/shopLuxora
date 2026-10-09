"use server";

import { revalidatePath } from "next/cache";
import { User } from "@/types";
import dbConnect from "@/lib/db/connect";
import UserModel from "@/lib/models/User";
import mongoose from "mongoose";

function safeRevalidate() {
  try {
    revalidatePath("/dashboard/users");
  } catch {}
}

export async function deleteUser(id: string) {
  try {
    await dbConnect();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await UserModel.findByIdAndDelete(id);
    } else {
      await UserModel.deleteOne({ $or: [{ _id: id }, { email: id }] });
    }
  } catch (err) {
    console.error('DB delete user failed:', err);
  }
  safeRevalidate();
}

export async function deleteUserAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await deleteUser(id);
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  try {
    await dbConnect();
    await UserModel.findByIdAndUpdate(id, userData);
    safeRevalidate();
    return { success: true };
  } catch (err: any) {
    console.error('DB update user failed:', err);
    return { success: false, error: err.message };
  }
}
