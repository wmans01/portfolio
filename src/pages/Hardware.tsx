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
    grabcad?: string;
  };
}

const projectsData: Project[] = [
  {
    id: "1",
    title: "LMT Trophies",
    description:
      "Trophies designed for the Lexington Math Tournament 2023 & 2024 Tetris minigame rounds.",
    fullDescription:
      "Trophies designed for the Lexington Math Tournament 2023 & 2024 Tetris minigame rounds. Designed with Fusion 360.",
    image: "/projects/lmt.jpg",
    date: "2023-01-7",
    technologies: ["CAD", "CAM", "Fusion"],
    links: {
      grabcad: "https://grabcad.com/library/lmt-tetris-trophies-2023-2",
    },
  },
  {
    id: "2",
    title: "Robolight Trophies",
    description:
      "Trophies designed for the 2025 Numberosity Academy robotics spotlight event.",
    fullDescription:
      "Trophies designed for the 2025 Numberosity Academy robotics spotlight event. Designed with Autodesk Inventor.",
    image: "/projects/robolight.png",
    date: "2025-3-14",
    technologies: ["CAD", "CAM", "Inventor"],
    links: {},
  },
  {
    id: "3",
    title: "DIY CNC Mill Project",
    description:
      "Designed and built an arduino controlled CNC mill to cut wood, plastic, and metal.",
    fullDescription:
      "A custom-built 2' x 3' CNC Mill. First designed in SOLIDWORKS and made out of wood. Powered by Arduino, and later machined its out aluminum parts to replace the wood. Also doubles as a diode laser cutter.",
    image: "/projects/cnc.jpg",
    date: "2024-07-12",
    technologies: [
      "Carpentry",
      "Machines",
      "Arduino",
      "SOLIDWORKS",
      "CAM",
      "CAD",
    ],
    links: {},
  },
  {
    id: "4",
    title: "VEX Mini Competition Switch",
    description: "A mini competition switch for V5RC",
    fullDescription:
      "This is an extremely low profile VEX competition switch, with a custom PCB. It supports up to 2 controllers connected to it. Designed with KiCAD.",
    image: "/projects/compswitch.jpg",
    date: "2025-05-15",
    technologies: ["KiCAD", "Electronics"],
    links: {
      video: "https://photos.app.goo.gl/PhrdoHWYY9gN8jkV8",
    },
  },
  {
    id: "5",
    title: "Echo10",
    description: "An 11-key macropad",
    fullDescription:
      "Echo10 is a 11 key macropad (10.57% of the keys of an actual keyboard, hence the name). It uses KMK firmware and maximizes functionality through three layers of toggleable keymaps.",
    image: "/projects/Echo10.png",
    date: "2025-06-27",
    technologies: ["KiCAD", "Electronics"],
    links: {
      github: "https://github.com/wmans01/Echo10/",
    },
  },
  {
    id: "6",
    title: "BWSI CubeSAT",
    description:
      "A 1U cube satellite to detect power outages with OpenCV and get first responders to people in need faster.",
    fullDescription:
      "This was a project done with a team for the BWSI CubeSat challenge, where we were tasked to design and code a 1U cubeSat. I was the hardware lead, and designed the CubeSat with Fusion 360.",
    image: "/projects/cubesathardware.jpg",
    date: "2024-03-30",
    technologies: ["Fusion 360", "Raspberry Pi"],
    links: {
      video: "https://youtu.be/7LWsgPeqgxI",
    },
  },
  {
    id: "7",
    title: "BWSI CreATe",
    description:
      "A 1U cube satellite to detect power outages with OpenCV and get first responders to people in need faster.",
    fullDescription:
      "This was a project done with a team for the BWSI CreATe challenge, where we worked with someone in need to design assistive technology. I was the hardware lead, and designed the robotic walker system with Fusion 360.",
    image: "/projects/createchal.jpg",
    date: "2023-03-20",
    technologies: ["Fusion 360", "3D Printing"],
    links: {
      video:
        "https://beaver-works-assistive-tech.mit.edu/create-challenge/final-event/2023-final-event",
    },
  },
  {
    id: "8",
    title: "SciOly 2024-2025 Designs",
    description: "Some of the designs I had made for Science Olympiad 2024",
    fullDescription: "Some of the designs I had made for Science Olympiad 2024",
    image: "/projects/scioly.png",
    date: "2024-11-10",
    technologies: ["Inventor", "CNC"],
    links: {
      github: "https://github.com/wmans01/JeremSciOly2425",
    },
  },
  {
    id: "9",
    title: "Todoer",
    description:
      "A portable device to display / edit your todo list like an interactive picture frame.",
    fullDescription:
      "This was a project that I made which used a touchscreen powered by a Raspberry Pi 5 (overkill, I know) When powered on, it immediately boots into a tkinter python application. The python applications interacts with the Todoist API, being able to retrieve and complete tasks through the device only. I had to play around a bit with the touchscreen/input capture methods, as it was my first time using a touchscreen monitor. Case designed with Inventor and 3D printed out of Inland Tough PLA.",
    image: "/projects/todoer.jpg",
    date: "2025-03-15",
    technologies: ["Python", "Bash", "Ubuntu", "Raspberry Pi, Inventor"],
    links: {
      github: "https://github.com/wmans01/Todoer",
    },
  },
  {
    id: "10",
    title: "Solootion",
    description: "Toilet cleaning robot to solve sanitation issues",
    fullDescription:
      "This was a project that I made with a team to participate in the social track of the UDel's Diamond Challenge. It is an autonomous robot designed to clean toilets at large public institutions without unnecessary human interation.",
    image: "/projects/solootion.jpg",
    date: "2025-01-16",
    technologies: ["Inventor", "Robotics"],
    links: {
      demo: "https://docs.google.com/document/d/1GuDvBDeWQQH-Hxrxjf4z9WfzkeM4sEkBA9rkJBLYtho/edit?usp=sharing",
    },
  },
  {
    id: "11",
    title: "Gutter Gutter",
    description: "Gutter Cleaning Robot",
    fullDescription:
      "This Gutter cleaning robot is designed to be able to clean all standardized gutters. It is able to dislodge debris and blow it out of the gutter while the user is in a safe place. Designed with Inventor.",
    image: "/projects/guttergutter.jpg",
    date: "2025-12-30",
    technologies: ["Inventor", "Robotics"],
    links: {},
  },
];

type SortOption = "date" | "name" | "random";

const Hardware: React.FC = () => {
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
