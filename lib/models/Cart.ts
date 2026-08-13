import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  total: number;
  coupon?: string;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 },
    coupon: { type: String },
  },
  { timestamps: true }
);

export const CartModel: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default CartModel;
