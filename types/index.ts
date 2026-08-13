export type ObjectId = string;

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'Guest' | 'Customer' | 'Admin';
  image?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface Product {
  _id: ObjectId;
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
  categoryId: ObjectId;
  brandId: ObjectId;
  status: 'active' | 'draft' | 'archived';
}

export interface Category {
  _id: ObjectId;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentCategory?: ObjectId | null;
  status: 'active' | 'inactive';
}

export interface Brand {
  _id: ObjectId;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  status: 'active' | 'inactive';
}

export interface CartItem {
  productId: ObjectId;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: ObjectId;
  userId: ObjectId;
  items: CartItem[];
  total: number;
  coupon?: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: ObjectId;
  quantity: number;
  price: number;
}

export interface Order {
  _id: ObjectId;
  orderNumber: string;
  userId: ObjectId;
  items: OrderItem[];
  address: string; // Simplification for MVP
  payment: {
    method: string;
    status: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Review {
  _id: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  rating: number;
  review: string;
  createdAt: string;
}
