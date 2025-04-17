import React from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  type: string;
  year: string;
  path: string;
}

const SoftwareProjects: React.FC = () => {
  const navigate = useNavigate();

  const projects: Project[] = [
    {
      title: "Traffic Optimization AI",
      description:
        "Developed AI models for traffic optimization and prediction using machine learning techniques.",
      technologies: [
        "Python",
        "TensorFlow",
        "Machine Learning",
        "Data Analysis",
      ],
      type: "library",
      year: "2024",
      path: "/projects/software/traffic-ai",
    },
    {
      title: "CubeSAT Power Detection",
      description:
        "Software system for detecting power outages using satellite data and machine learning.",
      technologies: ["Python", "C++", "Machine Learning", "Embedded Systems"],
      type: "app",
      year: "2024",
      path: "/projects/software/cubesat",
    },
    {
      title: "Horror Puzzle Box",
      description:
        "Interactive horror-themed puzzle game inspired by House of Leaves, featuring unique mechanics.",
      technologies: ["Unity", "C#", "Game Design", "3D Modeling"],
      type: "game",
      year: "2023",
      path: "/projects/software/puzzle-box",
    },
  ];

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold mb-8 text-accent-blue">
        Software Projects
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
              <span className="px-2 py-1 bg-accent-blue text-primary-dark rounded-full text-sm font-mono">
                {project.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoftwareProjects;
