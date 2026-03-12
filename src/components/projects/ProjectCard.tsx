import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUpVariant } from "../../utils/animations";
import type { Project } from "./Projects.data";

const statusConfig = {
  live: { label: "Live", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  "open-source": { label: "Open Source", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  private: { label: "Private", className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" },
  research: { label: "Research", className: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();
  const status = statusConfig[project.status];

  return (
    <motion.article
      variants={fadeUpVariant}
      initial="rest"
      whileHover="hover"
      className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-light-surface dark:bg-dark-surface p-8 overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-none"
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      {/* Gold border glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/0 group-hover:ring-gold/25 transition-all duration-300" />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-gold transition-colors p-1 -m-1"
            aria-label={`Open ${t(project.titleKey)}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-text-primary group-hover:text-gold dark:group-hover:text-gold transition-colors duration-300">
          {t(project.titleKey)}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-500 dark:text-text-muted leading-relaxed">
          {t(project.descKey)}
        </p>

        {/* Tech stack */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border border-gray-200 dark:border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
