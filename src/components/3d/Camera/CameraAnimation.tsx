"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { CameraAnimationProps } from "../types";

// Animated camera movement
const CameraAnimation = ({ active, textRef }: CameraAnimationProps) => {
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

export default CameraAnimation;
