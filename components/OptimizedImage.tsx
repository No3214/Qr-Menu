import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * OptimizedImage - Progressive blur-up image loading
 * Shows a gray placeholder that fades to the loaded image with scale animation.
 * Uses hardware acceleration for smooth transitions.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`bg-stone-100 flex items-center justify-center ${wrapperClassName}`}>
        <span className="text-stone-300 text-2xl" role="img" aria-label={alt}>🍽️</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Placeholder blur */}
      <div
        className={`absolute inset-0 bg-stone-200 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
      />

      {/* Actual image with scale reveal */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        decoding="async"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
};
