"use client";
import { motion } from "framer-motion";

const dotVariants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -40, 0],
  },
};

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <motion.div
        className="flex space-x-4"
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="w-6 h-6 bg-primary rounded-full"
          variants={dotVariants}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="w-6 h-6 bg-primary rounded-full"
          variants={dotVariants}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.div
          className="w-6 h-6 bg-primary rounded-full"
          variants={dotVariants}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;
