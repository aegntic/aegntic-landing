'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedText() {
  const textRef = useRef<THREE.Group>(null);
  
  console.log('AnimatedText component rendered');
  
  useFrame((state) => {
    if (textRef.current && state.clock) {
      try {
        // 178 degree front-facing rotation - safe implementation
        const time = state.clock.elapsedTime;
        const rotationY = Math.sin(time * 0.8) * (Math.PI * 89 / 180);
        const rotationX = Math.sin(time * 0.6) * 0.1;
        
        textRef.current.rotation.y = rotationY;
        textRef.current.rotation.x = rotationX;
      } catch (e) {
        console.warn('Animation error:', e);
      }
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



export default function Text3DComponent() {
  return (
    <div className="h-48 w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <AnimatedText />
        </Suspense>
      </Canvas>
    </div>
  );
}