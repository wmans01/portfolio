import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/Layout/PageLayout";

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

// Sample data - replace with your actual projects
const projectsData: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description:
      "A modern, interactive portfolio website built with React, TypeScript, and Three.js featuring dynamic 3D elements.",
    fullDescription:
      "This portfolio website showcases my work with a unique 3D interactive background and smooth transitions. Built with React, TypeScript, and Three.js, it features a particle system, dynamic lighting, and responsive design. The project demonstrates modern web development practices and creative UI/UX design.",
    image: "/projects/portfolio.jpg",
    date: "2024-03-15",
    technologies: ["React", "TypeScript", "Three.js", "TailwindCSS"],
    links: {
      github: "https://github.com/yourusername/portfolio",
      demo: "https://your-portfolio.com",
    },
  },
  {
    id: "2",
    title: "AI Image Generator",
    description:
      "A web application that generates images using AI, featuring real-time previews and custom style options.",
    fullDescription:
      "This AI-powered image generation tool allows users to create unique artwork using various AI models. The application features real-time previews, custom style options, and a user-friendly interface. Built with Python and React, it demonstrates integration with AI APIs and modern web development practices.",
    image: "/projects/ai-generator.jpg",
    date: "2023-12-01",
    technologies: ["Python", "React", "TensorFlow", "REST API"],
    links: {
      github: "https://github.com/yourusername/ai-generator",
      demo: "https://ai-generator.com",
    },
  },
  {
    id: "3",
    title: "Task Management App",
    description:
      "A full-stack task management application with real-time updates and collaborative features.",
    fullDescription:
      "A comprehensive task management solution featuring real-time updates, team collaboration, and advanced filtering. Built with Node.js, React, and WebSocket technology, it provides a seamless user experience with offline support and data synchronization.",
    image: "/projects/task-manager.jpg",
    date: "2023-08-20",
    technologies: ["Node.js", "React", "MongoDB", "WebSocket"],
    links: {
      github: "https://github.com/yourusername/task-manager",
      demo: "https://task-manager.com",
    },
  },
];

type SortOption = "date" | "name" | "random";

const Software: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredAndSortedProjects = useMemo(() => {
    let projects = [...projectsData];

    // Filter by search query
    if (searchQuery) {
      projects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort projects
    switch (sortBy) {
      case "date":
        return projects.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "name":
        return projects.sort((a, b) => a.title.localeCompare(b.title));
      case "random":
        return projects.sort(() => Math.random() - 0.5);
      default:
        return projects;
    }
  }, [searchQuery, sortBy]);

  return (
    <PageLayout>
      {/* Header */}
      <h1 className="page-title text-center">Software Projects</h1>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="date">Latest</option>
          <option value="name">A-Z</option>
          <option value="random">Random</option>
        </select>
      </div>

      {/* Project Grid */}
      <div className="grid-container">
        {filteredAndSortedProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card"
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-2 line-clamp-2">
                {project.description}
              </p>
              <span className="text-sm text-[#00b0ff]">
                {new Date(project.date).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card max-w-4xl max-h-[90vh] w-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedProject.title}
                  </h2>
                  <span className="text-[#00b0ff]">
                    {new Date(selectedProject.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {selectedProject.fullDescription}
                </p>
                <div className="flex gap-4">
                  {selectedProject.links?.github && (
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#00b0ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                      View on GitHub
                    </a>
                  )}
                  {selectedProject.links?.demo && (
                    <a
                      href={selectedProject.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#00b0ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                      View Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Software;
