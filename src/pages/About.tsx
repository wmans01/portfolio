import React from "react";

const About: React.FC = () => {
  return (
    <div
      className="unclickable"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#1a1e28",
        cursor: "auto",
      }}
    >
      <img
        src="/pfp.jpg"
        alt="Profile"
        loading="lazy"
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          objectFit: "cover",
          marginTop: window.innerWidth < 768 ? 48 : 24, // Double margin on mobile screens
          marginBottom: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      />
      <div
        style={{
          maxWidth: window.innerWidth < 768 ? 300 : 580,
          textAlign: "left",
          fontFamily: "'Roboto Mono', monospace",
          color: "var(--off-white)",
          fontSize: 16,
          // fontWeight: "bold",
          lineHeight: 1.9,
          marginBottom: 48,
        }}
      >
        <p style={{ marginBottom: 18 }}>
          Based in Massachusetts, I'm a high school junior and the team captain
          for a nationally recognized VEX robotics team. I've built robots and developed AI models for traffic optimization, CubeSATs for
          power outage detection, and even a horror-themed puzzle box inspired
          by my favorite books.
        </p>
        <p style={{ marginBottom: 18 }}>
          I love building things that matter: from a gutter-cleaning robot to a
          budget CNC milling machine. I also founded Numberosity Academy, a
          nonprofit teaching STEM to underserved communities, raising over $30K
          for outreach programs.
        </p>
        <p style={{ marginBottom: 0 }}>
          Catch me somewhere between building robots and procrastinating on
          YouTube. Or better yet, find me using CAD at 2AM.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          <a
            href="mailto:jeremywang@gmail.com"
            aria-label="Email"
            style={{
              color: "var(--off-white)",
              fontSize: 32,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            className="hover:scale-120"
          >
            <i className="fas fa-envelope"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/jeremy-wang-006686312/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{
              color: "var(--off-white)",
              fontSize: 32,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            className="hover:scale-120"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/wmans01"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              color: "var(--off-white)",
              fontSize: 32,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            className="hover:scale-120"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
