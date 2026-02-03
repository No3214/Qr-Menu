/**
 * Framer Motion Variants - Premium Animations
 * Based on Foost architecture reference
 */
import type { Variants } from 'framer-motion';

// Staggered container for lists (products, categories)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Premium fade-up with spring physics
export const fadeInUp: Variants = {
  hidden: { y: 30, opacity: 0, scale: 0.98 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 60, damping: 15 },
  },
};

// Scale-in for images and cards
export const scaleIn: Variants = {
  hidden: { scale: 1.08, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: 'circOut' },
  },
};

// Modal backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Modal content slide-up with spring
export const modalSlideUp: Variants = {
  hidden: { y: '100%', opacity: 0.5 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 300 },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Header reveal from top
export const headerReveal: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Button micro-interaction
export const buttonTap = {
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// Category grid tile
export const gridTile: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

// Interactive hover effect for dish cards (Foost style)
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

// Slide up animation for cards (Foost style)
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};
