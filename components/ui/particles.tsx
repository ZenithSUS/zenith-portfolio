"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Particles() {
  const colors = [
    { bg: "bg-pink-500", glow: "shadow-[0_0_15px_#ec4899]" },
    { bg: "bg-blue-500", glow: "shadow-[0_0_15px_#3b82f6]" },
    { bg: "bg-green-500", glow: "shadow-[0_0_15px_#22c55e]" },
    { bg: "bg-purple-500", glow: "shadow-[0_0_15px_#a855f7]" },
    { bg: "bg-yellow-400", glow: "shadow-[0_0_15px_#facc15]" },
    { bg: "bg-red-500", glow: "shadow-[0_0_15px_#ef4444]" },
  ];

  const [particles, setParticles] = useState<
    { left: string; top: string; color: { bg: string; glow: string } }[]
  >([]);

  useEffect(() => {
    const gen = Array.from({ length: 25 }, () => ({
      left: Math.random() * 100 + "vw",
      top: Math.random() * 100 + "vh",
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(gen);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{ left: p.left, top: p.top }}
          className={`${p.color.bg} ${p.color.glow} absolute h-3 w-3 rounded-full`}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{
            y: -200,
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 6 + 6,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
