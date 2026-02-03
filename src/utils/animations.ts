import { Variants } from "framer-motion";

/**
 * Framer Motion Variants for High-End Transitions
 * Inspired by luxury architectural presentation sites.
 */

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const fadeInUp: Variants = {
    hidden: {
        y: 30,
        opacity: 0
    },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 0.8,
            bounce: 0.3
        }
    },
};

export const scaleIn: Variants = {
    hidden: {
        scale: 1.05,
        opacity: 0
    },
    show: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut"
        }
    },
};

export const revealMask: Variants = {
    hidden: { clipPath: "inset(50% 0 50% 0)", opacity: 0 },
    show: {
        clipPath: "inset(0% 0 0% 0)",
        opacity: 1,
        transition: {
            duration: 1.4,
            ease: "circOut"
        }
    }
};

export const slideInRight: Variants = {
    hidden: { x: 30, opacity: 0 },
    show: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        x: -30,
        opacity: 0,
        transition: {
            duration: 0.4
        }
    }
};
