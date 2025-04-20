import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen w-full" style={{ cursor: "default" }}>
      {/* Header */}
      <div className="sticky top-20 bg-[#1a1e28] w-[80%] mx-auto z-10">
        <h1 className="text-4xl font-bold text-center text-[#00b0ff] py-4">
          Hardware Projects
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

export default Hardware;
