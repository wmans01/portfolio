import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create stars
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "#1a1e28";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      className="unclickable"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          top: "calc(0% - 40px)",
          left: "35%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "var(--off-white)",
          textAlign: "center",
          padding: "0rem",
        }}
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            fontSize: "8rem",
            margin: 0,
            color: "var(--accent-blue)",
            textShadow: "0 0 20px rgba(0, 176, 255, 0.5)",
          }}
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{
            fontSize: "2rem",
            margin: "1rem 0",
            marginTop: "0rem",
            color: "var(--off-white)",
            fontWeight: "bold",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Lost in Space
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={{
            fontSize: "1.2rem",
            maxWidth: "700px",
            marginTop: "0rem",
            marginBottom: "1rem",
            color: "var(--secondary-gray)",
          }}
        >
          The page you're looking for seems to have drifted off into the void.
          <br />
          Let's get you back to safety.
        </motion.p>
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="return-button"
          whileHover="hover"
          whileTap="tap"
          variants={{
            hover: {
              scale: 1.1,
              y: -2,
              boxShadow: "0 0 30px rgba(0, 176, 255, 0.8)",
              backgroundColor: "rgba(0, 176, 255, 0.9)",
              textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            },
            tap: {
              scale: 0.95,
              y: 1,
              boxShadow: "0 0 20px rgba(0, 176, 255, 0.6)",
            },
          }}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            backgroundColor: "var(--accent-blue)",
            color: "var(--primary-dark)",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "0 0 10px rgba(0, 176, 255, 0.3)",
            border: "none",
            outline: "none",
            cursor: "pointer",
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
          }}
        >
          Return to Earth
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
