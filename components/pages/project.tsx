"use client";

import { motion } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaBuilding,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import Image from "next/image";
import BackgroundMist from "@/components/ui/background-mist";
import { Project } from "@/types/projects";
import Header from "../ui/header";
import { useCallback, useMemo, useRef, useState } from "react";
import ProjectDetails from "../ui/project-details";

export default function ProjectContent({ projects }: { projects: Project[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const totalPages = useMemo(
    () => Math.ceil(projects.length / projectsPerPage) || 1,
    [projects],
  );

  const handleScrollToProjects = useCallback(() => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [projectsRef, currentPage]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleNextPage = () => {
    handleScrollToProjects();
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    handleScrollToProjects();
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleChangePage = (page: number) => {
    handleScrollToProjects();
    setCurrentPage(page);
  };

  // Slice projects for current page
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = useMemo(
    () => projects.slice(startIndex, startIndex + projectsPerPage),
    [projects, currentPage],
  );

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-8 sm:py-20"
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      ref={projectsRef}
    >
      {/* Project Details Modal */}
      {selectedProject && isModalOpen && (
        <ProjectDetails
          project={selectedProject}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setSelectedProject={setSelectedProject}
        />
      )}

      {/* Background Effects */}
      <BackgroundMist />

      <Header>
        <div className="flex items-center gap-2">
          <FaBuilding color="#00cfff" /> Projects
        </div>
      </Header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {currentProjects.map((project, index) => (
          <motion.div
            key={index}
            className="border-accent bg-foreground/10 hover:shadow-primary/40 cursor-pointer rounded-2xl border p-6 shadow-lg backdrop-blur-lg transition"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
          >
            {/* Image Placeholder */}
            <motion.div
              className="from-primary/20 via-accent/20 to-background relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onClick={() => handleProjectClick(project)}
                loading="lazy"
                placeholder="blur"
                blurDataURL={project.image}
              />
            </motion.div>

            <h2 className="text-primary text-2xl font-semibold">
              {project.title}
            </h2>
            <p className="text-text mt-2 text-sm">{project.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              {project.demo !== "#" && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary text-text flex cursor-pointer items-center gap-1 text-sm"
                >
                  <FaExternalLinkAlt size={16} color="#3b82f6" /> Live Demo
                </a>
              )}

              {project.demo2 !== "#" && (
                <a
                  href={project.demo2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary text-text flex cursor-pointer items-center gap-1 text-sm"
                >
                  <FaDownload size={16} color="#3b82f6" /> App
                </a>
              )}

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary flex items-center gap-1 text-sm"
              >
                <FaGithub /> Code
              </a>
              <button
                onClick={() => handleProjectClick(project)}
                className="hover:text-primary flex cursor-pointer items-center gap-1 text-sm"
              >
                <FaEye size={16} color="#3b82f6" />
                Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="z-10 mt-10 flex items-center gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-primary/20 text-primary rounded-lg px-3 py-1 text-sm disabled:opacity-40"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={handleChangePage.bind(null, i + 1)}
            className={`h-8 w-8 rounded-full text-sm font-medium ${
              currentPage === i + 1
                ? "bg-primary text-white"
                : "bg-foreground/20 text-primary hover:bg-primary/30"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-primary/20 text-primary rounded-lg px-3 py-1 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </motion.section>
  );
}
