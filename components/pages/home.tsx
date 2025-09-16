"use client";

import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";
import BackgroundMist from "@/components/ui/background-mist";
import Image from "next/image";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <motion.section
      id="home"
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-8 sm:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Background effects */}
      <BackgroundMist />
      <Particles />

      {/* Glow halo */}
      <div className="bg-primary/20 absolute -z-10 h-[500px] w-[500px] rounded-full blur-3xl" />

      {/* Silhouette */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 -z-10 flex items-center justify-center"
      >
        <Image
          src="/images/silhouette.png"
          alt="Hero Silhouette"
          width={500}
          height={500}
          style={{
            width: "auto",
            height: "auto",
          }}
          sizes="100vw"
          className="pointer-events-none absolute object-contain opacity-50 drop-shadow-[0_0_25px_#00cfff] select-none"
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="glow-border bg-foreground/30 relative rounded-2xl px-10 py-12 backdrop-blur-lg"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-6xl font-extrabold tracking-wide"
        >
          Hi, I am{" "}
          <span className="glow-blue text-primary drop-shadow-lg">Jeran</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-subtext mb-6 text-2xl font-semibold"
        >
          Full Stack Developer
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-text mb-10 max-w-xl text-lg leading-relaxed"
        >
          Crafting modern, scalable, and efficient web and mobile apps with{" "}
          <span className="text-accent">Next.js</span>,{" "}
          <span className="text-primary">React/React Native</span>, and{" "}
          <span className="text-accent">Node.js</span>. Always leveling up like
          a hunter on a mission ⚔️.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px #00cfff" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-background rounded-lg px-8 py-3 font-semibold shadow-lg transition"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px #7f00ff" }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent text-background rounded-lg px-8 py-3 font-semibold shadow-lg transition"
          >
            Contact Me
          </motion.a>
        </motion.div>

        {/* Social Media Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: false }}
          className="mt-8 flex justify-center gap-6"
        >
          <a
            href="https://github.com/ZenithSUS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-primary transition"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/jeran-christopher-d-merino-24672a348/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="mailto:jeranmerino147@email.com"
            className="text-text transition hover:text-rose-400"
          >
            <FaEnvelope size={28} />
          </a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
