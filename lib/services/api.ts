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
import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockUsers,
  mockOrders,
} from '../mocks/data';

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
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Product>);
        }
      } catch (err) {
        console.warn('MongoDB query error (using mock products fallback):', err);
      }
      return mockProducts;
    }),
    getById: cache(async (id: string): Promise<Product | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          doc = await ProductModel.findById(id).lean();
        }
        if (!doc) {
          doc = await ProductModel.findOne({
            $or: [{ _id: id }, { slug: id }],
          }).lean();
        }
        if (doc) return mapDoc<Product>(doc);
      } catch (err) {
        console.warn('MongoDB query error by ID (using mock products fallback):', err);
      }
      return mockProducts.find((p) => p._id === id || p.slug === id);
    }),
    getByCategory: cache(async (categoryId: string): Promise<Product[]> => {
      try {
        await dbConnect();
        const docs = await ProductModel.find({ categoryId, status: 'active' }).lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Product>);
        }
      } catch (err) {
        console.warn('MongoDB query error by category (using mock products fallback):', err);
      }
      return mockProducts.filter((p) => p.categoryId === categoryId);
    }),
  },
  categories: {
    getAll: cache(async (): Promise<Category[]> => {
      try {
        await dbConnect();
        const docs = await CategoryModel.find({ status: 'active' }).lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Category>);
        }
      } catch (err) {
        console.warn('MongoDB query error categories (using mock categories fallback):', err);
      }
      return mockCategories;
    }),
  },
  brands: {
    getAll: cache(async (): Promise<Brand[]> => {
      try {
        await dbConnect();
        const docs = await BrandModel.find({ status: 'active' }).lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Brand>);
        }
      } catch (err) {
        console.warn('MongoDB query error brands (using mock brands fallback):', err);
      }
      return mockBrands;
    }),
  },
  orders: {
    getAll: cache(async (): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Order>);
        }
      } catch (err) {
        console.warn('MongoDB query error orders (using mock orders fallback):', err);
      }
      return mockOrders;
    }),
    getByUser: cache(async (userId: string): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find({
          $or: [{ userId }, { userId: 'Customer' }],
        })
          .sort({ createdAt: -1 })
          .lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<Order>);
        }
      } catch (err) {
        console.warn('MongoDB query error user orders (using mock orders fallback):', err);
      }
      return mockOrders.filter((o) => o.userId === userId || o.userId === 'Customer');
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
            $or: [{ _id: idOrNumber }, { orderNumber: idOrNumber }],
          }).lean();
        }
        if (doc) return mapDoc<Order>(doc);
      } catch (err) {
        console.warn('MongoDB query error order by ID (using mock orders fallback):', err);
      }
      return mockOrders.find((o) => o._id === idOrNumber || o.orderNumber === idOrNumber);
    }),
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
      return mockUsers[1] || mockUsers[0] || null;
    }),
    getAll: cache(async (): Promise<User[]> => {
      try {
        await dbConnect();
        const docs = await UserModel.find().lean();
        if (docs && docs.length > 0) {
          return docs.map(mapDoc<User>);
        }
      } catch (err) {
        console.warn('MongoDB query error users (using mock users fallback):', err);
      }
      return mockUsers;
    }),
  },
};
