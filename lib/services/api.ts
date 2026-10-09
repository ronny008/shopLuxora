import { cache } from 'react';
import mongoose from 'mongoose';
import { Product, Category, Brand, User, Order } from '@/types';
import dbConnect from '../db/connect';
import {
  ProductModel,
  CategoryModel,
  BrandModel,
  UserModel,
  OrderModel,
  LandingPageModel,
  type ILandingPageConfig,
  defaultLandingPageConfig,
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
    getAll: cache(async (filter: { status?: Product['status'] } = {}): Promise<Product[]> => {
      try {
        await dbConnect();
        const query = filter.status ? { status: filter.status } : {};
        const docs = await ProductModel.find(query).sort({ createdAt: -1 }).lean();
        return docs.map(mapDoc<Product>);
      } catch (err) {
        console.error('MongoDB query error products:', err);
        return [];
      }
    }),
    getById: cache(async (id: string): Promise<Product | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          doc = await ProductModel.findById(id).lean();
        }
        if (!doc) {
          doc = await ProductModel.findOne({
            $or: [{ _id: id }, { slug: id }],
          }).lean();
        }
        if (doc) return mapDoc<Product>(doc);
      } catch (err) {
        console.error('MongoDB query error product by ID:', err);
      }
      return undefined;
    }),
    getByCategory: cache(async (categoryId: string): Promise<Product[]> => {
      try {
        await dbConnect();
        const query = mongoose.Types.ObjectId.isValid(categoryId)
          ? { categoryId: new mongoose.Types.ObjectId(categoryId) }
          : { categoryId };
        const docs = await ProductModel.find(query).lean();
        return docs.map(mapDoc<Product>);
      } catch (err) {
        console.error('MongoDB query error by category:', err);
        return [];
      }
    }),
  },
  categories: {
    getAll: cache(async (): Promise<Category[]> => {
      try {
        await dbConnect();
        const docs = await CategoryModel.find().lean();
        return docs.map(mapDoc<Category>);
      } catch (err) {
        console.error('MongoDB query error categories:', err);
        return [];
      }
    }),
    getById: cache(async (id: string): Promise<Category | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          doc = await CategoryModel.findById(id).lean();
        }
        if (!doc) {
          doc = await CategoryModel.findOne({
            $or: [{ _id: id }, { slug: id }],
          }).lean();
        }
        if (doc) return mapDoc<Category>(doc);
      } catch (err) {
        console.error('MongoDB query error category by ID:', err);
      }
      return undefined;
    }),
  },
  brands: {
    getAll: cache(async (): Promise<Brand[]> => {
      try {
        await dbConnect();
        const docs = await BrandModel.find().lean();
        return docs.map(mapDoc<Brand>);
      } catch (err) {
        console.error('MongoDB query error brands:', err);
        return [];
      }
    }),
    getById: cache(async (id: string): Promise<Brand | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          doc = await BrandModel.findById(id).lean();
        }
        if (!doc) {
          doc = await BrandModel.findOne({ _id: id }).lean();
        }
        if (doc) return mapDoc<Brand>(doc);
      } catch (err) {
        console.error('MongoDB query error brand by ID:', err);
      }
      return undefined;
    }),
  },
  orders: {
    getAll: cache(async (): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
        return docs.map(mapDoc<Order>);
      } catch (err) {
        console.error('MongoDB query error orders:', err);
        return [];
      }
    }),
    getByUser: cache(async (userId: string): Promise<Order[]> => {
      try {
        await dbConnect();
        const docs = await OrderModel.find({
          $or: [{ userId }, { userId: 'Customer' }],
        })
          .sort({ createdAt: -1 })
          .lean();
        return docs.map(mapDoc<Order>);
      } catch (err) {
        console.error('MongoDB query error user orders:', err);
        return [];
      }
    }),
    getById: cache(async (idOrNumber: string): Promise<Order | undefined> => {
      try {
        await dbConnect();
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
          doc = await OrderModel.findById(idOrNumber).lean();
        }
        if (!doc) {
          doc = await OrderModel.findOne({
            $or: [{ _id: idOrNumber }, { orderNumber: idOrNumber }],
          }).lean();
        }
        if (doc) return mapDoc<Order>(doc);
      } catch (err) {
        console.error('MongoDB query error order by ID:', err);
      }
      return undefined;
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
              // fallback to session payload
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
      } catch (err) {
        console.error('MongoDB query error current user:', err);
      }
      return null;
    }),
    getAll: cache(async (): Promise<User[]> => {
      try {
        await dbConnect();
        const docs = await UserModel.find().sort({ createdAt: -1 }).lean();
        return docs.map(mapDoc<User>);
      } catch (err) {
        console.error('MongoDB query error users:', err);
        return [];
      }
    }),
  },
  landingPage: {
    get: cache(async (): Promise<ILandingPageConfig> => {
      try {
        await dbConnect();
        const doc = await LandingPageModel.findOne().lean();
        if (doc) {
          const plain = JSON.parse(JSON.stringify(doc));
          delete plain._id;
          delete plain.__v;
          delete plain.createdAt;
          delete plain.updatedAt;
          return {
            ...defaultLandingPageConfig,
            ...plain,
            banners: {
              ...defaultLandingPageConfig.banners,
              ...(plain.banners || {}),
            },
            collectionSection: {
              ...defaultLandingPageConfig.collectionSection,
              ...(plain.collectionSection || {}),
            },
          };
        }
      } catch (err) {
        console.error('MongoDB query error landing page:', err);
      }
      return defaultLandingPageConfig;
    }),
  },
};
