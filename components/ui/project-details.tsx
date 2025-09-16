"use client";

import { Project } from "@/types/projects";
import Image from "next/image";
import { FaGithub, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProjectDetailsProps {
  project: Project | null;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedProject: (project: Project | null) => void;
}

export default function ProjectDetails({
  project,
  isModalOpen,
  setIsModalOpen,
  setSelectedProject,
}: ProjectDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function closeModal() {
    setSelectedProject(null);
    setIsModalOpen(false);
    setCurrentImageIndex(0);
  }

  if (!project) return null;

  const images = Array.isArray(project.images)
    ? project.images
    : [project.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      key={project.title}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className="flex w-full max-w-4xl flex-1 items-center justify-center px-4"
      contentLabel="Project details"
      overlayClassName="bg-black/70 fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        className="bg-foreground/30 custom-scrollbar border-accent/30 relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border p-6 shadow-xl backdrop-blur-lg sm:p-8"
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/40 p-2 hover:bg-black/60"
          onClick={closeModal}
        >
          <FaTimes className="text-red-400" size={20} />
        </button>

        {/* Title */}
        <h2 className="text-primary mb-6 text-center text-2xl font-bold sm:text-3xl">
          {project.title}
        </h2>

        {/* Image with Pagination */}
        <div className="relative mb-4 flex justify-center">
          <Image
            src={images[currentImageIndex]}
            alt={project.title}
            width={600}
            height={400}
            style={{ objectFit: "contain" }}
            className="h-auto w-full max-w-2xl rounded-lg object-cover"
          />

          {/* Prev Button */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
              >
                ‹
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Pagination */}
        {images.length > 1 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {images.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`cursor-pointer rounded-md border-2 ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                  className="h-16 w-20 rounded-md object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-text mb-6 text-center text-sm leading-relaxed sm:text-base">
          {project.description}
        </p>

        {/* Features */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {project.features.map((feature, index) => (
            <div
              key={index}
              className="bg-primary/10 rounded-xl px-3 py-2 text-center shadow-md"
            >
              <p className="text-primary text-sm font-medium sm:text-base">
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub size={22} /> Code
          </motion.a>

          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 font-medium text-green-400 transition hover:bg-green-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt size={20} /> Live Demo
            </motion.a>
          )}
        </div>
      </motion.div>
    </Modal>
  );
}
