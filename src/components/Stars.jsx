import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 4000;

const StarField = React.memo(function StarField() {
  const pointsRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const siz = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute on sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 300 + Math.random() * 200;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors (white to blue to yellow)
      const colorType = Math.random();
      if (colorType < 0.6) {
        col[i * 3] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 1.0;
      } else if (colorType < 0.8) {
        col[i * 3] = 0.6 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      }

      siz[i] = 0.3 + Math.random() * 1.5;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
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
        size={1.2}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
});

export default StarField;
