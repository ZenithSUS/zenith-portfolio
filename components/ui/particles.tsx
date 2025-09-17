"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function Particles() {
  const colors = [
    { bg: "bg-pink-500", glow: "shadow-pink-500/50" },
    { bg: "bg-blue-500", glow: "shadow-blue-500/50" },
    { bg: "bg-green-500", glow: "shadow-green-500/50" },
    { bg: "bg-purple-500", glow: "shadow-purple-500/50" },
    { bg: "bg-yellow-400", glow: "shadow-yellow-400/50" },
    { bg: "bg-red-500", glow: "shadow-red-500/50" },
  ];

  const [particles, setParticles] = useState<
    {
      left: string;
      top: string;
      color: { bg: string; glow: string };
      delay: number;
      duration: number;
    }[]
  >([]);

  // Detect if device is mobile/low-end
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }, []);

  const particleCount = isMobile ? 12 : 25;
  const glowEnabled = !isMobile;

  useEffect(() => {
    const gen = Array.from({ length: particleCount }, () => ({
      left: Math.random() * 100 + "vw",
      top: Math.random() * 100 + "vh",
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 6,
    }));
    setParticles(gen);
  }, [particleCount]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            ...{ left: p.left, top: p.top },
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
          }}
          className={`${p.color.bg} ${glowEnabled ? `${p.color.glow} shadow-lg` : ""} absolute h-3 w-3 rounded-full`}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{
            y: -200,
            opacity: [0, 1, 0],
            scale: isMobile ? [0.8, 1, 0.8] : [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.5, 1],
            ...(isMobile && {
              type: "tween",
              repeatType: "loop",
            }),
          }}
        />
      ))}
    </div>
  );
}
