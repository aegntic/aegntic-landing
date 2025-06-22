"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { FlippingTextProps } from "../types";

// Complete text component - treat as whole word - WORKING VERSION
const FlippingText = ({ cameraAngle }: FlippingTextProps) => {
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
      const maxAngle = (Math.PI * 89) / 180;

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
    <group ref={textRef} position={[0, 0.5, 4]}>
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

export default FlippingText;
