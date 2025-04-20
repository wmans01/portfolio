import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { motion } from "framer-motion";
import "../styles/Projects.css";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const softwareSphereRef = useRef<THREE.Mesh | null>(null);
  const hardwareSphereRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [hoveredSphere, setHoveredSphere] = useState<
    "software" | "hardware" | null
  >(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const initScene = () => {
    if (!containerRef.current) return;

    // Clean up existing scene if it exists
    if (rendererRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(8, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create techy textures
    const createWhiteTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");

      if (context) {
        // Base color with gradient
        const gradient = context.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#ffffff");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);

        // Draw swirl patterns
        context.strokeStyle = "#000000";
        context.globalAlpha = 1.0;
        context.lineCap = "round";

        for (let i = 0; i < 12; i++) {
          const centerX = Math.random() * 512;
          const centerY = Math.random() * 512;
          const radius = Math.random() * 150 + 100;
          const startAngle = Math.random() * Math.PI * 2;
          const endAngle = startAngle + Math.PI * 2;

          // Draw main swirl
          context.beginPath();
          context.arc(centerX, centerY, radius, startAngle, endAngle);
          context.lineWidth = Math.random() * 20 + 4;
          context.stroke();

          // Add secondary swirl
          context.beginPath();
          context.arc(centerX, centerY, radius * 0.95, startAngle, endAngle);
          context.lineWidth = Math.random() * 15 + 4;
          context.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture;
      }
    };

    const createBlackTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");

      if (context) {
        // Pure black background
        context.fillStyle = "#000000";
        context.fillRect(0, 0, 512, 512);

        // Draw white swirls
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        context.lineCap = "round";
        context.globalAlpha = 1.0;

        for (let i = 0; i < 8; i++) {
          const centerX = Math.random() * 512;
          const centerY = Math.random() * 512;
          const radius = Math.random() * 150 + 100;

          // Main swirl
          context.beginPath();
          context.arc(centerX, centerY, radius, 0, Math.PI * 2);
          context.stroke();

          // Secondary swirl
          context.beginPath();
          context.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
          context.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture;
      }
    };

    // Create starfield background
    const createStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      const starCount = 10000;
      const positions = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;
        sizes[i] = Math.random() * 2;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const stars = new THREE.Points(starGeometry, starMaterial);
      return stars;
    };

    // Add starfield to scene
    const stars = createStarfield();
    scene.add(stars);

    // Calculate responsive sizes based on screen width
    const getResponsiveSizes = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const baseSize = Math.min(width * 0.08, 1.5);
      const orbitRadius = Math.min(width * 0.25, 4);
      const verticalOffset = height * 0.01 - 100; // Subtract 30px to move scene higher
      return { baseSize, orbitRadius, verticalOffset };
    };

    const { baseSize } = getResponsiveSizes();

    // Create spheres with responsive size
    const softwareGeometry = new THREE.SphereGeometry(baseSize, 64, 64);
    const hardwareGeometry = new THREE.SphereGeometry(baseSize, 64, 64);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add additional rim light for the blue sphere
    const rimLight = new THREE.DirectionalLight(0x6666ff, 0.5);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // Create materials
    const softwareMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.8,
      transmission: 0.0,
      thickness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      map: createWhiteTexture(),
      side: THREE.FrontSide,
      envMapIntensity: 0.0,
      reflectivity: 0.0,
      specularIntensity: 0.0,
    });

    const hardwareMaterial = new THREE.MeshBasicMaterial({
      map: createBlackTexture(),
      transparent: false,
      alphaTest: 0.5,
    });

    // Store texture reference for animation
    const softwareTexture = softwareMaterial.map;
    const hardwareTexture = hardwareMaterial.map;

    // Create the spheres and add them to the scene
    const softwareSphere = new THREE.Mesh(softwareGeometry, softwareMaterial);
    const hardwareSphere = new THREE.Mesh(hardwareGeometry, hardwareMaterial);

    // Set names for debugging
    softwareSphere.name = "software";
    hardwareSphere.name = "hardware";

    softwareSphereRef.current = softwareSphere;
    hardwareSphereRef.current = hardwareSphere;

    scene.add(softwareSphere);
    scene.add(hardwareSphere);

    // Animation
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      time += 0.01;

      if (softwareSphereRef.current && hardwareSphereRef.current) {
        const { orbitRadius } = getResponsiveSizes();

        // Update sphere positions with an additional -2 units in Y to move them up
        softwareSphereRef.current.position.x = Math.cos(-time) * orbitRadius;
        softwareSphereRef.current.position.z = Math.sin(-time) * orbitRadius;
        softwareSphereRef.current.position.y = 0; // Move spheres higher up
        softwareSphereRef.current.rotation.x += 0.01;
        softwareSphereRef.current.rotation.y += 0.01;

        hardwareSphereRef.current.position.x =
          Math.cos(-time + Math.PI) * orbitRadius;
        hardwareSphereRef.current.position.z =
          Math.sin(-time + Math.PI) * orbitRadius;
        hardwareSphereRef.current.position.y = 0; // Move spheres higher up
        hardwareSphereRef.current.rotation.x += 0.01;
        hardwareSphereRef.current.rotation.y += 0.01;

        // Animate both sphere textures
        if (softwareTexture) {
          const time = Date.now() * 0.0001;
          softwareTexture.offset.x = Math.sin(time) * 0.2;
          softwareTexture.offset.y = Math.cos(time) * 0.2;
        }
        if (hardwareTexture) {
          const time = Date.now() * 0.0001;
          hardwareTexture.offset.x = Math.sin(time) * 0.2;
          hardwareTexture.offset.y = Math.cos(time) * 0.2;
        }

        // Twinkle stars
        if (stars.geometry.attributes.size) {
          const sizes = stars.geometry.attributes.size.array as Float32Array;
          for (let i = 0; i < sizes.length; i++) {
            sizes[i] = Math.random() * 2;
          }
          stars.geometry.attributes.size.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Update handleResize
    const handleResize = () => {
      const { baseSize } = getResponsiveSizes();

      if (softwareSphereRef.current && hardwareSphereRef.current) {
        softwareSphereRef.current.scale.setScalar(baseSize);
        hardwareSphereRef.current.scale.setScalar(baseSize);
      }

      if (cameraRef.current && rendererRef.current) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };

    handleResize();
  };

  const handleMouseMove = (event: MouseEvent) => {
    console.log("Mouse move event triggered");

    // Get the container's bounding rect
    const containerBounds = containerRef.current?.getBoundingClientRect();
    if (!containerBounds) return;

    // Calculate mouse position relative to the container
    const x = event.clientX - containerBounds.left;
    const y = event.clientY - containerBounds.top;

    // Update mouse position for card placement
    setMousePosition({ x: event.clientX, y: event.clientY });

    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (x / containerBounds.width) * 2 - 1;
    mouse.y = -(y / containerBounds.height) * 2 + 1;

    console.log("Normalized mouse coordinates:", { x: mouse.x, y: mouse.y });

    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !softwareSphereRef.current ||
      !hardwareSphereRef.current
    ) {
      console.log("Missing required refs:", {
        scene: !!sceneRef.current,
        camera: !!cameraRef.current,
        software: !!softwareSphereRef.current,
        hardware: !!hardwareSphereRef.current,
      });
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const objectsToTest = [
      softwareSphereRef.current,
      hardwareSphereRef.current,
    ];
    console.log(
      "Testing intersection with objects:",
      objectsToTest.map((obj) => obj.name)
    );

    const intersects = raycaster.intersectObjects(objectsToTest);
    console.log("Intersections found:", intersects.length);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      console.log("Intersected object:", hoveredObject.name);

      if (hoveredObject === softwareSphereRef.current) {
        console.log("Setting hover state to software");
        setHoveredSphere("software");
        document.body.style.cursor = "pointer";
      } else if (hoveredObject === hardwareSphereRef.current) {
        console.log("Setting hover state to hardware");
        setHoveredSphere("hardware");
        document.body.style.cursor = "pointer";
      }
    } else {
      setHoveredSphere(null);
      document.body.style.cursor = "default";
    }
  };

  const handleClick = (event: MouseEvent) => {
    const containerBounds = containerRef.current?.getBoundingClientRect();
    if (!containerBounds) return;

    const x = event.clientX - containerBounds.left;
    const y = event.clientY - containerBounds.top;

    const mouse = new THREE.Vector2();
    mouse.x = (x / containerBounds.width) * 2 - 1;
    mouse.y = -(y / containerBounds.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current!);

    const intersects = raycaster.intersectObjects([
      softwareSphereRef.current!,
      hardwareSphereRef.current!,
    ]);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject === softwareSphereRef.current) {
        navigate("/projects/software");
      } else if (clickedObject === hardwareSphereRef.current) {
        navigate("/projects/hardware");
      }
    }
  };

  const handleResize = () => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current)
      return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (!isMobile) {
        handleResize();
      }
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      initScene();
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="mobile-projects-container">
        <motion.div
          className="mobile-button hardware"
          onClick={() => navigate("/projects/hardware")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Hardware</h2>
          <p>Explore my hardware projects</p>
        </motion.div>
        <motion.div
          className="mobile-button software"
          onClick={() => navigate("/projects/software")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="softwareText">Software</h2>
          <p>Explore my software projects</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Three.js container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Directions Panel */}
      <div
        style={{
          position: "fixed",
          left: "2rem",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid #00b0ff",
          borderRadius: "8px",
          padding: "1.5rem",
          color: "white",
          zIndex: 50,
          maxWidth: "280px",
          fontFamily: '"Space Mono", monospace',
          boxShadow: "0 4px 20px rgba(0, 176, 255, 0.2)",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              color: "#00b0ff",
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: "0.05em",
            }}
          >
            Explore Projects
          </h3>
          <div
            style={{
              height: "1px",
              width: "100%",
              background: "linear-gradient(90deg, #00b0ff, transparent)",
              marginBottom: "1rem",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
              opacity: 0.9,
              marginBottom: "0.75rem",
            }}
          >
            Hover over the orbiting spheres to discover different project
            categories.
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
              opacity: 0.9,
            }}
          >
            Click to view the collection of projects in each category.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            opacity: 0.7,
            fontSize: "0.8rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: "16px", height: "16px" }}
          >
            <path d="M13 7.5a1 1 0 11-2 0 1 1 0 012 0zm-3 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.25h.75a.75.75 0 010 1.5h-3a.75.75 0 010-1.5h.75V12h-.75a.75.75 0 01-.75-.75z" />
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM3.5 12a8.5 8.5 0 1117 0 8.5 8.5 0 01-17 0z"
            />
          </svg>
          <span>Use mouse to interact</span>
        </div>
      </div>

      {/* Hover Card */}
      {hoveredSphere && (
        <div
          className="hover-card"
          style={{
            position: "fixed",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: "translate(-50%, -150%)",
            zIndex: 9999,
            pointerEvents: "none",
            width: "240px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid #00b0ff",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 20px rgba(0, 176, 255, 0.2)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#00b0ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {hoveredSphere === "software" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "28px", height: "28px" }}
                >
                  <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm8 10h6v2h-6v-2zm-3.333-3L5.838 9.172l1.415-1.415L11.495 12l-4.242 4.243-1.415-1.415L8.667 12z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "28px", height: "28px" }}
                >
                  <path d="M2 5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 0v14h16V5H4zm13 2h2v2h-2V7zM9 7h4v2H9V7zM5 7h2v2H5V7zm4 4h4v2H9v-2zm-4 0h2v2H5v-2zm12 0h2v2h-2v-2zm-8 4h4v2H9v-2zm-4 0h2v2H5v-2zm12 0h2v2h-2v-2z" />
                </svg>
              )}
            </div>
            <h3
              style={{
                color: "#00b0ff",
                fontSize: "20px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {hoveredSphere === "software" ? "Software" : "Hardware"}
            </h3>
            <div
              style={{
                height: "1px",
                width: "100%",
                background:
                  "linear-gradient(90deg, transparent, #00b0ff, transparent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
