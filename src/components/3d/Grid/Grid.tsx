"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGridShaderMaterial } from "../Shaders/GridShader";

// Custom Grid component with per-square control and radius-based lighting
const Grid = () => {
  const gridRef = useRef<THREE.Group>(null);
  const mainGridRef = useRef<THREE.Mesh>(null);

  // Grid configuration
  const gridSize = 50;
  const divisions = 100;
  const squareSize = gridSize / divisions;

  // Lighting state for each grid intersection
  const [lightingState, setLightingState] = useState<Map<string, number>>(
    new Map(),
  );

  // Create custom grid geometry with optimizations
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const indices = [];

    // Grid colors
    const primaryColor = new THREE.Color("#000508");
    const secondaryColor = new THREE.Color("#001020");

    // Create vertices for each grid square
    let vertexIndex = 0;
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const x = (i - divisions / 2) * squareSize;
        const z = (j - divisions / 2) * squareSize;

        positions.push(x, 0, z);

        // Alternate colors based on grid lines
        const isMainLine = i % 10 === 0 || j % 10 === 0;
        const color = isMainLine ? primaryColor : secondaryColor;
        colors.push(color.r, color.g, color.b);

        vertexIndex++;
      }
    }

    // Create line indices for grid
    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        // Horizontal lines
        const idx1 = i * (divisions + 1) + j;
        const idx2 = (i + 1) * (divisions + 1) + j;
        indices.push(idx1, idx2);

        // Vertical lines
        if (j < divisions) {
          const idx3 = i * (divisions + 1) + j;
          const idx4 = i * (divisions + 1) + j + 1;
          indices.push(idx3, idx4);
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    // Enable frustum culling for better performance
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
  }, [squareSize, divisions]);

  // Create shader material with proper configuration
  const shaderMaterial = useMemo(() => createGridShaderMaterial(), []);

  // Function to light up squares within radius
  const lightUpRadius = useCallback(
    (centerX: number, centerZ: number, radius: number, intensity = 1.0) => {
      if (!mainGridRef.current) return;

      const colors = mainGridRef.current.geometry.attributes.color;
      const positions = mainGridRef.current.geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);

        const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);

        if (distance <= radius) {
          // Smoother falloff with exponential curve for softer edges
          const normalizedDistance = distance / radius;
          const softFalloff = Math.pow(1 - normalizedDistance, 2.5); // Exponential curve for softer edges
          const lightIntensity = intensity * softFalloff;

          // Blend with existing color
          const originalR = colors.getX(i);
          const originalG = colors.getY(i);
          const originalB = colors.getZ(i);

          // Add blue glow effect with softer blending
          const newR = Math.min(1, originalR + lightIntensity * 0.15);
          const newG = Math.min(1, originalG + lightIntensity * 0.3);
          const newB = Math.min(1, originalB + lightIntensity * 0.6);

          colors.setXYZ(i, newR, newG, newB);
        }
      }

      colors.needsUpdate = true;
    },
    [],
  );

  // Reset grid colors to default
  const resetGridColors = useCallback(() => {
    if (!mainGridRef.current) return;

    const colors = mainGridRef.current.geometry.attributes.color;
    const primaryColor = new THREE.Color("#000508");
    const secondaryColor = new THREE.Color("#001020");

    let vertexIndex = 0;
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const isMainLine = i % 10 === 0 || j % 10 === 0;
        const color = isMainLine ? primaryColor : secondaryColor;
        colors.setXYZ(vertexIndex, color.r, color.g, color.b);
        vertexIndex++;
      }
    }

    colors.needsUpdate = true;
  }, [divisions]);

  // Mouse tracking for repulsion effect
  const mouseWorldPos = useRef({ x: 0, z: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse to world coordinates (approximate)
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Project to grid plane (y=0)
      mouseWorldPos.current.x = mouseX * 25; // Scale to grid size
      mouseWorldPos.current.z = mouseY * 25;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock, camera }) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      gridRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.1) * 0.1;
    }

    // Base moving light position
    const time = clock.getElapsedTime();
    const baseLightX = Math.sin(time * 0.5) * 10;
    const baseLightZ = Math.cos(time * 0.5) * 10;

    // Calculate repulsion from mouse
    const mouseX = mouseWorldPos.current.x;
    const mouseZ = mouseWorldPos.current.z;

    // Vector from light to mouse
    const toMouseX = mouseX - baseLightX;
    const toMouseZ = mouseZ - baseLightZ;
    const distanceToMouse = Math.sqrt(
      toMouseX * toMouseX + toMouseZ * toMouseZ,
    );

    // Repulsion effect (stronger when closer)
    const repulsionStrength = 8;
    const maxRepulsionDistance = 15;

    let finalLightX = baseLightX;
    let finalLightZ = baseLightZ;

    if (distanceToMouse < maxRepulsionDistance && distanceToMouse > 0) {
      const repulsionForce =
        (maxRepulsionDistance - distanceToMouse) / maxRepulsionDistance;
      const repulsionX =
        -(toMouseX / distanceToMouse) * repulsionStrength * repulsionForce;
      const repulsionZ =
        -(toMouseZ / distanceToMouse) * repulsionStrength * repulsionForce;

      finalLightX += repulsionX;
      finalLightZ += repulsionZ;
    }

    // Update shader uniforms for GPU-based lighting
    if (shaderMaterial.uniforms) {
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uLightPosition.value.set(finalLightX, 0, finalLightZ);
      shaderMaterial.uniforms.uMousePosition.value.set(mouseX, 0, mouseZ);
    }
  });

  // Expose lighting functions globally for potential interaction
  useEffect(() => {
    (
      window as typeof window & {
        gridLighting?: {
          lightUpRadius: typeof lightUpRadius;
          resetGridColors: typeof resetGridColors;
        };
      }
    ).gridLighting = {
      lightUpRadius,
      resetGridColors,
    };
  }, [lightUpRadius, resetGridColors]);

  return (
    <group ref={gridRef}>
      {/* Background grids with shader material */}
      <lineSegments position={[0, -10, 0]} geometry={gridGeometry}>
        <primitive object={shaderMaterial.clone()} />
      </lineSegments>
      <lineSegments position={[0, 10, 0]} geometry={gridGeometry}>
        <primitive object={shaderMaterial.clone()} />
      </lineSegments>

      {/* Main grid with shader-based lighting */}
      <lineSegments
        ref={mainGridRef}
        position={[0, 0, 0]}
        geometry={gridGeometry}
      >
        <primitive object={shaderMaterial} />
      </lineSegments>
    </group>
  );
};

export default Grid;
