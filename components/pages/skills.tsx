"use client";

import { Skills as SkillsType } from "@/types/skills";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";
import BackgroundMist from "@/components/ui/background-mist";
import Image from "next/image";
import Header from "../ui/header";
import { FaCode } from "react-icons/fa";
import { useCallback, useMemo, useState } from "react";

export default function Skills({ skills }: { skills: SkillsType[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 3;

  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const handlePageChange = useCallback((page: number) => {
    if (page < 0 || page >= Math.ceil(categories.length / perPage)) return;
    setCurrentPage(page);
  }, []);

  const visibleCategories = useMemo(
    () =>
      categories.slice(currentPage * perPage, currentPage * perPage + perPage),
    [currentPage, categories],
  );

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-14 text-center sm:px-8 sm:py-20"
      id="skills"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
    >
      {/* Background effects */}
      <BackgroundMist />
      <Particles />

      <Header>
        <div className="flex items-center gap-2">
          <FaCode color="#00cfff" /> Skills
        </div>
      </Header>

      {/* Categories Container */}
      <div className="mt-2 grid w-full max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category, ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.2, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Category Title */}
            <h3 className="text-primary mb-8 text-2xl font-bold tracking-wide drop-shadow-md sm:text-3xl">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 place-content-center gap-6 sm:grid-cols-3">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    className="group border-accent/40 bg-foreground/20 hover:shadow-primary/50 relative flex flex-col items-center justify-center rounded-xl border p-6 shadow-md backdrop-blur-md transition"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{
                      scale: 1.08,
                      rotate: 2,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={64}
                      height={64}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "400px",
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="pointer-events-none object-contain transition select-none group-hover:drop-shadow-[0_0_20px_#00cfff]"
                    />
                    <p className="text-text sm:text-md mt-4 text-base font-semibold">
                      {skill.name}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="z-10 mt-12 flex items-center justify-center gap-4">
        {Array.from(
          { length: Math.ceil(categories.length / perPage) },
          (_, i) => (
            <button
              key={i}
              className={`${
                i === currentPage
                  ? "bg-primary text-foreground"
                  : "bg-foreground text-primary"
              } hover:bg-primary hover:text-foreground cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition`}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </button>
          ),
        )}
      </div>
    </motion.section>
  );
}
