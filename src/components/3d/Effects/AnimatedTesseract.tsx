"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TesseractProps } from "../types";

// Animated tesseract component (4D hypercube projection)
const AnimatedTesseract = ({
  position,
  scale,
  color,
  baseOpacity,
  rotationSpeed,
  fadeDelay,
}: TesseractProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();

      // 4D rotation simulation - rotate around multiple axes at different speeds
      groupRef.current.rotation.x = time * rotationSpeed;
      groupRef.current.rotation.y = time * rotationSpeed * 0.7;
      groupRef.current.rotation.z = time * rotationSpeed * 0.3;

      // Floating motion
      groupRef.current.position.y =
        position[1] + Math.sin(time * 0.3 + position[0]) * 0.4;
      groupRef.current.position.x =
        position[0] + Math.cos(time * 0.2 + position[2]) * 0.2;

      // Distance-based brightness for perspective effect
      const cameraPosition = state.camera.position;
      const particlePosition = groupRef.current.position;
      const distanceToCamera = cameraPosition.distanceTo(particlePosition);
      
      // Normalize distance (closer = brighter, farther = dimmer)
      const maxDistance = 50; // Adjust based on scene size
      const minDistance = 5;
      const normalizedDistance = Math.max(0, Math.min(1, (distanceToCamera - minDistance) / (maxDistance - minDistance)));
      const distanceOpacity = 1 - normalizedDistance * 0.7; // Reduce opacity by up to 70% for far particles

      // Very slow fade in/out (8 second cycle)
      const fadePhase = (time * 0.125 + fadeDelay) % 1; // 8 second cycle
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.3 + 0.2; // 0.2 to 0.5 opacity range

      // Update all children materials
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = baseOpacity * fadeOpacity * distanceOpacity;
        }
      });
    }
  });

  // Create tesseract geometry using proper BufferGeometry
  const geometry = useMemo(() => {
    const positions = [];

    // Inner cube vertices
    const innerCube = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ];

    // Outer cube vertices (scaled and offset for 4D projection)
    const outerScale = 0.6;
    const outerCube = innerCube.map(([x, y, z]) => [
      x * outerScale,
      y * outerScale,
      z * outerScale,
    ]);

    // Inner cube edges
    const cubeEdges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // bottom face
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // top face
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // vertical edges
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
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geometry;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={baseOpacity} />
      </lineSegments>
    </group>
  );
};

export default AnimatedTesseract;
