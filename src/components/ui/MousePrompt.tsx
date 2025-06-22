"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

// Mouse cursor component using Billboard for consistent screen-space tracking
const MousePrompt = () => {
  const { viewport, camera } = useThree();
  const mousePos = useRef<[number, number]>([0, 0]);
  const billboardRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mousePos.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useFrame(({ clock }) => {
    if (billboardRef.current && ringRef.current) {
      // Convert normalized device coordinates to world space using screen-space approach
      // This maintains consistent positioning regardless of camera angle
      const distance = 8; // Fixed distance from camera

      // Calculate world position based on screen coordinates and camera
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      // Create vectors for right and up directions relative to camera
      const right = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      right.crossVectors(cameraDirection, up).normalize();
      up.crossVectors(right, cameraDirection).normalize();

      // Calculate position in front of camera
      const cameraPosition = camera.position.clone();
      const targetPosition = cameraPosition.clone();
      targetPosition.add(cameraDirection.multiplyScalar(distance));

      // Add screen-space offset based on mouse position
      const horizontalOffset = right
        .clone()
        .multiplyScalar(mousePos.current[0] * viewport.width * 0.5);
      const verticalOffset = up
        .clone()
        .multiplyScalar(mousePos.current[1] * viewport.height * 0.5);

      targetPosition.add(horizontalOffset);
      targetPosition.add(verticalOffset);

      // Update Billboard position smoothly
      billboardRef.current.position.lerp(targetPosition, 0.1);

      // Ring follows the billboard exactly
      ringRef.current.position.copy(billboardRef.current.position);
      ringRef.current.position.z -= 0.01; // Slightly behind text

      // Pulse animation for the ring
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
      ringRef.current.scale.set(pulse, pulse, 1);

      // Make ring face camera
      ringRef.current.lookAt(camera.position);
    }
  });

  return (
    <>
      <Billboard
        ref={billboardRef}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
          material={
            new THREE.MeshBasicMaterial({
              color: "#ffffff",
              transparent: true,
              opacity: 1,
              side: THREE.DoubleSide,
            })
          }
        >
          click
        </Text>
        {/* White glow effect around text */}
        <Text
          position={[0, 0, -0.001]}
          fontSize={0.32}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
          material={
            new THREE.MeshBasicMaterial({
              color: "#ffffff",
              transparent: true,
              opacity: 0.4,
              side: THREE.DoubleSide,
            })
          }
        >
          click
        </Text>
      </Billboard>

      <mesh ref={ringRef}>
        <ringGeometry args={[0.27, 0.33, 32]} />
        <meshBasicMaterial
          color="#00bfff"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default MousePrompt;
