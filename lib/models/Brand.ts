import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  status: 'active' | 'inactive';
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BrandModel: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);

export default BrandModel;
