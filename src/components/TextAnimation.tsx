'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';

function RotatingText() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.elapsedTime;
      textRef.current.rotation.y = Math.sin(time * 0.8) * (Math.PI * 89 / 180);
      textRef.current.rotation.x = Math.sin(time * 0.6) * 0.1;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text
          fontSize={1.2}
          letterSpacing={-0.05}
          lineHeight={1}
          color="#ffffff"
        >
          aegntic.ai
        </Text>
      </Center>
    </group>
  );
}

export default function TextAnimation() {
  return (
    <div className="h-48 w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingText />
      </Canvas>
    </div>
  );
}