import mongoose from 'mongoose';
import dbConnect from './connect';
import {
  UserModel,
  CategoryModel,
  BrandModel,
  ProductModel,
  OrderModel,
} from '../models';
import { hashPassword } from '../auth';
import { mockCategories, mockBrands, mockProducts, mockOrders } from '../mocks/data';

export async function seedDatabase() {
  console.log('Connecting to MongoDB for seeding...');
  await dbConnect();

  console.log('Clearing existing database collections...');
  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    BrandModel.deleteMany({}),
    ProductModel.deleteMany({}),
    OrderModel.deleteMany({}),
  ]);

  console.log('Seeding Users with real credentials...');
  const userMap = new Map<string, mongoose.Types.ObjectId>();
  const usersToSeed = [
    {
      _id: 'user-admin-1',
      name: 'Admin Luxora',
      email: 'admin@luxora.com',
      password: hashPassword('admin123'),
      role: 'Admin' as const,
      status: 'active' as const,
    },
    {
      _id: 'user-admin-2',
      name: 'Ronny Admin',
      email: 'ronythessery@gmail.com',
      password: hashPassword('admin123'),
      role: 'Admin' as const,
      status: 'active' as const,
    },
    {
      _id: 'user-customer-1',
      name: 'Ronny Customer',
      email: 'ronny@gmail.com',
      password: hashPassword('customer123'),
      role: 'Customer' as const,
      status: 'active' as const,
    },
    {
      _id: 'user-customer-2',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: hashPassword('customer123'),
      role: 'Customer' as const,
      status: 'active' as const,
    },
  ];

  for (const user of usersToSeed) {
    const created = await UserModel.create({
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password,
      role: user.role,
      status: user.status,
    });
    userMap.set(user._id, created._id as mongoose.Types.ObjectId);
  }

  console.log('Seeding Categories...');
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of mockCategories) {
    const created = await CategoryModel.create({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      status: cat.status,
    });
    categoryMap.set(cat._id, created._id as mongoose.Types.ObjectId);
  }

  console.log('Seeding Brands...');
  const brandMap = new Map<string, mongoose.Types.ObjectId>();
  for (const brand of mockBrands) {
    const created = await BrandModel.create({
      name: brand.name,
      logo: brand.logo,
      description: brand.description,
      website: brand.website,
      status: brand.status,
    });
    brandMap.set(brand._id, created._id as mongoose.Types.ObjectId);
  }

  console.log('Seeding Products...');
  const productMap = new Map<string, mongoose.Types.ObjectId>();
  for (const prod of mockProducts) {
    const catId = categoryMap.get(prod.categoryId) || Array.from(categoryMap.values())[0];
    const brandId = brandMap.get(prod.brandId) || Array.from(brandMap.values())[0];

    const created = await ProductModel.create({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice,
      discountPercent: prod.discountPercent,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      colors: prod.colors,
      isFeatured: prod.isFeatured,
      isSoldOut: prod.isSoldOut,
      stock: prod.stock,
      images: prod.images,
      categoryId: catId,
      brandId: brandId,
      status: prod.status,
    });
    productMap.set(prod._id, created._id as mongoose.Types.ObjectId);
  }

  console.log('Seeding Orders...');
  for (const order of mockOrders) {
    const userId = userMap.get(order.userId) || Array.from(userMap.values())[0];
    const items = order.items.map(item => ({
      productId: productMap.get(item.productId) || Array.from(productMap.values())[0],
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderModel.create({
      orderNumber: order.orderNumber,
      userId,
      items,
      address: order.address,
      payment: order.payment,
      total: order.total,
      status: order.status,
    });
  }

  console.log('Database seeding complete!');
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}
