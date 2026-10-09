import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  IHeroSlide,
  ICategoryBanner,
  ICollectionCard,
  IFeatureItem,
  ILandingPageConfig,
  defaultLandingPageConfig,
} from '@/types/landing';

export type {
  IHeroSlide,
  ICategoryBanner,
  ICollectionCard,
  IFeatureItem,
  ILandingPageConfig,
};
export { defaultLandingPageConfig };

export interface ILandingPageDocument extends ILandingPageConfig, Document {}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    id: { type: String },
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    link: { type: String, default: '/products' },
  },
  { _id: false }
);

const CategoryBannerSchema = new Schema<ICategoryBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    buttonText: { type: String, default: 'SHOP NOW' },
    link: { type: String, default: '/products' },
  },
  { _id: false }
);

const CollectionCardSchema = new Schema<ICollectionCard>(
  {
    image: { type: String, required: true },
    badge: { type: String, default: '' },
    link: { type: String, default: '/products' },
  },
  { _id: false }
);

const FeatureItemSchema = new Schema<IFeatureItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Package' },
  },
  { _id: false }
);

const LandingPageSchema = new Schema<ILandingPageDocument>(
  {
    heroSlides: [HeroSlideSchema],
    banners: {
      banner1: CategoryBannerSchema,
      banner2: CategoryBannerSchema,
    },
    collectionSection: {
      title: { type: String, default: 'LUXORA' },
      subtitle: { type: String, default: 'Discover the Ready-to-Wear Collections' },
      cards: [CollectionCardSchema],
    },
    marqueeText: { type: String, default: 'NEW IN' },
    features: [FeatureItemSchema],
  },
  { timestamps: true }
);

export const LandingPageModel: Model<ILandingPageDocument> =
  mongoose.models.LandingPage ||
  mongoose.model<ILandingPageDocument>('LandingPage', LandingPageSchema);

export default LandingPageModel;
