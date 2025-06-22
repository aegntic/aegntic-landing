'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, useTexture } from '@react-three/drei';
import { Physics, useBox } from '@react-three/cannon';
import type { Triplet } from '@react-three/cannon';
import type { Mesh, Material, Points } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';

// Digital rain particle system
const DigitalRain = () => {
  const count = 3000;
  const ref = useRef<Points>(null);

  // Create falling matrix-like particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  // Create a falling matrix symbols texture
  const symbolsMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#00ffff';
    context.font = '64px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Use matrix-like symbols
    const symbols = ['0', '1', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', '$', '#', '@'];
    context.fillText(symbols[Math.floor(Math.random() * symbols.length)], 64, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    // Rotate slowly
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;

    // Update particle positions
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= 0.05; // Fall down

      // Reset particle position when it goes too far down
      if (positions[i3 + 1] < -25) {
        positions[i3 + 1] = 25;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
          onUpdate={(self) => {
            const positions = self.array as Float32Array;
            particles.forEach(({ x, y, z }, i) => {
              const i3 = i * 3;
              positions[i3] = x;
              positions[i3 + 1] = y;
              positions[i3 + 2] = z;
            });
          }}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#00ffff"
        transparent
        opacity={0.6}
        alphaMap={symbolsMap}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

// Floating particle system
const FloatingParticles = () => {
  const count = 500;
  const particlesRef = useRef<Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      const speed = Math.random() * 0.02 + 0.01;
      const size = Math.random() * 0.3 + 0.1;
      temp.push({ x, y, z, speed, size });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create wave motion
      positions[i3 + 1] = particles[i].y + Math.sin(time * particles[i].speed + i) * 1.5;
      // Pulse sizes
      sizes[i] = particles[i].size * (1 + Math.sin(time * 0.3 + i) * 0.2);
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
          onUpdate={(self) => {
            const positions = self.array as Float32Array;
            particles.forEach(({ x, y, z }, i) => {
              const i3 = i * 3;
              positions[i3] = x;
              positions[i3 + 1] = y;
              positions[i3 + 2] = z;
            });
          }}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={new Float32Array(count)}
          itemSize={1}
          onUpdate={(self) => {
            const sizes = self.array as Float32Array;
            particles.forEach(({ size }, i) => {
              sizes[i] = size;
            });
          }}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#00ffff"
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// Animated camera movement
const CameraAnimation = ({ active, textRef }: { active: boolean; textRef: React.RefObject<THREE.Group> }) => {
  const { camera } = useThree();

  useFrame((state) => {
    if (!active) return;

    const time = state.clock.getElapsedTime() * 0.3;
    const radius = 13;

    // Circular camera movement
    camera.position.x = Math.sin(time) * radius;
    camera.position.z = Math.cos(time) * radius;
    camera.position.y = Math.sin(time * 0.5) * 2;

    // Always look at the center
    camera.lookAt(0, 0, 0);

    // Keep text static but track camera angle for letter flipping
    if (textRef.current) {
      textRef.current.rotation.y = 0;
      textRef.current.rotation.x = 0;
      textRef.current.rotation.z = 0;
    }
  });

  return null;
};

// Letter component that falls with physics
const Letter = ({ position, char }: { position: [number, number, number]; char: string }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 0.2],
  }));

  useEffect(() => {
    // Apply a random impulse when the letter starts falling
    const timeout = setTimeout(() => {
      const impulse: Triplet = [
        Math.random() * 5 - 2.5,
        Math.random() * -5,
        Math.random() * 5 - 2.5,
      ];
      const point: Triplet = [0, 0, 0];

      api.applyImpulse(impulse, point);
      api.angularVelocity.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [api]);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 0.2]} />
      <meshStandardMaterial color="#00ffff" emissive="#003333" emissiveIntensity={0.5} />
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
      >
        {char}
      </Text>
    </mesh>
  );
};

// Mouse cursor component
const MousePrompt = () => {
  const { viewport } = useThree();
  const mousePos = useRef<[number, number]>([0, 0]);
  const textRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mousePos.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useFrame(({ clock }) => {
    if (textRef.current && ringRef.current) {
      // Convert normalized coordinates to world space
      const x = mousePos.current[0] * viewport.width / 2;
      const y = mousePos.current[1] * viewport.height / 2;

      // Smoothly interpolate position
      textRef.current.position.x += (x - textRef.current.position.x) * 0.1;
      textRef.current.position.y += (y - textRef.current.position.y) * 0.1;

      // Ring follows the text
      ringRef.current.position.x = textRef.current.position.x;
      ringRef.current.position.y = textRef.current.position.y;

      // Pulse animation for the ring
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <>
      <mesh ref={textRef} position={[0, 0, 0]}>
        <Text
          fontSize={0.3}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        >
          click
        </Text>
      </mesh>
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
      </mesh>
    </>
  );
};

// Individual letter that flips based on camera angle
const FlippingLetter = ({ 
  char, 
  backChar, 
  position, 
  cameraAngle 
}: { 
  char: string; 
  backChar: string; 
  position: [number, number, number]; 
  cameraAngle: number;
}) => {
  const letterRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (letterRef.current) {
      // Use same timing as camera animation
      const time = state.clock.getElapsedTime() * 0.3;
      
      // Simple oscillation constrained to front-facing only
      const oscillation = Math.sin(time) * (Math.PI * 85 / 180); // 85 degrees max
      
      letterRef.current.rotation.y = oscillation;
    }
  });

  // Always show front characters since we're always facing camera
  const displayChar = char;
  
  // Get font size - smaller for .ai part but aligned to baseline
  const getFontSize = () => {
    const charIndex = position[0]; // Use position to determine which character
    if (charIndex >= 1.4) { // . a i positions
      return 1.125; // 3/4 of 1.5
    }
    return 1.5; // Normal size
  };
  
  // Adjust Y position to align baselines
  const getYOffset = () => {
    const charIndex = position[0];
    if (charIndex >= 1.4) { // . a i positions
      return -0.1; // Lower slightly to align baselines
    }
    return 0;
  };

  return (
    <group ref={letterRef} position={[position[0], position[1] + getYOffset(), position[2]]}>
      {/* Main white letter */}
      <Text
        fontSize={getFontSize()}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
      >
        {displayChar}
      </Text>
      
      {/* Silver wireframe overlay */}
      <Text
        position={[0, 0, 0.001]}
        fontSize={getFontSize()}
        color="#c0c0c0"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        material={new THREE.MeshBasicMaterial({
          color: "#c0c0c0",
          wireframe: true
        })}
      >
        {displayChar}
      </Text>
      
      {/* Depth layers */}
      {[1, 2, 3, 4, 5].map((layer) => (
        <group key={layer}>
          <Text
            position={[0, 0, -layer * 0.018]}
            fontSize={getFontSize()}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
            material={new THREE.MeshStandardMaterial({
              color: "#ffffff",
              opacity: 0.7,
              transparent: true
            })}
          >
            {displayChar}
          </Text>
          <Text
            position={[0, 0, -layer * 0.018 + 0.001]}
            fontSize={getFontSize()}
            color="#c0c0c0"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
            material={new THREE.MeshBasicMaterial({
              color: "#c0c0c0",
              wireframe: true,
              opacity: 0.7,
              transparent: true
            })}
          >
            {displayChar}
          </Text>
        </group>
      ))}
    </group>
  );
};

// Complete text component - treat as whole word
const FlippingText = ({ cameraAngle }: { cameraAngle: number }) => {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      // Make text look at camera but constrain to front-facing only
      const camera = state.camera;
      const textWorldPosition = new THREE.Vector3();
      textRef.current.getWorldPosition(textWorldPosition);
      
      // Calculate angle from text to camera
      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, textWorldPosition);
      direction.y = 0; // Only rotate around Y axis
      direction.normalize();
      
      let targetRotationY = Math.atan2(direction.x, direction.z);
      
      // Constrain to front-facing only (±89 degrees)
      const maxAngle = Math.PI * 89 / 180;
      
      // If camera would show the back, clamp to the edge
      if (targetRotationY > maxAngle) {
        targetRotationY = maxAngle;
      } else if (targetRotationY < -maxAngle) {
        targetRotationY = -maxAngle;
      }
      
      textRef.current.rotation.y = targetRotationY;
    }
  });

  return (
    <group ref={textRef} position={[0, 0, 4]}>
      {/* Main white text - complete word */}
      <Text
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        letterSpacing={0.05}
      >
        aegntic.ai
      </Text>
      
      {/* Silver wireframe overlay */}
      <Text
        position={[0, 0, 0.001]}
        fontSize={1.5}
        color="#c0c0c0"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        letterSpacing={0.05}
        material={new THREE.MeshBasicMaterial({
          color: "#c0c0c0",
          wireframe: true
        })}
      >
        aegntic.ai
      </Text>
      
      {/* Depth layers */}
      {[1, 2, 3, 4, 5].map((layer) => (
        <group key={layer}>
          <Text
            position={[0, 0, -layer * 0.018]}
            fontSize={1.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
            letterSpacing={0.05}
            material={new THREE.MeshStandardMaterial({
              color: "#ffffff",
              opacity: 0.7,
              transparent: true
            })}
          >
            aegntic.ai
          </Text>
          <Text
            position={[0, 0, -layer * 0.018 + 0.001]}
            fontSize={1.5}
            color="#c0c0c0"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
            letterSpacing={0.05}
            material={new THREE.MeshBasicMaterial({
              color: "#c0c0c0",
              wireframe: true,
              opacity: 0.7,
              transparent: true
            })}
          >
            aegntic.ai
          </Text>
        </group>
      ))}
    </group>
  );
};

// Background grid effect
const Grid = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      gridRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper
        args={[50, 50, "#001111", "#004444"]}
        position={[0, -10, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper
        args={[50, 50, "#001111", "#004444"]}
        position={[0, 10, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper
        args={[50, 50, "#001111", "#004444"]}
      />
    </group>
  );
};

// Scene component
const Scene = ({ onClick, crumbleStarted }: { onClick: () => void; crumbleStarted: boolean }) => {
  const word = "aegntic.ai";
  const spacing = 1.2;
  const startX = -(word.length * spacing) / 2 + spacing / 2;
  const [cameraActive, setCameraActive] = useState(true);
  const textRef = useRef<THREE.Group>(null);

  // Individual letter components that flip based on camera angle
  const [cameraAngle, setCameraAngle] = useState(0);
  
  useFrame((state) => {
    if (!crumbleStarted) {
      // Calculate camera angle relative to text
      const angle = Math.atan2(state.camera.position.x, state.camera.position.z);
      setCameraAngle(angle);
    }
  });

  useEffect(() => {
    if (crumbleStarted) {
      // Stop camera movement when crumbling starts
      setCameraActive(false);
    }
  }, [crumbleStarted]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={1} />

      <PerspectiveCamera makeDefault position={[0, 0, 13]} fov={50} />
      <CameraAnimation active={cameraActive} textRef={textRef} />

      <Grid />
      <DigitalRain />
      <FloatingParticles />

      {!crumbleStarted && (
        <>
          <group ref={textRef}>
            <FlippingText cameraAngle={cameraAngle} />
          </group>
          <MousePrompt />
          <mesh position={[0, 0, -1]} onClick={onClick}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial opacity={0} transparent />
          </mesh>
        </>
      )}

      {crumbleStarted && (
        <Physics gravity={[0, -9.8, 0]}>
          {word.split('').map((char, i) => (
            <Letter
              key={i}
              position={[startX + i * spacing, 0, 0]}
              char={char}
            />
          ))}
        </Physics>
      )}
    </>
  );
};

// Final screen with glowing logo
const FinalScreen = () => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Subtle floating animation
      textRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;

      // Material pulsing glow effect
      const material = textRef.current.children[0].material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity) {
        material.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={1} color="#00ffff" />

      <FloatingParticles />
      <Grid />

      <mesh ref={textRef}>
        <Text
          position={[0, 0, 0]}
          fontSize={1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
          material={new THREE.MeshStandardMaterial({
            color: "#ffffff",
            emissive: "#00ffff",
            emissiveIntensity: 0.5
          })}
        >
          aegntic.ai
        </Text>
      </mesh>
    </>
  );
};

// Main component
const AsciiIntro = ({
  onIntroComplete,
}: {
  onIntroComplete: () => void;
}) => {
  const [crumbleStarted, setCrumbleStarted] = useState(false);
  const [showFoundation, setShowFoundation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!crumbleStarted) {
      setCrumbleStarted(true);

      // After 2 seconds, show "aegntic.foundation"
      setTimeout(() => {
        setShowFoundation(true);
      }, 2000);

      // Allow scrolling after intro is complete
      setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: onIntroComplete
          });
        }
      }, 4000);
    }
  };

  useEffect(() => {
    // Prevent scrolling during intro
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 w-full h-full bg-black"
    >
      <Canvas>
        {!showFoundation ? (
          <Scene onClick={handleClick} crumbleStarted={crumbleStarted} />
        ) : (
          <FinalScreen />
        )}
      </Canvas>
      {!crumbleStarted && (
        <div className="absolute bottom-10 left-0 right-0 text-center text-white text-opacity-50">
          Click anywhere to continue
        </div>
      )}
    </div>
  );
};

export default AsciiIntro;
