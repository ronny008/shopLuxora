"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IHeroSlide } from '@/types/landing';

const defaultSlides: IHeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop',
    title: 'LUXORA',
    subtitle: 'WEAR THE CONFIDENCE . WEAR LUXORA',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
    title: 'NEW SEASON',
    subtitle: 'BOLD . BRUTAL . BEAUTIFUL',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop',
    title: 'STREETWEAR',
    subtitle: 'REDEFINE YOUR SILHOUETTE',
  },
];

interface HeroCarouselProps {
  slides?: IHeroSlide[];
}

export function HeroCarousel({ slides: propSlides }: HeroCarouselProps) {
  const activeSlides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= activeSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= activeSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? activeSlides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] max-h-[800px] bg-slate-100 flex items-center justify-between px-4 group overflow-hidden">
      {/* Slides */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
              style={{ 
                backgroundImage: `url("${slide.image}")`
              }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Overlay Text with Animation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
              <div className="overflow-hidden">
                <h1 
                  className={`text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase transition-transform duration-1000 delay-300 ease-out ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-[100%] opacity-0'
                  }`}
                >
                  {slide.title}
                </h1>
              </div>
              <div className="overflow-hidden mt-3 md:mt-4">
                <p 
                  className={`text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold tracking-[0.1em] md:tracking-[0.15em] uppercase transition-all duration-1000 delay-500 ease-out ${
                    isActive ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                  }`}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            suppressHydrationWarning
            aria-label="Previous Slide"
            className="relative z-20 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            suppressHydrationWarning
            aria-label="Next Slide"
            className="relative z-20 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                suppressHydrationWarning
                aria-label={`Slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
