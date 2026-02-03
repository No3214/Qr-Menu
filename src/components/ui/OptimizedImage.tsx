import React, { useState } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    loading?: "lazy" | "eager";
}

/**
 * OptimizedImage - High-end image component with blur-up effect and smooth transitions.
 * Inspired by luxury architecture sites.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    containerClassName,
    loading = "lazy"
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={clsx("relative overflow-hidden bg-surface", containerClassName)}>
            {/* Placeholder / Skeleton */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary/5 backdrop-blur-xl flex items-center justify-center z-10"
                    >
                        <div className="w-8 h-8 border-2 border-primary/10 border-t-accent rounded-full animate-spin opacity-20" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actual Image */}
            <motion.img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                animate={isLoaded ? {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)'
                } : {}}
                transition={{
                    opacity: { duration: 0.8, ease: "easeOut" },
                    scale: { duration: 1.2, ease: "easeOut" },
                    filter: { duration: 0.8 }
                }}
                className={clsx(
                    "w-full h-full object-cover block",
                    className
                )}
                loading={loading}
                decoding="async"
            />
        </div>
    );
};
