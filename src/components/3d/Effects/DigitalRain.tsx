"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";
import * as THREE from "three";

// Digital rain particle system
const DigitalRain = () => {
  const count = 1000; // 1/3 of original 3000
  const ref = useRef<Points>(null);

  // Create falling matrix-like particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  // Create a falling matrix symbols texture
  const symbolsMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#ffffff";
    context.font = "64px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Use "ae" symbols in upper and lower case
    const symbols = ["æ", "Æ", "ae", "AE", "ÆE", "æe"];
    context.fillText(
      symbols[Math.floor(Math.random() * symbols.length)],
      64,
      64,
    );

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    // Rotate slowly
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;

    // Update particle positions
    const positions = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= 0.05; // Fall down

      // Reset particle position when it goes too far down
      if (positions[i3 + 1] < -25) {
        positions[i3 + 1] = 25;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
          onUpdate={(self) => {
            const positions = self.array as Float32Array;
            particles.forEach(({ x, y, z }, i) => {
              const i3 = i * 3;
              positions[i3] = x;
              positions[i3 + 1] = y;
              positions[i3 + 2] = z;
            });
          }}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.3}
        alphaMap={symbolsMap}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

export default DigitalRain;
