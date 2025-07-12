import React, { useState, useEffect } from "react";

const Footer: React.FC = () => {
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show glow
      if (scrollTop + windowHeight >= documentHeight - 10) {
        setShowGlow(true);

        setTimeout(() => {
          window.scrollTo({
            top: documentHeight - windowHeight - 50,
            behavior: "smooth",
          });
          setShowGlow(false);
        }, 2000);
      } else {
        setShowGlow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`w-full py-12 bg-[#1a1e28] text-center text-gray-400 mt-8 border-t border-[#2a2f3e] transition-all duration-300 ${
        showGlow ? "shadow-[0_0_30px_rgba(0,176,255,0.3)]" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm">
        <span>Website by Jeremy Wang</span>
        <a
          href="https://github.com/wmans01"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00b0ff] hover:underline"
        >
          Website Repository
        </a>
        <a
          href="mailto:jeremywang08@gmail.com"
          className="text-[#00b0ff] hover:underline"
        >
          jeremywang08@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
