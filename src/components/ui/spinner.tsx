"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const dotVariants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -10, 0],
  },
};

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };
  const spaceClasses = {
    sm: "space-x-1",
    md: "space-x-1.5",
    lg: "space-x-2",
  };

  return (
    <motion.div
      className={cn("flex items-center", spaceClasses[size], className)}
      initial="initial"
      animate="animate"
      aria-label="Loading"
      role="status"
    >
      <motion.div
        className={cn("bg-primary rounded-full", sizeClasses[size])}
        variants={dotVariants}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.div
        className={cn("bg-primary rounded-full", sizeClasses[size])}
        variants={dotVariants}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <motion.div
        className={cn("bg-primary rounded-full", sizeClasses[size])}
        variants={dotVariants}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </motion.div>
  );
}

export { Spinner };
