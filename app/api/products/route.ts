import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import ProductModel from '@/lib/models/Product';
import { mockProducts } from '@/lib/mocks/data';

export async function GET() {
  try {
    await dbConnect();
    const docs = await ProductModel.find({ status: 'active' }).lean();
    if (docs && docs.length > 0) {
      const formatted = docs.map(doc => ({
        ...doc,
        _id: doc._id.toString(),
        categoryId: doc.categoryId ? doc.categoryId.toString() : '',
        brandId: doc.brandId ? doc.brandId.toString() : '',
      }));
      return NextResponse.json(formatted);
    }
  } catch (error) {
    console.warn('DB fetch products error:', error);
  }
  
  // Return fallback mock products if database is empty or connection fails
  return NextResponse.json(mockProducts);
}
