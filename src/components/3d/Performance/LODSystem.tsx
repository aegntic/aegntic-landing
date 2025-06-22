"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface LODLevel {
  distance: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  visible: boolean;
}

interface LODSystemProps {
  position: [number, number, number];
  levels: LODLevel[];
  children?: React.ReactNode;
}

const LODSystem: React.FC<LODSystemProps> = ({
  position,
  levels,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const currentLevelRef = useRef(0);

  // Create LOD geometries with different complexities
  const lodGeometries = useMemo(() => {
    return {
      high: new THREE.IcosahedronGeometry(1, 3), // 2562 triangles
      medium: new THREE.IcosahedronGeometry(1, 2), // 640 triangles
      low: new THREE.IcosahedronGeometry(1, 1), // 160 triangles
      minimal: new THREE.IcosahedronGeometry(1, 0), // 40 triangles
    };
  }, []);

  // Materials for different LOD levels
  const lodMaterials = useMemo(() => {
    return {
      high: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        wireframe: false,
        transparent: true,
        opacity: 0.8,
      }),
      medium: new THREE.MeshBasicMaterial({
        color: "#ffffff",
        wireframe: false,
        transparent: true,
        opacity: 0.7,
      }),
      low: new THREE.MeshBasicMaterial({
        color: "#ffffff",
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      }),
      minimal: new THREE.PointsMaterial({
        color: "#ffffff",
        size: 0.1,
        transparent: true,
        opacity: 0.5,
      }),
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // Calculate distance to camera
    const worldPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPosition);
    const distance = camera.position.distanceTo(worldPosition);

    // Get performance quality factor
    const performanceQuality = (window as any).performanceQuality || 1.0;

    // Adjust LOD thresholds based on performance
    const lodThresholds = {
      high: 10 * performanceQuality,
      medium: 20 * performanceQuality,
      low: 40 * performanceQuality,
      minimal: 80 * performanceQuality,
    };

    let newLevel = 3; // minimal by default

    if (distance < lodThresholds.high) {
      newLevel = 0; // high detail
    } else if (distance < lodThresholds.medium) {
      newLevel = 1; // medium detail
    } else if (distance < lodThresholds.low) {
      newLevel = 2; // low detail
    }

    // Update visibility if level changed
    if (newLevel !== currentLevelRef.current) {
      currentLevelRef.current = newLevel;

      // Hide all levels first
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          child.visible = index === newLevel;
        }
      });
    }
  });

  // Cleanup geometries and materials on unmount
  const cleanup = () => {
    Object.values(lodGeometries).forEach((geo) => geo.dispose());
    Object.values(lodMaterials).forEach((mat) => mat.dispose());
  };

  return (
    <group ref={groupRef} position={position} onPointerOut={cleanup}>
      {/* High detail level */}
      <mesh
        geometry={lodGeometries.high}
        material={lodMaterials.high}
        visible={true}
      />

      {/* Medium detail level */}
      <mesh
        geometry={lodGeometries.medium}
        material={lodMaterials.medium}
        visible={false}
      />

      {/* Low detail level */}
      <mesh
        geometry={lodGeometries.low}
        material={lodMaterials.low}
        visible={false}
      />

      {/* Minimal detail level (points) */}
      <points
        geometry={lodGeometries.minimal}
        material={lodMaterials.minimal}
        visible={false}
      />

      {children}
    </group>
  );
};

export default LODSystem;
