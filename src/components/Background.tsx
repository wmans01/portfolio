import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
const CURSOR_RADIUS = 3;
const CURSOR_FORCE = 15;
const MIN_SEPARATION = 0.2; // Minimum distance between particles
const SEPARATION_FORCE = 0.8; // Force to maintain separation
const CENTER_FORCE = 0.04; // Reduced center attraction
const ROTATION_SENSITIVITY = 0.03; // Adjusted for horizontal-only rotation
const ROTATION_INTERPOLATION = 0.15;
const VELOCITY_SMOOTHING = 0.95; // Added back for particle physics
const CURSOR_LIGHT_INTENSITY = 2.0;
const CURSOR_LIGHT_DISTANCE = 15;

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
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
          top: 20,
          right: 20,
          padding: "12px",
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
        <h3
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: isHovered
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(255, 255, 255, 0.3)",
            textTransform: "uppercase",
            transition: "color 0.3s ease",
          }}
        >
          System Controls
        </h3>
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
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => {
              setIsInteracting(false);
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
            Gravity: {(centerForce * 10).toFixed(1)}x
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={centerForce}
            onChange={(e) => onCenterForceChange(Number(e.target.value))}
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => setIsInteracting(false)}
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
          Scatter
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

const ParticleSystem = forwardRef((props, ref) => {
  const { scene, pointer, viewport } = useThree();
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef(new THREE.Vector3());
  const prevMousePos = useRef(new THREE.Vector3());
  const isDragging = useRef(false);
  const rotationVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const groupRef = useRef<THREE.Group>(null);
  const lastRotation = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const isScattering = useRef(false);
  const scatterTime = useRef(0);
  const isInteracting = useRef(false);
  const currentCenterForce = useRef(CENTER_FORCE);

  // Expose handleScatter through ref
  useImperativeHandle(ref, () => ({
    handleScatter: () => {
      isScattering.current = true;
      scatterTime.current = 0;
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
    setCenterForce: (force: number) => {
      currentCenterForce.current = force;
    },
  }));

  // Initialize particles function
  const initializeParticles = (count: number) => {
    if (!groupRef.current) return;

    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.92,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
      ior: 1.5,
      reflectivity: 0.3,
      emissive: 0xffffff,
      emissiveIntensity: 0.05,
      transparent: true,
      opacity: 0.9,
    });

    // Create particles with better initial distribution
    particles.current = Array.from({ length: count }, (_, index) => {
      const sizeVariation = 0.8 + Math.random() * 0.8;
      const radius = BASE_RADIUS * sizeVariation;

      const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const material = baseMaterial.clone();
      const mesh = new THREE.Mesh(sphereGeometry, material);

      // Fibonacci sphere distribution for more uniform spacing
      const phi = Math.acos(-1 + (2 * index + 1) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      // More uniform initial distribution
      const distanceFromCenter = PARTICLE_SPREAD * (0.8 + Math.random() * 0.2);
      const position = new THREE.Vector3(
        distanceFromCenter * Math.cos(theta) * Math.sin(phi),
        distanceFromCenter * Math.sin(theta) * Math.sin(phi),
        distanceFromCenter * Math.cos(phi)
      );

      mesh.position.copy(position);
      groupRef.current?.add(mesh);

      return {
        position,
        velocity: new THREE.Vector3(),
        mesh,
        radius: radius,
        rotationSpeed: {
          x: 0,
          y: 0,
          z: 0,
        },
      };
    });
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
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle scattering effect
    if (isScattering.current) {
      scatterTime.current += delta;
      const scatterDuration = 1.5;
      const scatterProgress = Math.min(
        1,
        scatterTime.current / scatterDuration
      );

      if (scatterProgress >= 1) {
        isScattering.current = false;
      }

      // Apply stronger outward force during scatter
      particles.current.forEach((particle) => {
        const scatterForce = particle.position
          .clone()
          .normalize()
          .multiplyScalar(2.0 * (1 - scatterProgress));
        particle.velocity.add(scatterForce);
      });
    }

    // Horizontal-only rotation handling
    if (isDragging.current && !isInteracting.current) {
      const mouseDelta = mousePos.current.clone().sub(prevMousePos.current);

      // Only apply horizontal rotation
      targetRotation.current.y += mouseDelta.x * ROTATION_SENSITIVITY;
    }

    // Smoother interpolation of rotation
    lastRotation.current.y +=
      (targetRotation.current.y - lastRotation.current.y) *
      ROTATION_INTERPOLATION;

    // Apply smoothed rotation
    groupRef.current.rotation.y = lastRotation.current.y;

    // Calculate separation forces with temporal smoothing
    const separationForces = new Map<THREE.Mesh, THREE.Vector3>();
    particles.current.forEach((particle) => {
      separationForces.set(particle.mesh, new THREE.Vector3());
    });

    // Calculate separation with smoothing
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

          // Apply force with temporal smoothing
          const p1Force = separationForces.get(p1.mesh) || new THREE.Vector3();
          const p2Force = separationForces.get(p2.mesh) || new THREE.Vector3();

          p1Force.add(force);
          p2Force.sub(force);

          separationForces.set(p1.mesh, p1Force);
          separationForces.set(p2.mesh, p2Force);
        }
      }
    }

    // Update particles with convergence speed based on gravity
    particles.current.forEach((particle) => {
      // Get and apply smoothed separation force
      const separationForce =
        separationForces.get(particle.mesh) || new THREE.Vector3();
      particle.velocity.lerp(separationForce, 0.15);

      // Update center force with convergence speed based on gravity
      const toCenter = particle.position.clone().negate();
      const distToCenter = particle.position.length();
      const convergenceSpeed = currentCenterForce.current * 2.0; // Scale gravity value for convergence speed
      const centerAttractionForce = toCenter
        .normalize()
        .multiplyScalar(convergenceSpeed * (distToCenter / PARTICLE_SPREAD));

      particle.velocity.lerp(
        particle.velocity.clone().add(centerAttractionForce),
        0.3
      );

      // Reduced damping for more dynamic movement
      const speed = particle.velocity.length();
      const dynamicDamping = VELOCITY_SMOOTHING - Math.min(0.03, speed * 0.01); // Reduced from 0.05
      particle.velocity.multiplyScalar(dynamicDamping);

      // Increased max speed
      const maxSpeed = 0.4; // Increased from 0.2
      if (speed > maxSpeed) {
        particle.velocity.lerp(
          particle.velocity.clone().normalize().multiplyScalar(maxSpeed),
          0.15 // Increased from 0.1
        );
      }

      // Update position with less smoothing for more immediate response
      const nextPosition = particle.position.clone().add(particle.velocity);
      particle.position.lerp(nextPosition, 0.9); // Increased from 0.8

      // Stronger boundary control
      const maxDistance = PARTICLE_SPREAD * 1.2;
      const distanceFromCenter = particle.position.length();

      if (distanceFromCenter > maxDistance) {
        const overflow = distanceFromCenter - maxDistance;
        const pushBack = particle.position
          .clone()
          .normalize()
          .multiplyScalar(-overflow * 0.1); // Increased from 0.05
        particle.velocity.lerp(pushBack, 0.2); // Increased from 0.1
      }

      // Update mesh position with less smoothing
      particle.mesh.position.lerp(particle.position, 0.9); // Increased from 0.8
    });

    // Store previous mouse position for next frame
    prevMousePos.current.copy(mousePos.current);
  });

  return null;
});

ParticleSystem.displayName = "ParticleSystem";

function Background() {
  const [particleCount, setParticleCount] = useState(PARTICLE_COUNT);
  const [centerForce, setCenterForce] = useState(CENTER_FORCE);
  const particleSystemRef = useRef<any>(null);

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
      <ControlPanel
        particleCount={particleCount}
        centerForce={centerForce}
        onParticleCountChange={handleParticleCountChange}
        onCenterForceChange={handleCenterForceChange}
        onScatter={() => {
          if (particleSystemRef.current) {
            particleSystemRef.current.handleScatter();
          }
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: "grab",
        }}
      >
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }} shadows>
          <color attach="background" args={["#1a1e28"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
          <pointLight
            position={[-10, -10, 10]}
            intensity={0.4}
            color="#ffffff"
          />
          <CursorLight />
          <ParticleSystem ref={particleSystemRef} />
        </Canvas>
      </div>
    </>
  );
}

export default Background;
