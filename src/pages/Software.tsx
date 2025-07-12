import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProjectModal from "../components/ProjectModal";
import Footer from "../components/Footer";

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

const projectsData: Project[] = [
  {
    id: "1",
    title: "This website!",
    description:
      "An interactive portfolio website built with React, TypeScript, and Three.js with dynamic 3D elements.",
    fullDescription:
      "This portfolio website showcases some of my work and who I am. It is built with React, TypeScript, and Three.js.",
    image: "/projects/portfolio.jpg",
    date: "2025-07-10",
    technologies: ["React", "TypeScript", "Three.js", "TailwindCSS"],
    links: {
      github: "https://github.com/wmans01/portfolio",
      demo: "https://portfolio.com",
    },
  },
  {
    id: "2",
    title: "Badatro",
    description:
      "Balatro but bad. This is a extremely dumbed down version of balatro that I made in Java for my AP Computer Science A final project. (Missing a lot of features)",
    fullDescription:
      "Balatro but bad. This is a extremely dumbed down version of balatro that I made in Java for my AP Computer Science A final project. It uses MongoDB to store player data. THe GUI is also made with JavaFX",
    image: "/projects/badatro.jpg",
    date: "2025-06-10",
    technologies: ["MongoDB", "JavaFX", "Java"],
    links: {
      github: "https://github.com/wmans01/Badatro",
    },
  },
  {
    id: "3",
    title: "Todoer",
    description:
      "A portable device to display / edit your todo list like an interactive picture frame.",
    fullDescription:
      "This was a project that I made which used a touchscreen powered by a Raspberry Pi 5 (overkill, I know) When powered on, it immediately boots into a tkinter python application. The python applications interacts with the Todoist API, being able to retrieve and complete tasks through the device only. I had to play around a bit with the touchscreen/input capture methods, as it was my first time using a touchscreen monitor.",
    image: "/projects/todoer.jpg",
    date: "2025-03-15",
    technologies: ["Python", "Bash", "Ubuntu", "Raspberry Pi"],
    links: {
      github: "https://github.com/wmans01/Todoer",
    },
  },
  {
    id: "4",
    title: "Numberosity Site 2.0",
    description:
      "This was a rewrite of the previous Numberosity Academy website, which was made with Wordpress.",
    fullDescription:
      "The purpose of this was to make the information on the site more accessible, as well as draw in more interested people. The new site was designed to be more user-friendly and holds all of the previous math and robotics course material.",
    image: "/projects/numberositysite.jpg",
    date: "2024-12-20",
    technologies: ["React", "TailwindCSS"],
    links: {
      github: "https://github.com/wmans01/NumberositySite2.0",
      demo: "https://numberosity.org",
    },
  },
  {
    id: "5",
    title: "BWSI CubeSAT",
    description:
      "A 1U cube satellite to detect power outages with OpenCV and get first responders to people in need faster.",
    fullDescription:
      "This was a project done with a team for the BWSI CubeSat challenge, where we were tasked to design and code a 1U cubeSat. We used openCV to take images from the picamera and display the darker areas/suspected power outage areas compared to an existing map of the are.",
    image: "/projects/cubesat.jpg",
    date: "2024-03-30",
    technologies: [
      "Python",
      "Picamera",
      "Raspbian",
      "Raspberry Pi",
      "CubeSAT,",
      "OpenCV",
    ],
    links: {
      video: "https://youtu.be/7LWsgPeqgxI",
    },
  },
  {
    id: "6",
    title: "Giftly",
    description: "A gift picker to give better gifts!",
    fullDescription:
      "This was a project done with a team for the MIT Blueprint Hackathon. It is a mobile application designed with React native, and tested on mobile with Expo Go. It features an interactive list, where users can enter new ideas for gifts, as well as a gift picker based on interests, using Google's Word2Vec",
    image: "/projects/giftly.jpg",
    date: "2025-02-10",
    technologies: [
      "Expo Go",
      "Hackathon",
      "Word2Vec",
      "React Native",
      "Expo Go",
    ],
    links: {
      github: "https://github.com/viv511/giftly",
    },
  },
  {
    id: "7",
    title: "CyberPassword",
    description: "Password Generator and Security Simulator",
    fullDescription:
      "This was a project done with a team for the Stem Warrior Hacks Hackathon. It is a webpage that checks the stability of an entered password, and also generates a password based on familiar words with text-to-speech AI.",
    image: "/projects/cyberpassword.jpg",
    date: "2024-03-30",
    technologies: ["HTML", "Javascript", "Hackathon", "AI"],
    links: {
      demo: "https://devpost.com/software/cyberpassword#updates",
    },
  },
  {
    id: "8",
    title: "BWSI RACECAR",
    description: "Autonomous Vehicle Goes Vroom",
    fullDescription:
      "This was a project done with a team for the MIT BWSI RACECAR course. It involved motion controllers such as PID and tracking movement with an IMU, as well as using openCV and a Lidar to get inputs from its surroundings.",
    image: "/projects/racecar.jpg",
    date: "2024-03-30",
    technologies: [
      "Autonomous Vehicle",
      "Robotics",
      "Python",
      "ROS 2",
      "OpenCV",
    ],
    links: {
      demo: "https://sites.mit.edu/mit-racecar/papers-volume-1/",
    },
  },
  {
    id: "9",
    title: "Decaptcha",
    description: "ReCaptcha V1 Solver",
    fullDescription:
      "This was a project done for the ECE course I took at the WPI Frontiers Summer Program. It was trained on a captcha dataset (linked on the github) to solve V1 reCaptcha tests, which as of now, are discontinued.",
    image: "/projects/decaptcha.jpg",
    date: "2023-07-21",
    technologies: ["Scikit Learn", "AI/ML", "Python", "R"],
    links: {
      github: "https://github.com/wmans01/DeCaptcha",
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
    <div className="w-full" style={{ cursor: "default" }}>
      <div className="sticky top-20 bg-[#1a1e28] w-[80%] mx-auto z-10">
        <h1 className="text-4xl font-bold text-center text-[#00b0ff] py-4 font-[`Inter`, sans-serif]">
          Software Projects
        </h1>
      </div>

      <div className="h-[100px]" />

      <div className="flex flex-col items-center">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-24 w-[80%]">
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

      <div className="h-8" />

      <div
        className={`fixed inset-0 ${selectedProject ? "z-[100]" : "z-[-1]"}`}
      >
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Software;
