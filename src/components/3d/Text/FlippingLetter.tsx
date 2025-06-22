"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { FlippingLetterProps } from "../types";

// Individual letter that flips based on camera angle
const FlippingLetter = ({
  char,
  backChar,
  position,
  cameraAngle,
}: FlippingLetterProps) => {
  const letterRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (letterRef.current) {
      // Use same timing as camera animation
      const time = state.clock.getElapsedTime() * 0.3;

      // Simple oscillation constrained to front-facing only
      const oscillation = Math.sin(time) * ((Math.PI * 85) / 180); // 85 degrees max

      letterRef.current.rotation.y = oscillation;
    }
  });

  // Always show front characters since we're always facing camera
  const displayChar = char;

  // Get font size - smaller for .ai part but aligned to baseline
  const getFontSize = () => {
    const charIndex = position[0]; // Use position to determine which character
    if (charIndex >= 1.4) {
      // . a i positions
      return 1.125; // 3/4 of 1.5
    }
    return 1.5; // Normal size
  };

  // Adjust Y position to align baselines
  const getYOffset = () => {
    const charIndex = position[0];
    if (charIndex >= 1.4) {
      // . a i positions
      return -0.1; // Lower slightly to align baselines
    }
    return 0;
  };

  return (
    <group
      ref={letterRef}
      position={[position[0], position[1] + getYOffset(), position[2]]}
    >
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
        material={
          new THREE.MeshBasicMaterial({
            color: "#c0c0c0",
            wireframe: true,
          })
        }
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
            material={
              new THREE.MeshStandardMaterial({
                color: "#ffffff",
                opacity: 0.7,
                transparent: true,
              })
            }
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
            material={
              new THREE.MeshBasicMaterial({
                color: "#c0c0c0",
                wireframe: true,
                opacity: 0.7,
                transparent: true,
              })
            }
          >
            {displayChar}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default FlippingLetter;
