"use client";

import { Testimonials as TestimonialsType } from "@/types/testimonials";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";
import BackgroundMist from "@/components/ui/background-mist";
import { FaStar } from "react-icons/fa6";
import Header from "../ui/header";

export default function Testimonials({
  testimonials,
}: {
  testimonials: TestimonialsType[];
}) {
  return (
    <motion.section
      id="testimonials"
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
    >
      {/* Background Effects */}
      <BackgroundMist />
      <Particles />

      {/* Section Title */}
      <Header>
        <div className="flex items-center gap-2">
          <FaStar color="#00cfff" /> Testimonials
        </div>
      </Header>

      {/* Testimonials Grid */}
      <div className="grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="glow-border bg-foreground/40 relative flex flex-col items-center rounded-2xl p-8 text-center shadow-lg backdrop-blur-lg"
          >
            {/* Avatar */}
            <motion.img
              src={t.avatar}
              alt={t.name}
              className="border-primary mb-4 h-20 w-20 rounded-full border-2 object-cover shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />

            {/* Message */}
            <p className="text-text mb-6 text-sm leading-relaxed italic">
              "{t.message}"
            </p>

            {/* Name & Role */}
            <h3 className="text-primary text-lg font-semibold">{t.name}</h3>
            <span className="text-subtext text-sm">{t.role}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
