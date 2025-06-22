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
  const count = 1000; // 1/3 of original 3000
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
    context.fillStyle = '#ffffff';
    context.font = '64px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Use "ae" symbols in upper and lower case
    const symbols = ['æ', 'Æ', 'ae', 'AE', 'ÆE', 'æe'];
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
        color="#ffffff"
        transparent
        opacity={0.3}
        alphaMap={symbolsMap}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

// Animated tesseract component (4D hypercube projection)
const AnimatedTesseract = ({ position, scale, color, baseOpacity, rotationSpeed, fadeDelay }: {
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  baseOpacity: number;
  rotationSpeed: number;
  fadeDelay: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // 4D rotation simulation - rotate around multiple axes at different speeds
      groupRef.current.rotation.x = time * rotationSpeed;
      groupRef.current.rotation.y = time * rotationSpeed * 0.7;
      groupRef.current.rotation.z = time * rotationSpeed * 0.3;
      
      // Floating motion
      groupRef.current.position.y = position[1] + Math.sin(time * 0.3 + position[0]) * 0.4;
      groupRef.current.position.x = position[0] + Math.cos(time * 0.2 + position[2]) * 0.2;
      
      // Very slow fade in/out (8 second cycle)
      const fadePhase = (time * 0.125 + fadeDelay) % 1; // 8 second cycle
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.3 + 0.2; // 0.2 to 0.5 opacity range
      
      // Update all children materials
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = baseOpacity * fadeOpacity;
        }
      });
    }
  });

  // Create tesseract geometry using proper BufferGeometry
  const geometry = useMemo(() => {
    const positions = [];
    
    // Inner cube vertices
    const innerCube = [
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]
    ];
    
    // Outer cube vertices (scaled and offset for 4D projection)
    const outerScale = 0.6;
    const outerCube = innerCube.map(([x, y, z]) => [
      x * outerScale,
      y * outerScale, 
      z * outerScale
    ]);
    
    // Inner cube edges
    const cubeEdges = [
      [0,1],[1,2],[2,3],[3,0], // bottom face
      [4,5],[5,6],[6,7],[7,4], // top face
      [0,4],[1,5],[2,6],[3,7]  // vertical edges
    ];
    
    // Add inner cube lines
    cubeEdges.forEach(([a, b]) => {
      positions.push(...innerCube[a], ...innerCube[b]);
    });
    
    // Add outer cube lines
    cubeEdges.forEach(([a, b]) => {
      positions.push(...outerCube[a], ...outerCube[b]);
    });
    
    // Connect inner to outer (4D edges)
    for (let i = 0; i < 8; i++) {
      positions.push(...innerCube[i], ...outerCube[i]);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={baseOpacity}
        />
      </lineSegments>
    </group>
  );
};

// Triangular tesseract component (tetrahedral 4D structure)
const TriangularTesseract = ({ position, scale, color, baseOpacity, rotationSpeed, fadeDelay }: {
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  baseOpacity: number;
  rotationSpeed: number;
  fadeDelay: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // 4D rotation simulation - rotate around multiple axes at different speeds
      groupRef.current.rotation.x = time * rotationSpeed * 1.3;
      groupRef.current.rotation.y = time * rotationSpeed * 0.9;
      groupRef.current.rotation.z = time * rotationSpeed * 0.6;
      
      // Floating motion
      groupRef.current.position.y = position[1] + Math.sin(time * 0.4 + position[0]) * 0.3;
      groupRef.current.position.x = position[0] + Math.cos(time * 0.3 + position[2]) * 0.2;
      
      // Very slow fade in/out (8 second cycle)
      const fadePhase = (time * 0.125 + fadeDelay) % 1; // 8 second cycle
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.4 + 0.3; // 0.3 to 0.7 opacity range
      
      // Update all children materials
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = baseOpacity * fadeOpacity;
        }
      });
    }
  });

  // Create triangular tesseract geometry (tetrahedral 4D structure)
  const geometry = useMemo(() => {
    const positions = [];
    
    // Inner tetrahedron vertices
    const innerTetra = [
      [0, 0.8, 0],           // top
      [-0.7, -0.4, -0.4],    // bottom left
      [0.7, -0.4, -0.4],     // bottom right  
      [0, -0.4, 0.8]         // bottom back
    ];
    
    // Outer tetrahedron vertices (scaled for 4D projection)
    const outerScale = 0.5;
    const outerTetra = innerTetra.map(([x, y, z]) => [
      x * outerScale,
      y * outerScale, 
      z * outerScale
    ]);
    
    // Tetrahedron edges
    const tetraEdges = [
      [0,1],[0,2],[0,3], // top to bottom vertices
      [1,2],[2,3],[3,1]  // bottom triangle
    ];
    
    // Add inner tetrahedron lines
    tetraEdges.forEach(([a, b]) => {
      positions.push(...innerTetra[a], ...innerTetra[b]);
    });
    
    // Add outer tetrahedron lines
    tetraEdges.forEach(([a, b]) => {
      positions.push(...outerTetra[a], ...outerTetra[b]);
    });
    
    // Connect inner to outer (4D edges)
    for (let i = 0; i < 4; i++) {
      positions.push(...innerTetra[i], ...outerTetra[i]);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={baseOpacity}
        />
      </lineSegments>
    </group>
  );
};

// Simple wireframe cube component (for the remaining 53%)
const FloatingCube = ({ position, scale, color, opacity, rotationSpeed, fadeDelay }: {
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  opacity: number;
  rotationSpeed: number;
  fadeDelay: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Rotate around multiple axes
      meshRef.current.rotation.x = time * rotationSpeed;
      meshRef.current.rotation.y = time * rotationSpeed * 0.7;
      meshRef.current.rotation.z = time * rotationSpeed * 0.3;
      
      // Floating motion
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.5;
      
      // Slow fade in/out
      const fadePhase = (time * 0.1 + fadeDelay) % 1; // 10 second cycle
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.3 + 0.4; // 0.4 to 0.7 opacity range
      
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = opacity * fadeOpacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity}
        wireframe={true}
      />
    </mesh>
  );
};

// Floating mixed geometries system (36% tesseracts, 11% triangular tesseracts, 53% cubes)
const FloatingParticles = () => {
  const count = 69;
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45;
      const scale = Math.random() * 0.4 + 0.2;
      const rotationSpeed = (Math.random() - 0.5) * 0.1;
      // Random grayscale color
      const grayValue = Math.random() * 0.7 + 0.3;
      const color = new THREE.Color(grayValue, grayValue, grayValue);
      const baseOpacity = Math.random() * 0.3 + 0.4;
      const fadeDelay = Math.random() * 8;
      
      // Determine type based on percentages
      let type: 'tesseract' | 'triangular' | 'cube';
      const rand = Math.random();
      if (rand < 0.36) {
        type = 'tesseract'; // 36%
      } else if (rand < 0.47) { // 36% + 11% = 47%
        type = 'triangular'; // 11%
      } else {
        type = 'cube'; // 53%
      }
      
      temp.push({ 
        type,
        position: [x, y, z] as [number, number, number], 
        scale, 
        color, 
        baseOpacity, 
        rotationSpeed,
        fadeDelay
      });
    }
    return temp;
  }, [count]);

  return (
    <>
      {particles.map((particle, i) => {
        if (particle.type === 'tesseract') {
          return (
            <AnimatedTesseract
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              baseOpacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        } else if (particle.type === 'triangular') {
          return (
            <TriangularTesseract
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              baseOpacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        } else {
          return (
            <FloatingCube
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              opacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        }
      })}
    </>
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
      <meshBasicMaterial color="#00ffff" wireframe={true} />
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

  useFrame(({ clock, camera }) => {
    if (textRef.current && ringRef.current) {
      // Create a raycaster from the mouse position
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(mousePos.current[0], mousePos.current[1]), 
        camera
      );

      // Create a plane at the text's Z position to project the mouse onto
      const textPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -4); // text is at z=4
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(textPlane, intersectionPoint);

      if (intersectionPoint) {
        // Smoothly interpolate position
        textRef.current.position.x += (intersectionPoint.x - textRef.current.position.x) * 0.1;
        textRef.current.position.y += (intersectionPoint.y - textRef.current.position.y) * 0.1;

        // Ring follows the text
        ringRef.current.position.x = textRef.current.position.x;
        ringRef.current.position.y = textRef.current.position.y;
      }

      // Pulse animation for the ring
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <>
      <mesh ref={textRef} position={[0, 0, 0]}>
        <Text
          fontSize={0.15}
          fillOpacity={0}
          strokeColor="#ffffff"
          strokeWidth={0.005}
          strokeOpacity={0.6}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        >
          click
        </Text>
      </mesh>
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
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

// Complete text component - treat as whole word - WORKING VERSION
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
      
      {/* Front text - outline only using stroke */}
      <Text
        fontSize={1.5}
        fillOpacity={0}
        strokeColor="#c0c0c0"
        strokeWidth={0.01}
        strokeOpacity={1}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        letterSpacing={0.05}
        fontWeight="bold"
      >
        aegntic.ai
      </Text>
      
      {/* Back text - outline only at 0.11 depth */}
      <Text
        position={[0, 0, -0.11]}
        fontSize={1.5}
        fillOpacity={0.4}
        color="#ffffff"
        strokeColor="#c0c0c0"
        strokeWidth={0.02}
        strokeOpacity={0.5}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        letterSpacing={0.05}
        fontWeight="bold"
      >
        aegntic.ai
      </Text>
    </group>
  );
};

// Vertical grid wall/plane where the cursor moves
const CursorWallGrid = () => {
  const geometry = useMemo(() => {
    const positions = [];
    const size = 30;
    const divisions = 15;
    const step = size / divisions;
    const halfSize = size / 2;

    // Horizontal lines on the vertical wall (X direction, different Y levels)
    for (let y = -halfSize; y <= halfSize; y += step) {
      positions.push(-halfSize, y, 0);  // Left point
      positions.push(halfSize, y, 0);   // Right point
    }

    // Vertical lines on the vertical wall (Y direction, different X levels)
    for (let x = -halfSize; x <= halfSize; x += step) {
      positions.push(x, -halfSize, 0);  // Bottom point
      positions.push(x, halfSize, 0);   // Top point
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <lineSegments position={[0, 0, 0]} geometry={geometry}>
      <lineBasicMaterial color="#0080ff" opacity={0.3} transparent />
    </lineSegments>
  );
};

// Main click plane at y=0 with full visibility
const ClickPlaneGrid = () => {
  const geometry = useMemo(() => {
    const positions = [];
    const size = 50;
    const divisions = 25;
    const step = size / divisions;
    const halfSize = size / 2;

    // HORIZONTAL LINES at y=0 (X direction)
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + (i * step);
      
      // Horizontal line from left to right (X direction)
      positions.push(-halfSize, 0, z);  // Left point
      positions.push(halfSize, 0, z);   // Right point
    }

    // HORIZONTAL LINES at y=0 (Z direction)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + (i * step);
      
      // Horizontal line from front to back (Z direction)
      positions.push(x, 0, -halfSize);  // Front point
      positions.push(x, 0, halfSize);   // Back point
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <lineSegments position={[0, 0, 0]} geometry={geometry}>
      <lineBasicMaterial color="#0080ff" opacity={0.3} transparent />
    </lineSegments>
  );
};

// Grid with static vertical lines
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
      {/* Background grids */}
      <gridHelper
        args={[50, 50, "#000508", "#001020"]}
        position={[0, -10, 0]}
      />
      <gridHelper
        args={[50, 50, "#000508", "#001020"]}
        position={[0, 10, 0]}
      />
      
      {/* Base grid - full visibility */}
      <gridHelper
        args={[50, 50, "#000508", "#001020"]}
        position={[0, 0, 0]}
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
      <CursorWallGrid />
      <ClickPlaneGrid />
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