"use server";

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db/connect';
import LandingPageModel, { ILandingPageConfig, defaultLandingPageConfig } from '@/lib/models/LandingPage';
import { api } from '@/lib/services/api';

function safeRevalidate() {
  try {
    revalidatePath('/');
    revalidatePath('/dashboard/landing-page');
  } catch {}
}

export async function getLandingPageConfig(): Promise<ILandingPageConfig> {
  return await api.landingPage.get();
}

export async function updateLandingPageConfig(config: ILandingPageConfig) {
  try {
    await dbConnect();

    // Sanitize payload
    const payload = {
      heroSlides: config.heroSlides || defaultLandingPageConfig.heroSlides,
      banners: config.banners || defaultLandingPageConfig.banners,
      collectionSection: config.collectionSection || defaultLandingPageConfig.collectionSection,
      marqueeText: config.marqueeText || defaultLandingPageConfig.marqueeText,
      features: config.features || defaultLandingPageConfig.features,
    };

    const updated = await LandingPageModel.findOneAndUpdate(
      {},
      { $set: payload },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    safeRevalidate();
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (err: any) {
    console.error('Error updating landing page configuration:', err);
    return { success: false, error: err.message || 'Failed to save landing page configuration' };
  }
}

export async function resetLandingPageConfig() {
  try {
    await dbConnect();
    await LandingPageModel.deleteMany({});
    const created = await LandingPageModel.create(defaultLandingPageConfig);
    safeRevalidate();
    return { success: true, data: JSON.parse(JSON.stringify(created)) };
  } catch (err: any) {
    console.error('Error resetting landing page configuration:', err);
    return { success: false, error: err.message || 'Failed to reset configuration' };
  }
}
