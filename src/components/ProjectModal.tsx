import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  date: string;
  technologies: string[];
  links?: {
    github?: string;
    demo?: string;
    video?: string;
  };
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    // Get the modal content element
    const modalContent = document.querySelector(".modal-content");

    // Check if the click is inside the modal content
    if (modalContent && !modalContent.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50" onClick={handleClickOutside}>
        {/* Invisible Overlay */}
        <div className="fixed inset-0 z-[49]" />

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 backdrop-blur-lg z-50"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-[51]"
        >
          <div
            className="modal-content bg-[#1a1a1a] max-w-6xl w-[90%] max-h-[90vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[400px]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="!p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold !text-white">
                  {project.title}
                </h2>
                <span className="text-[#00b0ff] text-lg">
                  {new Date(project.date).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-16">
                <p className="!text-gray-300 text-lg leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
