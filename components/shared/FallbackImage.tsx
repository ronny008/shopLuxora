"use client";

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

export function FallbackImage({ src, fallbackSrc = 'https://placehold.co/100x100?text=P', alt, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      return fallbackSrc;
    }
    return src;
  });

  // Reset if src prop changes
  useEffect(() => {
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(src);
    }
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || ''}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
