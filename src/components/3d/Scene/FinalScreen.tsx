"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

import { Grid } from "../Grid";
import { FloatingParticles } from "../Effects";

// Final screen with glowing logo
const FinalScreen = () => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Subtle floating animation
      textRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;

      // Material pulsing glow effect
      const firstChild = textRef.current.children[0];
      if (firstChild && 'material' in firstChild) {
        const material = firstChild.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity !== undefined) {
          material.emissiveIntensity =
            0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight
        position={[0, 5, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#00ffff"
      />

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
          material={
            new THREE.MeshStandardMaterial({
              color: "#ffffff",
              emissive: "#00ffff",
              emissiveIntensity: 0.5,
            })
          }
        >
          aegntic.ai
        </Text>
      </mesh>
    </>
  );
};

export default FinalScreen;
