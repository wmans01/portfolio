import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh: THREE.Mesh;
  radius: number;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
}

const PARTICLE_COUNT = 60;
const PARTICLE_SPREAD = 8;
const BASE_RADIUS = 2.4;
const MIN_SEPARATION = 0.4;
const SEPARATION_FORCE = 1;
const CENTER_FORCE = 0.001;
const ROTATION_SENSITIVITY = 0.03;
const ROTATION_INTERPOLATION = 0.15;
const AUTO_ROTATION_SPEED = 0.0025;
const VELOCITY_SMOOTHING = 0.98;
const SCATTER_FORCE_MIN = 40.0;
const SCATTER_FORCE_MAX = 60.0;
const SCATTER_DIRECTION_VARIANCE = 1.2;
const MIN_SCATTER_MULTIPLIER = 1.0;
const SCATTER_GRAVITY_SCALE = 1.0;
const CURSOR_LIGHT_INTENSITY = 2.0;
const CURSOR_LIGHT_DISTANCE = 15;
const MAX_SCATTER_FORCE = 80.0;

interface ControlPanelProps {
  particleCount: number;
  centerForce: number;
  onParticleCountChange: (value: number) => void;
  onCenterForceChange: (value: number) => void;
  onScatter: () => void;
}

function ControlPanel({
  particleCount,
  centerForce,
  onParticleCountChange,
  onCenterForceChange,
  onScatter,
}: ControlPanelProps) {
  const [tempParticleCount, setTempParticleCount] = useState(particleCount);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTempParticleCount(particleCount);
  }, [particleCount]);

  return (
    <>
      <style>
        {`
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 1px;
            height: 16px;
            background: ${
              isHovered
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(255, 255, 255, 0.2)"
            };
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .custom-slider::-moz-range-thumb {
            width: 1px;
            height: 16px;
            background: ${
              isHovered
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(255, 255, 255, 0.2)"
            };
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
          }
          .custom-slider {
            padding: 8px 0;
            margin: -8px 0;
          }
        `}
      </style>
      <div
        className="control-panel"
        style={{
          position: "fixed",
          top: "40%",
          right: 20,
          padding: "12px",
          display: window.innerWidth < 600 && !isHovered ? "none" : "block", // Hide on phone screens only when not hovered
          color: isHovered
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(255, 255, 255, 0.3)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ marginBottom: "12px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "11px",
              fontWeight: 400,
              color: isHovered
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(255, 255, 255, 0.2)",
              letterSpacing: "0.3px",
              transition: "color 0.3s ease",
            }}
          >
            Particles: {tempParticleCount}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={tempParticleCount}
            onChange={(e) => setTempParticleCount(Number(e.target.value))}
            onMouseDown={() => {}}
            onMouseUp={() => {
              onParticleCountChange(tempParticleCount);
            }}
            style={{
              width: "160px",
              height: "1px",
              background: isHovered
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
              outline: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            className="custom-slider"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "11px",
              fontWeight: 400,
              color: isHovered
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(255, 255, 255, 0.2)",
              letterSpacing: "0.3px",
              transition: "color 0.3s ease",
            }}
          >
            Gravity: {centerForce.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={centerForce}
            onChange={(e) => onCenterForceChange(Number(e.target.value))}
            onMouseDown={() => {}}
            onMouseUp={() => {}}
            style={{
              width: "160px",
              height: "1px",
              background: isHovered
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
              outline: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            className="custom-slider"
          />
        </div>
        <button
          onClick={onScatter}
          style={{
            padding: "6px 12px",
            backgroundColor: "transparent",
            color: isHovered
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(255, 255, 255, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          Scatter (Space)
        </button>
      </div>
    </>
  );
}

function CursorLight() {
  const { pointer, viewport } = useThree();
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (light.current) {
      // Convert mouse position to world coordinates
      light.current.position.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        5 // Keep light slightly in front of spheres
      );
    }
  });

  return (
    <pointLight
      ref={light}
      color="#ffffff"
      intensity={CURSOR_LIGHT_INTENSITY}
      distance={CURSOR_LIGHT_DISTANCE}
      decay={2}
    />
  );
}

interface ParticleSystemProps {
  centerForce: number;
}
const ParticleSystem = forwardRef<any, ParticleSystemProps>(
  ({ centerForce }, ref) => {
    const { scene, viewport } = useThree();
    const particles = useRef<Particle[]>([]);
    const mousePos = useRef(new THREE.Vector3());
    const prevMousePos = useRef(new THREE.Vector3());
    const isDragging = useRef(false);
    const groupRef = useRef<THREE.Group>(null);
    const lastRotation = useRef(new THREE.Vector2(0, 0));
    const targetRotation = useRef(new THREE.Vector2(0, 0));
    const isScattering = useRef(false);
    const scatterStartTime = useRef(0);
    const isInteracting = useRef(false);

    // Expose handleScatter through ref
    useImperativeHandle(ref, () => ({
      handleScatter: () => {
        isScattering.current = true;
        scatterStartTime.current = Date.now();

        // Calculate scatter force multiplier based on current gravity with a minimum value
        const gravityRatio = centerForce / CENTER_FORCE;
        const gravityMultiplier = Math.max(
          MIN_SCATTER_MULTIPLIER,
          gravityRatio * SCATTER_GRAVITY_SCALE
        );

        // Apply initial scatter forces
        particles.current.forEach((particle) => {
          // Base scatter force scaled by gravity
          const baseForce =
            SCATTER_FORCE_MIN +
            Math.random() * (SCATTER_FORCE_MAX - SCATTER_FORCE_MIN);
          let scaledForce = baseForce * gravityMultiplier;
          if (scaledForce > MAX_SCATTER_FORCE) scaledForce = MAX_SCATTER_FORCE;

          // Add some upward bias to the scatter
          const randomDirection = new THREE.Vector3(
            (Math.random() - 0.5) * SCATTER_DIRECTION_VARIANCE * 2.5,
            Math.random() * SCATTER_DIRECTION_VARIANCE * 1.5,
            (Math.random() - 0.5) * SCATTER_DIRECTION_VARIANCE * 2.5
          );

          const baseDirection = particle.position.clone().normalize();
          const scatterDirection = baseDirection
            .add(randomDirection)
            .normalize();

          // Apply the scaled force and override current velocity
          particle.velocity.copy(scatterDirection.multiplyScalar(scaledForce));
        });
      },
      setParticleCount: (count: number) => {
        // Remove existing particles
        if (groupRef.current) {
          particles.current.forEach((particle) => {
            groupRef.current?.remove(particle.mesh);
          });
          particles.current = [];
        }
        // Create new particles
        initializeParticles(count);
      },
    }));

    // Initialize particles function
    const initializeParticles = (count: number) => {
      if (!groupRef.current) return;

      // Remove old particles
      particles.current.forEach((particle) => {
        groupRef.current?.remove(particle.mesh);
      });
      particles.current = [];

      for (let i = 0; i < count; i++) {
        // Vary size less: 0.5x to 1.5x base
        const sizeVariation = 0.5 + Math.random() * 1.0;
        const radius = BASE_RADIUS * sizeVariation;

        // Randomly assign white, black, or blue color
        const colorRand = Math.random();
        let color;
        if (colorRand < 0.33) color = 0xffffff; // white
        else if (colorRand < 0.66) color = 0x000000; // black
        else color = 0x00b0ff; // blue (was red)

        const material = new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.1,
          roughness: 0.2,
          transmission: 0.92,
          thickness: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.2,
          ior: 1.5,
          reflectivity: 0.3,
          emissive: color,
          emissiveIntensity: 0.05,
          transparent: true,
          opacity: 0.9,
        });

        const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
        const mesh = new THREE.Mesh(sphereGeometry, material);

        // Fibonacci sphere distribution for more uniform spacing
        const phi = Math.acos(-1 + (2 * i + 1) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const distanceFromCenter =
          PARTICLE_SPREAD * (0.8 + Math.random() * 0.2);
        const position = new THREE.Vector3(
          distanceFromCenter * Math.cos(theta) * Math.sin(phi),
          distanceFromCenter * Math.sin(theta) * Math.sin(phi),
          distanceFromCenter * Math.cos(phi)
        );

        mesh.position.copy(position);
        groupRef.current.add(mesh);

        particles.current.push({
          position,
          velocity: new THREE.Vector3(),
          mesh,
          radius: radius,
          rotationSpeed: { x: 0, y: 0, z: 0 },
        });
      }
    };

    // Initial setup
    useEffect(() => {
      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);
      initializeParticles(PARTICLE_COUNT);

      return () => {
        particles.current.forEach((particle) => {
          group.remove(particle.mesh);
        });
        scene.remove(group);
      };
    }, [scene]);

    // Handle mouse events
    useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
        // Check if we're clicking on the control panel
        const controlPanel = document.querySelector(".control-panel");
        if (controlPanel && controlPanel.contains(e.target as Node)) {
          isInteracting.current = true;
          return;
        }

        isDragging.current = true;
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        prevMousePos.current.set(
          (x * viewport.width) / 2,
          (y * viewport.height) / 2,
          0
        );
        mousePos.current.copy(prevMousePos.current);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        isInteracting.current = false;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || isInteracting.current) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mousePos.current.set(
          (x * viewport.width) / 2,
          (y * viewport.height) / 2,
          0
        );
      };

      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [viewport.width, viewport.height]);

    // Animation loop
    useFrame(() => {
      if (!groupRef.current) return;

      // Auto-rotation when not dragging
      if (!isDragging.current && !isInteracting.current) {
        targetRotation.current.y += AUTO_ROTATION_SPEED;
      }

      // Horizontal-only rotation handling
      if (isDragging.current && !isInteracting.current) {
        const mouseDelta = mousePos.current.clone().sub(prevMousePos.current);
        targetRotation.current.y += mouseDelta.x * ROTATION_SENSITIVITY;
      }

      // Smoother interpolation of rotation
      lastRotation.current.y +=
        (targetRotation.current.y - lastRotation.current.y) *
        ROTATION_INTERPOLATION;

      // Apply smoothed rotation
      groupRef.current.rotation.y = lastRotation.current.y;

      // Calculate separation forces
      const separationForces = new Map<THREE.Mesh, THREE.Vector3>();
      particles.current.forEach((particle) => {
        separationForces.set(particle.mesh, new THREE.Vector3());
      });

      // Calculate particle separations
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const diff = p1.position.clone().sub(p2.position);
          const distance = diff.length();
          const minDist = p1.radius + p2.radius + MIN_SEPARATION;

          if (distance < minDist) {
            const force = diff
              .normalize()
              .multiplyScalar(
                SEPARATION_FORCE * Math.pow(1 - distance / minDist, 2)
              );

            const p1Force =
              separationForces.get(p1.mesh) || new THREE.Vector3();
            const p2Force =
              separationForces.get(p2.mesh) || new THREE.Vector3();

            p1Force.add(force);
            p2Force.sub(force);

            separationForces.set(p1.mesh, p1Force);
            separationForces.set(p2.mesh, p2Force);
          }
        }
      }

      // Update particles
      particles.current.forEach((particle) => {
        // Check scatter state
        if (isScattering.current) {
          const timeSinceScatter =
            (Date.now() - scatterStartTime.current) / 1000;
          if (timeSinceScatter > 1.5) {
            isScattering.current = false;
          }
        }

        // Get separation force
        const separationForce =
          separationForces.get(particle.mesh) || new THREE.Vector3();

        // Calculate center force
        const effectiveCenterForce = centerForce * CENTER_FORCE;
        const toCenter = particle.position
          .clone()
          .multiplyScalar(-effectiveCenterForce);

        // Combine forces
        const totalForce = new THREE.Vector3()
          .add(separationForce)
          .add(toCenter);

        // Apply forces to velocity
        particle.velocity.add(totalForce);
        particle.velocity.multiplyScalar(VELOCITY_SMOOTHING);

        // Limit maximum speed
        const maxSpeed = isScattering.current ? 2.5 : 0.5;
        const currentSpeed = particle.velocity.length();
        if (currentSpeed > maxSpeed) {
          particle.velocity.multiplyScalar(maxSpeed / currentSpeed);
        }

        // Update position
        particle.position.add(particle.velocity);

        // Update mesh position
        particle.mesh.position.copy(particle.position);
      });

      // Store previous mouse position for next frame
      prevMousePos.current.copy(mousePos.current);
    });

    return null;
  }
);

ParticleSystem.displayName = "ParticleSystem";

interface BackgroundProps {
  show3D: boolean;
}

const Background: React.FC<BackgroundProps> = ({ show3D }) => {
  const [particleCount, setParticleCount] = useState(PARTICLE_COUNT);
  const [centerForce, setCenterForce] = useState(1);
  const particleSystemRef = useRef<any>(null);
  const [currentText, setCurrentText] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const texts = [
    "Engineer",
    "Entrepreneur",
    "Game Developer",
    "Procrastinator",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && particleSystemRef.current) {
        e.preventDefault();
        particleSystemRef.current.handleScatter();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleParticleCountChange = (count: number) => {
    setParticleCount(count);
    if (particleSystemRef.current) {
      particleSystemRef.current.setParticleCount(count);
    }
  };

  const handleCenterForceChange = (force: number) => {
    setCenterForce(force);
    if (particleSystemRef.current) {
      particleSystemRef.current.setCenterForce(force);
    }
  };

  return (
    <>
      {show3D && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas camera={{ position: [0, 0, 30], fov: 75 }} shadows>
            <color attach="background" args={["#1a1e28"]} />
            <ambientLight intensity={0.5} />
            <pointLight
              position={[10, 10, 10]}
              intensity={0.4}
              color="#ffffff"
            />
            <pointLight
              position={[-10, -10, 10]}
              intensity={0.4}
              color="#ffffff"
            />
            <CursorLight />
            <ParticleSystem centerForce={centerForce} ref={particleSystemRef} />
          </Canvas>
        </div>
      )}
      {show3D && (
        <div
          style={{
            position: "fixed",
            top: "40%",
            right: 20,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <ControlPanel
            particleCount={particleCount}
            centerForce={centerForce}
            onParticleCountChange={handleParticleCountChange}
            onCenterForceChange={handleCenterForceChange}
            onScatter={() => particleSystemRef.current?.handleScatter()}
          />
          <div
            className="landing-container"
            style={
              {
                "--mouse-x": `${mousePosition.x}px`,
                "--mouse-y": `${mousePosition.y}px`,
              } as React.CSSProperties
            }
          >
            <div className="name-title">
              <h1 className="name" style={{ color: "var(--off-white)" }}>
                Jeremy Wang
              </h1>
              <div className="title-container">
                {texts.map((text, index) => (
                  <span
                    key={text}
                    className={`title ${index === currentText ? "active" : ""}`}
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
            <div className="quote-container">
              <p className="quote">
                "Perfection is not attainable, but if we chase perfection we can
                catch excellence."
              </p>
              <p className="quote-author">- Vince Lombardi</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Background;
