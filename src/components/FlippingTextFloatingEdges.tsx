'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Floating edge bar component
const FloatingBar = ({ 
  position, 
  rotation, 
  dimensions,
  delay = 0 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  dimensions: [number, number, number];
  delay?: number;
}) => {
  const barRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (barRef.current) {
      const time = clock.getElapsedTime();
      
      // Subtle floating animation with individual timing
      barRef.current.position.y = position[1] + Math.sin(time * 0.8 + delay) * 0.03;
      barRef.current.position.x = position[0] + Math.cos(time * 0.6 + delay) * 0.02;
      
      // Subtle rotation variation
      barRef.current.rotation.z = rotation[2] + Math.sin(time * 0.4 + delay) * 0.01;
      
      // Opacity pulsing for breathing effect
      const material = barRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.25 + Math.sin(time * 1.2 + delay) * 0.08;
    }
  });
  
  return (
    <mesh ref={barRef} position={position} rotation={rotation}>
      <boxGeometry args={dimensions} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.25}
        emissive="#ffffff"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Complete text component with floating edge elements
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

  // Define text bounds for positioning bars around perimeter
  const textBounds = {
    left: -2.0,
    right: 1.7,
    top: 1.1,
    bottom: -1.1
  };

  return (
    <group ref={textRef} position={[0, 0, 4]}>
      {/* Floating Edge Bars - asymmetrically positioned around text perimeter */}
      
      {/* Top edge - offset left, slight angle */}
      <FloatingBar 
        position={[textBounds.left + 0.5, textBounds.top + 0.15, 0.08]} 
        rotation={[0, 0, Math.PI * 1.5 / 180]} 
        dimensions={[1.2, 0.015, 0.015]}
        delay={0}
      />
      
      {/* Top edge - offset right, opposite angle */}
      <FloatingBar 
        position={[textBounds.right - 0.3, textBounds.top + 0.12, -0.05]} 
        rotation={[0, 0, -Math.PI * 2 / 180]} 
        dimensions={[0.8, 0.015, 0.015]}
        delay={1.2}
      />
      
      {/* Right edge - upper portion, slight forward depth */}
      <FloatingBar 
        position={[textBounds.right + 0.18, textBounds.top - 0.4, 0.12]} 
        rotation={[0, 0, Math.PI * 88 / 180]} 
        dimensions={[0.9, 0.015, 0.015]}
        delay={0.8}
      />
      
      {/* Right edge - lower portion, slight back depth */}
      <FloatingBar 
        position={[textBounds.right + 0.14, textBounds.bottom + 0.6, -0.08]} 
        rotation={[0, 0, Math.PI * 91 / 180]} 
        dimensions={[1.1, 0.015, 0.015]}
        delay={2.1}
      />
      
      {/* Bottom edge - offset right, tilted */}
      <FloatingBar 
        position={[textBounds.right - 0.4, textBounds.bottom - 0.16, 0.02]} 
        rotation={[0, 0, Math.PI * 2.5 / 180]} 
        dimensions={[1.0, 0.015, 0.015]}
        delay={1.7}
      />
      
      {/* Bottom edge - offset left, counter-tilted */}
      <FloatingBar 
        position={[textBounds.left + 0.7, textBounds.bottom - 0.13, -0.03]} 
        rotation={[0, 0, -Math.PI * 1 / 180]} 
        dimensions={[1.3, 0.015, 0.015]}
        delay={0.4}
      />
      
      {/* Left edge - upper portion, forward depth */}
      <FloatingBar 
        position={[textBounds.left - 0.16, textBounds.top - 0.5, 0.06]} 
        rotation={[0, 0, Math.PI * 89 / 180]} 
        dimensions={[0.8, 0.015, 0.015]}
        delay={1.4}
      />
      
      {/* Left edge - lower portion, back depth, longer */}
      <FloatingBar 
        position={[textBounds.left - 0.12, textBounds.bottom + 0.3, -0.06]} 
        rotation={[0, 0, Math.PI * 92 / 180]} 
        dimensions={[1.4, 0.015, 0.015]}
        delay={0.9}
      />
      
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