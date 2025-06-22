"use client";

import { useMemo } from "react";
import * as THREE from "three";
import AnimatedTesseract from "./AnimatedTesseract";
import TriangularTesseract from "./TriangularTesseract";
import FloatingCube from "./FloatingCube";
import type { FloatingParticle } from "../types";

// Floating mixed geometries system (36% tesseracts, 11% triangular tesseracts, 53% cubes)
const FloatingParticles = () => {
  const count = 69;

  const particles = useMemo(() => {
    const temp: FloatingParticle[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45;
      const scale = Math.random() * 0.4 + 0.2;
      const rotationSpeed = (Math.random() - 0.5) * 0.1;
      // Random grayscale color
      const grayValue = Math.random() * 0.7 + 0.3;
      const color = new THREE.Color(grayValue, grayValue, grayValue);
      const baseOpacity = Math.random() * 0.3 + 0.4;
      const fadeDelay = Math.random() * 8;

      // Determine type based on percentages
      let type: "tesseract" | "triangular" | "cube";
      const rand = Math.random();
      if (rand < 0.36) {
        type = "tesseract"; // 36%
      } else if (rand < 0.47) {
        // 36% + 11% = 47%
        type = "triangular"; // 11%
      } else {
        type = "cube"; // 53%
      }

      temp.push({
        type,
        position: [x, y, z] as [number, number, number],
        scale,
        color,
        baseOpacity,
        rotationSpeed,
        fadeDelay,
      });
    }
    return temp;
  }, [count]);

  return (
    <>
      {particles.map((particle, i) => {
        if (particle.type === "tesseract") {
          return (
            <AnimatedTesseract
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              baseOpacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        } else if (particle.type === "triangular") {
          return (
            <TriangularTesseract
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              baseOpacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        } else {
          return (
            <FloatingCube
              key={i}
              position={particle.position}
              scale={particle.scale}
              color={particle.color}
              opacity={particle.baseOpacity}
              rotationSpeed={particle.rotationSpeed}
              fadeDelay={particle.fadeDelay}
            />
          );
        }
      })}
    </>
  );
};

export default FloatingParticles;
