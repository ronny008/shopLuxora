"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ILandingPageConfig, 
  IHeroSlide, 
  defaultLandingPageConfig 
} from '@/types/landing';
import { updateLandingPageConfig, resetLandingPageConfig } from '@/app/(admin)/dashboard/landing-page/actions';
import { 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Sliders, 
  Layers, 
  Sparkles, 
  Megaphone, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Eye
} from 'lucide-react';

interface Props {
  initialConfig: ILandingPageConfig;
}


export function LandingPageEditorClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<ILandingPageConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'hero' | 'banners' | 'collection' | 'marquee' | 'features'>('hero');
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to show status with auto-dismiss
  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Save handler
  const handleSave = () => {
    startTransition(async () => {
      const res = await updateLandingPageConfig(config);
      if (res.success) {
        showStatus('success', 'Landing page UI updated successfully! Changes are live on your storefront.');
      } else {
        showStatus('error', res.error || 'Failed to update landing page.');
      }
    });
  };

  // Reset handler
  const handleReset = () => {
    if (!confirm('Are you sure you want to reset all landing page settings and images to default?')) {
      return;
    }
    startTransition(async () => {
      const res = await resetLandingPageConfig();
      if (res.success) {
        setConfig(defaultLandingPageConfig);
        showStatus('success', 'Landing page reset to default styling.');
      } else {
        showStatus('error', res.error || 'Failed to reset.');
      }
    });
  };

  // Slide helpers
  const handleSlideChange = (index: number, field: keyof IHeroSlide, value: string) => {
    const updatedSlides = [...config.heroSlides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setConfig({ ...config, heroSlides: updatedSlides });
  };

  const handleAddSlide = () => {
    const newSlide: IHeroSlide = {
      id: `slide-${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
      title: 'NEW COLLECTION',
      subtitle: 'DISCOVER THE LATEST STYLES',
      link: '/products',
    };
    setConfig({ ...config, heroSlides: [...config.heroSlides, newSlide] });
  };

  const handleDeleteSlide = (index: number) => {
    if (config.heroSlides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    const updatedSlides = config.heroSlides.filter((_, i) => i !== index);
    setConfig({ ...config, heroSlides: updatedSlides });
  };

  // Card helpers
  const handleCardChange = (index: number, field: 'image' | 'badge' | 'link', value: string) => {
    const updatedCards = [...config.collectionSection.cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setConfig({
      ...config,
      collectionSection: {
        ...config.collectionSection,
        cards: updatedCards,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-black">
              Landing Page Editor
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
              Live Customizer
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Customize hero images, promo banners, collection showcases, and store branding in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-black text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </Link>

          <button
            onClick={handleReset}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white hover:border-black hover:text-black transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 border flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
              : 'bg-red-50 border-red-600 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-black overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Hero Carousel ({config.heroSlides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Category Banners (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('collection')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === 'collection'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ready-To-Wear Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('marquee')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === 'marquee'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcement Marquee</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === 'features'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Feature Highlights (4)</span>
        </button>
      </div>


      {/* TAB 1: HERO CAROUSEL */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Hero Carousel Slides
              </h2>
              <p className="text-xs text-gray-500">
                These slides auto-rotate in full-bleed at the top of your homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {config.heroSlides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="bg-white border border-black p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-black bg-gray-100 px-3 py-1">
                    Slide #{index + 1}
                  </span>
                  {config.heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(index)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Image Preview */}
                  <div className="lg:col-span-4 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                      Live Preview
                    </label>
                    <div className="relative aspect-[16/9] w-full bg-slate-900 border border-black overflow-hidden flex items-center justify-center">
                      <Image
                        src={slide.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000'}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center text-white">
                        <span className="text-xs font-bold tracking-widest uppercase">{slide.title}</span>
                        <span className="text-[9px] opacity-80 uppercase mt-0.5">{slide.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-black block">
                        Background Image URL *
                      </label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="sharp-input w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-black block">
                        Main Title *
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                        placeholder="LUXORA"
                        className="sharp-input w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-black block">
                        Subtitle / Tagline *
                      </label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                        placeholder="WEAR THE CONFIDENCE"
                        className="sharp-input w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              Two-Column Split Banners
            </h2>
            <p className="text-xs text-gray-500">
              Displayed directly beneath featured products on your homepage (typically Men & Women).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1: Left Banner */}
            <div className="bg-white border border-black p-6 space-y-4">
              <div className="border-b border-black/10 pb-2 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-black bg-gray-100 px-3 py-1">
                  Banner 1 (Left Side)
                </span>
              </div>

              {/* Preview */}
              <div className="relative h-48 w-full bg-slate-900 border border-black overflow-hidden flex items-center justify-center">
                <Image
                  src={config.banners.banner1.image}
                  alt={config.banners.banner1.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                    {config.banners.banner1.buttonText || 'SHOP NOW'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={config.banners.banner1.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        banners: {
                          ...config.banners,
                          banner1: { ...config.banners.banner1, title: e.target.value },
                        },
                      })
                    }
                    className="sharp-input w-full"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={config.banners.banner1.image}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        banners: {
                          ...config.banners,
                          banner1: { ...config.banners.banner1, image: e.target.value },
                        },
                      })
                    }
                    className="sharp-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={config.banners.banner1.buttonText}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          banners: {
                            ...config.banners,
                            banner1: { ...config.banners.banner1, buttonText: e.target.value },
                          },
                        })
                      }
                      className="sharp-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Target Link
                    </label>
                    <input
                      type="text"
                      value={config.banners.banner1.link}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          banners: {
                            ...config.banners,
                            banner1: { ...config.banners.banner1, link: e.target.value },
                          },
                        })
                      }
                      className="sharp-input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Banner 2: Right Banner */}
            <div className="bg-white border border-black p-6 space-y-4">
              <div className="border-b border-black/10 pb-2 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-black bg-gray-100 px-3 py-1">
                  Banner 2 (Right Side)
                </span>
              </div>

              {/* Preview */}
              <div className="relative h-48 w-full bg-slate-900 border border-black overflow-hidden flex items-center justify-center">
                <Image
                  src={config.banners.banner2.image}
                  alt={config.banners.banner2.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                    {config.banners.banner2.buttonText || 'SHOP NOW'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={config.banners.banner2.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        banners: {
                          ...config.banners,
                          banner2: { ...config.banners.banner2, title: e.target.value },
                        },
                      })
                    }
                    className="sharp-input w-full"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={config.banners.banner2.image}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        banners: {
                          ...config.banners,
                          banner2: { ...config.banners.banner2, image: e.target.value },
                        },
                      })
                    }
                    className="sharp-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={config.banners.banner2.buttonText}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          banners: {
                            ...config.banners,
                            banner2: { ...config.banners.banner2, buttonText: e.target.value },
                          },
                        })
                      }
                      className="sharp-input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Target Link
                    </label>
                    <input
                      type="text"
                      value={config.banners.banner2.link}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          banners: {
                            ...config.banners,
                            banner2: { ...config.banners.banner2, link: e.target.value },
                          },
                        })
                      }
                      className="sharp-input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: READY-TO-WEAR COLLECTION GRID */}
      {activeTab === 'collection' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              Ready-To-Wear Collection Section
            </h2>
            <p className="text-xs text-gray-500">
              The 4-card editorial showcase grid featuring promotional discounts and seasonal highlights.
            </p>
          </div>

          {/* Section Titles */}
          <div className="bg-white border border-black p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                Section Main Title
              </label>
              <input
                type="text"
                value={config.collectionSection.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    collectionSection: {
                      ...config.collectionSection,
                      title: e.target.value,
                    },
                  })
                }
                className="sharp-input w-full"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={config.collectionSection.subtitle}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    collectionSection: {
                      ...config.collectionSection,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="sharp-input w-full"
              />
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.collectionSection.cards.map((card, index) => (
              <div key={index} className="bg-white border border-black p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                    Card #{index + 1}
                  </span>
                  {card.badge && (
                    <span className="text-[9px] font-bold bg-[#C8102E] text-white px-2 py-0.5 uppercase tracking-wider">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Preview */}
                <div className="relative aspect-[3/4] w-full bg-slate-100 border border-black overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Collection Card ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {card.badge && (
                    <div className="absolute top-2 left-2 z-10 bg-[#C8102E] px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                      {card.badge}
                    </div>
                  )}
                </div>

                {/* Inputs */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black block">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      value={card.image}
                      onChange={(e) => handleCardChange(index, 'image', e.target.value)}
                      className="sharp-input w-full !text-xs !py-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black block">
                      Offer Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={card.badge || ''}
                      onChange={(e) => handleCardChange(index, 'badge', e.target.value)}
                      placeholder="e.g. OFFER -10%"
                      className="sharp-input w-full !text-xs !py-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-black block">
                      Target Link
                    </label>
                    <input
                      type="text"
                      value={card.link || '/products'}
                      onChange={(e) => handleCardChange(index, 'link', e.target.value)}
                      placeholder="/products"
                      className="sharp-input w-full !text-xs !py-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MARQUEE ANNOUNCEMENT */}
      {activeTab === 'marquee' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              Marquee Ticker Banner
            </h2>
            <p className="text-xs text-gray-500">
              The continuous scrolling ticker displayed across the storefront.
            </p>
          </div>

          <div className="bg-white border border-black p-6 space-y-4">
            {/* Live Ticker Preview */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black block">
                Live Marquee Preview
              </label>
              <div className="w-full overflow-hidden py-6 border-y border-black bg-white">
                <div className="flex w-max animate-marquee space-x-12">
                  {Array(8).fill(config.marqueeText || 'NEW IN').map((text, i) => (
                    <span key={i} className="text-2xl md:text-3xl font-extrabold uppercase tracking-tighter text-black">
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black block">
                Announcement Text
              </label>
              <input
                type="text"
                value={config.marqueeText}
                onChange={(e) => setConfig({ ...config, marqueeText: e.target.value })}
                placeholder="e.g. NEW IN"
                className="sharp-input w-full text-base font-bold"
              />
              <p className="text-[11px] text-gray-500">
                Tip: You can use bullets like &quot;NEW IN • FREE SHIPPING ON ORDERS OVER RS. 2000 • SPRING 2026 DROP&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEATURES & TRUST BADGES */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              Feature Badges & Highlights
            </h2>
            <p className="text-xs text-gray-500">
              The four reassurance cards at the bottom of the storefront (shipping, guarantee, support).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.features.map((item, index) => (
              <div key={index} className="bg-white border border-black p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-black bg-gray-100 px-3 py-1">
                    Feature #{index + 1}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...config.features];
                        updated[index] = { ...updated[index], title: e.target.value };
                        setConfig({ ...config, features: updated });
                      }}
                      className="sharp-input w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-black block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...config.features];
                        updated[index] = { ...updated[index], description: e.target.value };
                        setConfig({ ...config, features: updated });
                      }}
                      className="sharp-input w-full !h-auto resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating/Sticky Save Action Bar */}
      <div className="sticky bottom-4 z-30 bg-black text-white p-4 border border-black flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Ready to publish changes?
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isPending}
            className="px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 bg-white text-black hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? 'Publishing...' : 'Publish to Storefront'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
