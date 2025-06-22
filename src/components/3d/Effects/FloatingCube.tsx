"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { CubeProps } from "../types";

// Simple wireframe cube component (for the remaining 53%)
const FloatingCube = ({
  position,
  scale,
  color,
  opacity,
  rotationSpeed,
  fadeDelay,
}: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Rotate around multiple axes
      meshRef.current.rotation.x = time * rotationSpeed;
      meshRef.current.rotation.y = time * rotationSpeed * 0.7;
      meshRef.current.rotation.z = time * rotationSpeed * 0.3;

      // Floating motion
      meshRef.current.position.y =
        position[1] + Math.sin(time * 0.5 + position[0]) * 0.5;

      // Distance-based brightness for perspective effect
      const cameraPosition = state.camera.position;
      const particlePosition = meshRef.current.position;
      const distanceToCamera = cameraPosition.distanceTo(particlePosition);
      
      // Normalize distance (closer = brighter, farther = dimmer)
      const maxDistance = 50; // Adjust based on scene size
      const minDistance = 5;
      const normalizedDistance = Math.max(0, Math.min(1, (distanceToCamera - minDistance) / (maxDistance - minDistance)));
      const distanceOpacity = 1 - normalizedDistance * 0.7; // Reduce opacity by up to 70% for far particles

      // Slow fade in/out
      const fadePhase = (time * 0.1 + fadeDelay) % 1; // 10 second cycle
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.3 + 0.4; // 0.4 to 0.7 opacity range

      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = opacity * fadeOpacity * distanceOpacity;
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

export default FloatingCube;
