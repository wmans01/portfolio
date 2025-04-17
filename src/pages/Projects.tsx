import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      name: "Hardware",
      description: "Physical projects and robotics",
      path: "/projects/hardware",
      icon: "⚙️",
    },
    {
      name: "Software",
      description: "Applications and development",
      path: "/projects/software",
      icon: "💻",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] opacity-5"
          style={{
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Project Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => navigate(category.path)}
            >
              <div
                className={`
                  relative overflow-hidden rounded-xl p-8
                  transition-all duration-300 ease-out
                  ${
                    hoveredCategory === category.name
                      ? "bg-accent-blue bg-opacity-5"
                      : "bg-[#2a2e38]"
                  }
                `}
                style={{
                  boxShadow:
                    hoveredCategory === category.name
                      ? "0 8px 30px rgba(0, 176, 255, 0.1)"
                      : "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h2
                      className={`
                        text-2xl font-bold transition-colors duration-300
                        ${
                          hoveredCategory === category.name
                            ? "text-accent-blue"
                            : "text-gray-200"
                        }
                      `}
                    >
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
