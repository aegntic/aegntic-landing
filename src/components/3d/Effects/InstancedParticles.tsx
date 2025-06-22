"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: THREE.Color;
  baseOpacity: number;
  rotationSpeed: number;
  fadeDelay: number;
  velocity: THREE.Vector3;
}

interface InstancedParticlesProps {
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  particleType: "tesseract" | "cube" | "triangular";
}

const InstancedParticles: React.FC<InstancedParticlesProps> = ({
  count,
  geometry,
  material,
  particleType,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();
  const tempMatrix = new THREE.Matrix4();

  // Initialize particle data
  const particles = useMemo<ParticleData[]>(() => {
    const particleArray: ParticleData[] = [];

    for (let i = 0; i < count; i++) {
      // Distributed positions in 3D space
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      );

      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      // Varied scales
      const scale = 0.2 + Math.random() * 0.4;

      // Color variations based on particle type
      let color: THREE.Color;
      switch (particleType) {
        case "tesseract":
          color = new THREE.Color().setHSL(0.6, 0.8, 0.4 + Math.random() * 0.3);
          break;
        case "triangular":
          color = new THREE.Color().setHSL(0.1, 0.9, 0.5 + Math.random() * 0.3);
          break;
        default: // cube
          color = new THREE.Color().setHSL(
            0.55,
            0.7,
            0.3 + Math.random() * 0.4,
          );
      }

      const baseOpacity = 0.1 + Math.random() * 0.3;
      const rotationSpeed = 0.1 + Math.random() * 0.2;
      const fadeDelay = Math.random() * Math.PI * 2;

      // Slow drift velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      );

      particleArray.push({
        position,
        rotation,
        scale,
        color,
        baseOpacity,
        rotationSpeed,
        fadeDelay,
        velocity,
      });
    }

    return particleArray;
  }, [count, particleType]);

  // Color array for instanced rendering
  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    particles.forEach((particle, i) => {
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
    });
    return colors;
  }, [particles, count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const performanceQuality =
      (window as typeof window & { performanceQuality?: number })
        .performanceQuality || 1.0;

    // Adaptive update rate based on performance
    const updateInterval = performanceQuality > 0.5 ? 1 : 2;
    if (Math.floor(time * 60) % updateInterval !== 0) return;

    particles.forEach((particle, i) => {
      // Update rotation
      particle.rotation.x += particle.rotationSpeed * 0.01;
      particle.rotation.y += particle.rotationSpeed * 0.007;
      particle.rotation.z += particle.rotationSpeed * 0.003;

      // Update position with drift
      particle.position.add(particle.velocity);

      // Boundary checking - wrap around
      if (Math.abs(particle.position.x) > 20) {
        particle.position.x = -Math.sign(particle.position.x) * 20;
      }
      if (Math.abs(particle.position.y) > 20) {
        particle.position.y = -Math.sign(particle.position.y) * 20;
      }
      if (Math.abs(particle.position.z) > 20) {
        particle.position.z = -Math.sign(particle.position.z) * 20;
      }

      // Calculate fade opacity
      const fadePhase = (time * 0.125 + particle.fadeDelay) % 1;
      const fadeOpacity = Math.sin(fadePhase * Math.PI) * 0.3 + 0.2;
      const finalOpacity = particle.baseOpacity * fadeOpacity;

      // Update instance matrix
      tempObject.position.copy(particle.position);
      tempObject.rotation.copy(particle.rotation);
      tempObject.scale.setScalar(particle.scale);
      tempObject.updateMatrix();

      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, tempObject.matrix);
        
        // Update opacity (if material supports it)
        if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
          meshRef.current.material.opacity = finalOpacity;
        }
      }
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={true}
    >
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
};

export default InstancedParticles;
