import React from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  year: string;
  path: string;
}

const HardwareProjects: React.FC = () => {
  const navigate = useNavigate();

  const projects: Project[] = [
    {
      title: "VEX Robotics",
      description:
        "Lead designer for a nationally recognized VEX robotics team, developing autonomous systems and innovative mechanical solutions.",
      technologies: ["C++", "CAD", "Robotics", "Autonomous Systems"],
      year: "2023-2024",
      path: "/projects/hardware/vex-robotics",
    },
    {
      title: "Gutter-cleaning Robot",
      description:
        "Developed an autonomous robot for gutter maintenance, featuring advanced navigation and cleaning mechanisms.",
      technologies: [
        "Arduino",
        "Raspberry Pi",
        "Computer Vision",
        "Mechanical Design",
      ],
      year: "2023",
      path: "/projects/hardware/gutter-robot",
    },
    {
      title: "3D Printer Project",
      description:
        "Designed and built a high-performance 3D printer with advanced features and precision engineering.",
      technologies: [
        "3D Printing",
        "Mechanical Design",
        "Electronics",
        "Firmware",
      ],
      year: "2023",
      path: "/projects/hardware/3d-printer",
    },
  ];

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold mb-8 text-accent-blue">
        Hardware Projects
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="project-card bg-[#2a2e38] rounded-lg p-6 mb-6 hover:transform hover:scale-[1.02] transition-all cursor-pointer"
            onClick={() => navigate(project.path)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-accent-blue">
                {project.title}
              </h3>
              <span className="text-sm text-gray-400 font-mono">
                {project.year}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-[#1a1e28] rounded-full text-sm text-gray-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HardwareProjects;
