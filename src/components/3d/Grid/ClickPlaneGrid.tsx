"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Main click plane at y=0 with full visibility
const ClickPlaneGrid = () => {
  const geometry = useMemo(() => {
    const positions = [];
    const size = 50;
    const divisions = 25;
    const step = size / divisions;
    const halfSize = size / 2;

    // HORIZONTAL LINES at y=0 (X direction)
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + i * step;

      // Horizontal line from left to right (X direction)
      positions.push(-halfSize, 0, z); // Left point
      positions.push(halfSize, 0, z); // Right point
    }

    // HORIZONTAL LINES at y=0 (Z direction)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + i * step;

      // Horizontal line from front to back (Z direction)
      positions.push(x, 0, -halfSize); // Front point
      positions.push(x, 0, halfSize); // Back point
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geometry;
  }, []);

  return (
    <lineSegments position={[0, 0, 0]} geometry={geometry}>
      <lineBasicMaterial color="#0080ff" opacity={0.3} transparent />
    </lineSegments>
  );
};

export default ClickPlaneGrid;
