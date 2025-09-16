"use client";

import { motion } from "framer-motion";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <motion.h1
      className="text-primary mb-12 text-center text-4xl font-bold drop-shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.h1>
  );
}
