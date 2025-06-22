"use client";

import { useEffect } from "react";
import { Text } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import type { Triplet } from "@react-three/cannon";
import type { LetterProps } from "../types";

// Letter component that falls with physics
const Letter = ({ position, char }: LetterProps) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 0.2],
  }));

  useEffect(() => {
    // Apply a random impulse when the letter starts falling
    const timeout = setTimeout(() => {
      const impulse: Triplet = [
        Math.random() * 5 - 2.5,
        Math.random() * -5,
        Math.random() * 5 - 2.5,
      ];
      const point: Triplet = [0, 0, 0];

      api.applyImpulse(impulse, point);
      api.angularVelocity.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [api]);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 0.2]} />
      <meshBasicMaterial color="#00ffff" wireframe={true} />
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
      >
        {char}
      </Text>
    </mesh>
  );
};

export default Letter;
