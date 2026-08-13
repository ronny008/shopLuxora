import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: any;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: any;
  items: IOrderItem[];
  address: string;
  payment: {
    method: string;
    status: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.Mixed, required: true },
    items: [OrderItemSchema],
    address: { type: String, required: true },
    payment: {
      method: { type: String, required: true },
      status: { type: String, required: true },
    },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;
