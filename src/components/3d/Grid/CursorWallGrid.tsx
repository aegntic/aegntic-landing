"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Vertical grid wall/plane where the cursor moves
const CursorWallGrid = () => {
  const geometry = useMemo(() => {
    const positions = [];
    const size = 30;
    const divisions = 15;
    const step = size / divisions;
    const halfSize = size / 2;

    // Horizontal lines on the vertical wall (X direction, different Y levels)
    for (let y = -halfSize; y <= halfSize; y += step) {
      positions.push(-halfSize, y, 0); // Left point
      positions.push(halfSize, y, 0); // Right point
    }

    // Vertical lines on the vertical wall (Y direction, different X levels)
    for (let x = -halfSize; x <= halfSize; x += step) {
      positions.push(x, -halfSize, 0); // Bottom point
      positions.push(x, halfSize, 0); // Top point
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

export default CursorWallGrid;
