"use server";

import { revalidatePath } from "next/cache";
import { mockUsers } from "@/lib/mocks/data";
import { User } from "@/types";
import dbConnect from "@/lib/db/connect";
import UserModel from "@/lib/models/User";

export async function deleteUser(id: string) {
  try {
    await dbConnect();
    await UserModel.findByIdAndDelete(id);
  } catch (err) {
    console.warn('DB delete user failed, fallback to mock:', err);
  }

  const index = mockUsers.findIndex((u) => u._id === id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
  }
  revalidatePath("/dashboard/users");
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
  } catch (err) {
    console.warn('DB update user failed, fallback to mock:', err);
  }

  const index = mockUsers.findIndex((u) => u._id === id);
  if (index !== -1) {
    mockUsers[index] = {
      ...mockUsers[index],
      ...userData,
    } as User;
  }
  revalidatePath("/dashboard/users");
}
