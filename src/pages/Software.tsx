import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProjectModal from "../components/ProjectModal";

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
    <div className="min-h-screen w-full" style={{ cursor: "default" }}>
      {/* Header */}
      <div className="sticky top-20 bg-[#1a1e28] w-[80%] mx-auto z-10">
        <h1 className="text-4xl font-bold text-center text-[#00b0ff] py-4 font-[`Inter`, sans-serif]">
          Software Projects
        </h1>
      </div>

      {/* Spacer */}
      <div className="h-[100px]" />

      {/* Main Content */}
      <div className="flex flex-col items-center">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block w-[30%] px-4 mb-8"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2a2f3e] rounded-xl p-2 flex items-center gap-8"
          >
            <motion.input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white px-4 py-2 text-sm flex-1 focus:outline-none"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={{ cursor: "text" }}
            />
            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#1a1e28] border border-[#3a3f4e] text-white px-4 py-2 text-sm rounded-lg appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%2300b0ff%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em] pr-8"
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ cursor: "pointer" }}
            >
              <option value="date">Latest</option>
              <option value="name">A-Z</option>
              <option value="random">Random</option>
            </motion.select>
          </motion.div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-8 w-[80%]">
          {filteredAndSortedProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#2a2f3e] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,176,255,0.2)] cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="!p-4">
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
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 ${selectedProject ? "z-[100]" : "z-[-1]"}`}
      >
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
};

export default Software;
