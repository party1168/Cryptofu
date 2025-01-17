"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BackgroundEffects: React.FC = () => {
  const [raindrops, setRaindrops] = useState<
    { left: string; delay: number; duration: number }[]
  >([]);
  useEffect(() => {
    const drops = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }));
    setRaindrops(drops);
  }, []);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle geometric shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Raindrop animation */}
      {raindrops.map((drop, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full"
          initial={{
            top: -10,
            left: drop.left,
            opacity: 0.7,
          }}
          animate={{
            top: "100%",
            opacity: 0,
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: drop.delay,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffects;
