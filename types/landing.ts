export interface IHeroSlide {
  id?: string | number;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
}

export interface ICategoryBanner {
  title: string;
  subtitle?: string;
  image: string;
  buttonText: string;
  link: string;
}

export interface ICollectionCard {
  image: string;
  badge?: string;
  link?: string;
}

export interface IFeatureItem {
  title: string;
  description: string;
  iconName?: string;
}

export interface ILandingPageConfig {
  heroSlides: IHeroSlide[];
  banners: {
    banner1: ICategoryBanner;
    banner2: ICategoryBanner;
  };
  collectionSection: {
    title: string;
    subtitle: string;
    cards: ICollectionCard[];
  };
  marqueeText: string;
  features: IFeatureItem[];
}

export const defaultLandingPageConfig: ILandingPageConfig = {
  heroSlides: [
    {
      id: 'slide-1',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop',
      title: 'LUXORA',
      subtitle: 'WEAR THE CONFIDENCE . WEAR LUXORA',
      link: '/products',
    },
    {
      id: 'slide-2',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
      title: 'NEW SEASON',
      subtitle: 'BOLD . BRUTAL . BEAUTIFUL',
      link: '/products',
    },
    {
      id: 'slide-3',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop',
      title: 'STREETWEAR',
      subtitle: 'REDEFINE YOUR SILHOUETTE',
      link: '/products',
    },
  ],
  banners: {
    banner1: {
      title: 'MEN',
      subtitle: 'Explore Men’s Essentials',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
      buttonText: 'SHOP NOW',
      link: '/categories/men',
    },
    banner2: {
      title: 'WOMEN',
      subtitle: 'Signature Female Styles',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
      buttonText: 'SHOP NOW',
      link: '/categories/women',
    },
  },
  collectionSection: {
    title: 'LUXORA',
    subtitle: 'Discover the Ready-to-Wear Collections',
    cards: [
      {
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
        badge: '',
        link: '/products',
      },
      {
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
        badge: 'OFFER -10%',
        link: '/products',
      },
      {
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
        badge: 'OFFER -10%',
        link: '/products',
      },
      {
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
        badge: 'OFFER -23%',
        link: '/products',
      },
    ],
  },
  marqueeText: 'NEW IN',
  features: [
    {
      title: 'Customer Service',
      description: 'We are available from Monday to Friday to help with your queries',
      iconName: 'Package',
    },
    {
      title: 'Nationwide Shipping',
      description: 'We Provide Pan India shipping with delivery timelines of 2-7 working days',
      iconName: 'Truck',
    },
    {
      title: 'Secure Payment',
      description: 'Your payment information is processed securely.',
      iconName: 'Gem',
    },
    {
      title: 'Contact Us',
      description: 'For all inquiries, please contact us via email at luxoraclothing@gmail.com',
      iconName: 'User',
    },
  ],
};
