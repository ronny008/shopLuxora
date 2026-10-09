import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import ProductModel from '@/lib/models/Product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const docs = await ProductModel.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
    const formatted = (docs || []).map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      categoryId: doc.categoryId ? doc.categoryId.toString() : '',
      brandId: doc.brandId ? doc.brandId.toString() : '',
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('DB fetch products error:', error);
    return NextResponse.json([]);
  }
}
