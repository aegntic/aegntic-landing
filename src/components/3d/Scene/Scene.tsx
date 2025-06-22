"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

import { Grid, CursorWallGrid, ClickPlaneGrid } from "../Grid";
import { FlippingText } from "../Text";
import { CameraAnimation } from "../Camera";
import { DigitalRain, FloatingParticles } from "../Effects";
import { MousePrompt } from "../../ui";
import type { SceneProps } from "../types";

// Scene component
const Scene = ({ onClick, crumbleStarted }: SceneProps) => {
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
      const angle = Math.atan2(
        state.camera.position.x,
        state.camera.position.z,
      );
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
            <meshBasicMaterial
              opacity={0}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </>
  );
};

export default Scene;
