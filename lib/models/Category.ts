import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  status: 'active' | 'inactive';
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    description: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;
