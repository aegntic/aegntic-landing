"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TesseractProps } from "../types";

// Triangular tesseract component (tetrahedral 4D structure)
const TriangularTesseract = ({
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
      groupRef.current.rotation.x = time * rotationSpeed * 1.3;
      groupRef.current.rotation.y = time * rotationSpeed * 0.9;
      groupRef.current.rotation.z = time * rotationSpeed * 0.6;

      // Floating motion
      groupRef.current.position.y =
        position[1] + Math.sin(time * 0.4 + position[0]) * 0.3;
      groupRef.current.position.x =
        position[0] + Math.cos(time * 0.3 + position[2]) * 0.2;

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
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.4 + 0.3; // 0.3 to 0.7 opacity range

      // Update all children materials
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = baseOpacity * fadeOpacity * distanceOpacity;
        }
      });
    }
  });

  // Create triangular tesseract geometry (tetrahedral 4D structure)
  const geometry = useMemo(() => {
    const positions = [];

    // Inner tetrahedron vertices
    const innerTetra = [
      [0, 0.8, 0], // top
      [-0.7, -0.4, -0.4], // bottom left
      [0.7, -0.4, -0.4], // bottom right
      [0, -0.4, 0.8], // bottom back
    ];

    // Outer tetrahedron vertices (scaled for 4D projection)
    const outerScale = 0.5;
    const outerTetra = innerTetra.map(([x, y, z]) => [
      x * outerScale,
      y * outerScale,
      z * outerScale,
    ]);

    // Tetrahedron edges
    const tetraEdges = [
      [0, 1],
      [0, 2],
      [0, 3], // top to bottom vertices
      [1, 2],
      [2, 3],
      [3, 1], // bottom triangle
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

export default TriangularTesseract;
