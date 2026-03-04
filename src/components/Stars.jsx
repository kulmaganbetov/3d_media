import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

const STAR_COUNT = 3000;

const StarField = React.memo(function StarField() {
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 350 + Math.random() * 150;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Realistic star colors — mostly white, some blue/yellow/orange
      const r = Math.random();
      if (r < 0.55) {
        // White stars
        const b = 0.85 + Math.random() * 0.15;
        col[i * 3] = b;
        col[i * 3 + 1] = b;
        col[i * 3 + 2] = b + 0.05;
      } else if (r < 0.75) {
        // Blue-white
        col[i * 3] = 0.7 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.75 + Math.random() * 0.15;
        col[i * 3 + 2] = 1.0;
      } else if (r < 0.9) {
        // Warm yellow
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.15;
      } else {
        // Red/orange (rare)
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.6 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.4 + Math.random() * 0.2;
      }
    }

    return { positions: pos, colors: col };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={STAR_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
});

export default StarField;
