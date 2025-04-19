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
    title: "VEX Robotics",
    description:
      "Lead designer for a nationally recognized VEX robotics team, developing autonomous systems and innovative mechanical solutions.",
    fullDescription:
      "As the lead designer for our VEX robotics team, I developed autonomous systems and mechanical solutions that helped us achieve national recognition. The project involved designing and implementing complex robotic systems using C++ for programming and CAD for mechanical design.",
    image: "/projects/vex-robotics.jpg",
    date: "2024-03-15",
    technologies: ["C++", "CAD", "Robotics", "Autonomous Systems"],
    links: {
      github: "https://github.com/yourusername/vex-robotics",
      video: "https://youtube.com/...",
    },
  },
  {
    id: "2",
    title: "Gutter-cleaning Robot",
    description:
      "Developed an autonomous robot for gutter maintenance, featuring advanced navigation and cleaning mechanisms.",
    fullDescription:
      "This autonomous gutter-cleaning robot was designed to safely and efficiently maintain residential gutters. It features computer vision for navigation, custom cleaning mechanisms, and failsafe systems to prevent damage to property.",
    image: "/projects/gutter-robot.jpg",
    date: "2023-12-01",
    technologies: [
      "Arduino",
      "Raspberry Pi",
      "Computer Vision",
      "Mechanical Design",
    ],
    links: {
      github: "https://github.com/yourusername/gutter-robot",
      video: "https://youtube.com/...",
    },
  },
  {
    id: "3",
    title: "3D Printer Project",
    description:
      "Designed and built a high-performance 3D printer with advanced features and precision engineering.",
    fullDescription:
      "A custom-built 3D printer featuring high-precision motion systems, advanced firmware, and custom electronics. The project involved mechanical design, electronics assembly, and firmware development to create a reliable and precise printing system.",
    image: "/projects/3d-printer.jpg",
    date: "2023-08-20",
    technologies: [
      "3D Printing",
      "Mechanical Design",
      "Electronics",
      "Firmware",
    ],
    links: {
      github: "https://github.com/yourusername/3d-printer",
      video: "https://youtube.com/...",
    },
  },
];

type SortOption = "date" | "name" | "random";

const Hardware: React.FC = () => {
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
      <h1 className="page-title text-center">Hardware Projects</h1>

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
                  {selectedProject.links?.video && (
                    <a
                      href={selectedProject.links.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#00b0ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                      Watch Video
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

export default Hardware;
