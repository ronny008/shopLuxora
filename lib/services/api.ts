import { cache } from 'react';
import { Product, Category, Brand, User, Order } from '@/types';
import dbConnect from '../db/connect';
import {
  ProductModel,
  CategoryModel,
  BrandModel,
  UserModel,
  OrderModel,
} from '../models';

function mapDoc<T>(doc: any): T {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id) obj._id = obj._id.toString();
  if (obj.categoryId) obj.categoryId = obj.categoryId.toString();
  if (obj.brandId) obj.brandId = obj.brandId.toString();
  if (obj.userId) obj.userId = obj.userId.toString();
  if (obj.parentCategory) obj.parentCategory = obj.parentCategory.toString();
  if (obj.createdAt && typeof obj.createdAt !== 'string') {
    obj.createdAt = new Date(obj.createdAt).toISOString();
  }
  if (obj.updatedAt && typeof obj.updatedAt !== 'string') {
    obj.updatedAt = new Date(obj.updatedAt).toISOString();
  }
  if (obj.items && Array.isArray(obj.items)) {
    obj.items = obj.items.map((item: any) => ({
      ...item,
      productId: item.productId ? item.productId.toString() : item.productId,
    }));
  }
  return obj as T;
}

export const api = {
  products: {
    getAll: cache(async (): Promise<Product[]> => {
      try {
        await dbConnect();
        const docs = await ProductModel.find({ status: 'active' }).lean();
        return docs.map(mapDoc<Product>);
      } catch (err) {
        console.warn('MongoDB query error:', err);
        return [];
      }
    }),
    getById: cache(async (id: string): Promise<Product | undefined> => {
      try {
        await dbConnect();
        const doc = await ProductModel.findById(id).lean();
        if (doc) return mapDoc<Product>(doc);
      } catch (err) {
        console.warn('MongoDB query error by ID:', err);
      }
      return undefined;
    }),
    getByCategory: cache(async (categoryId: string): Promise<Product[]> => {
      try {
        await dbConnect();
        const docs = await ProductModel.find({ categoryId, status: 'active' }).lean();
        return docs.map(mapDoc<Product>);
      } catch (err) {
        console.warn('MongoDB query error by category:', err);
        return [];
      }
    })
  },
  categories: {
    getAll: cache(async (): Promise<Category[]> => {
      try {
        await dbConnect();
        const docs = await CategoryModel.find({ status: 'active' }).lean();
        return docs.map(mapDoc<Category>);
      } catch (err) {
        console.warn('MongoDB query error categories:', err);
        return [];
      }
    })
  },
  brands: {
    getAll: cache(async (): Promise<Brand[]> => {
      try {
        await dbConnect();
        const docs = await BrandModel.find({ status: 'active' }).lean();
        return docs.map(mapDoc<Brand>);
      } catch (err) {
        console.warn('MongoDB query error brands:', err);
        return [];
      }
    })
  },
  orders: {
    getAll: cache(async (): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
        return docs.map(mapDoc<Order>);
      } catch (err) {
        console.warn('MongoDB query error orders:', err);
        return [];
      }
    }),
    getByUser: cache(async (userId: string): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find({
          $or: [{ userId }, { userId: 'Customer' }]
        }).sort({ createdAt: -1 }).lean();
        return docs.map(mapDoc<Order>);
      } catch (err) {
        console.warn('MongoDB query error user orders:', err);
        return [];
      }
    }),
    getById: cache(async (idOrNumber: string): Promise<Order | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (idOrNumber.match(/^[0-9a-fA-F]{24}$/)) {
          doc = await OrderModel.findById(idOrNumber).lean();
        }
        if (!doc) {
          doc = await OrderModel.findOne({
            $or: [{ _id: idOrNumber }, { orderNumber: idOrNumber }]
          }).lean();
        }
        if (doc) return mapDoc<Order>(doc);
      } catch (err) {
        console.warn('MongoDB query error order by ID:', err);
      }
      return undefined;
    })
  },
  auth: {
    getCurrentUser: cache(async (): Promise<User | null> => {
      try {
        const { getAuthCookie, verifySessionToken } = await import('../auth');
        const token = await getAuthCookie();
        if (token) {
          const payload = verifySessionToken(token);
          if (payload && payload.userId) {
            try {
              await dbConnect();
              const doc = await UserModel.findById(payload.userId).lean();
              if (doc) return mapDoc<User>(doc);
            } catch {
              // fallback to session payload if db fails
            }
            return {
              _id: payload.userId,
              name: payload.name || 'User',
              email: payload.email || 'user@example.com',
              role: payload.role || 'Customer',
              status: 'active',
              createdAt: new Date().toISOString(),
            };
          }
        }
        await dbConnect();
        const doc = await UserModel.findOne({ role: 'Customer' }).lean();
        if (doc) return mapDoc<User>(doc);
      } catch (err) {
        console.warn('MongoDB query error current user:', err);
      }
      return null;
    }),
    getAll: cache(async (): Promise<User[]> => {
      try {
        await dbConnect();
        const docs = await UserModel.find().lean();
        return docs.map(mapDoc<User>);
      } catch (err) {
        console.warn('MongoDB query error users:', err);
        return [];
      }
    })
  }
};
