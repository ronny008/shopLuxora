import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  isFeatured?: boolean;
  isSoldOut?: boolean;
  stock: number;
  images: string[];
  categoryId?: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  status: 'active' | 'draft' | 'archived';
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isSoldOut: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: false },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
