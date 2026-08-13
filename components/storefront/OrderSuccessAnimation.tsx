"use client";

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface OrderSuccessAnimationProps {
  children?: ReactNode;
}

export function OrderSuccessAnimation({ children }: OrderSuccessAnimationProps) {
  const checkVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { delay: 0.4, duration: 0.5, ease: "easeOut" } 
    }
  };

  const containerVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "backOut" } 
    }
  };

  const textVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { delay: 0.8, duration: 0.5, ease: "easeOut" } 
    }
  };

  const detailsVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { delay: 1.1, duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Icon Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-28 h-28 mb-8"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-[#0E6334]" // Deep green for success
        >
          {/* Solid Background Circle */}
          <motion.circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          />
          {/* Animated checkmark */}
          <motion.path
            d="M 30 52 L 43 65 L 70 36"
            fill="transparent"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </motion.div>

      {/* Success Text */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="text-center space-y-3 mb-10"
      >
        <h1 className="text-2xl font-bold tracking-[0.1em] uppercase text-black">Payment Successful</h1>
        <p className="text-sm text-gray-500 font-medium">Your order has been placed and is being processed.</p>
      </motion.div>

      {/* Order Details (Children) */}
      {children && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={detailsVariants}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
