import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ASTEROID_COUNT = 800;
const INNER_RADIUS = 35;
const OUTER_RADIUS = 42;

const AsteroidBelt = React.memo(function AsteroidBelt() {
  const meshRef = useRef();

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(ASTEROID_COUNT * 3);
    const scl = new Float32Array(ASTEROID_COUNT);

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      const y = (Math.random() - 0.5) * 1.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      scl[i] = 0.02 + Math.random() * 0.08;
    }

    return { positions: pos, scales: scl };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set initial transforms
  useMemo(() => {
    // Will be set in first frame
  }, []);

  const initialized = useRef(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime() * 0.02;

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      const baseZ = positions[i * 3 + 2];

      const angle = Math.atan2(baseZ, baseX) + time * (0.5 + scales[i]);
      const radius = Math.sqrt(baseX * baseX + baseZ * baseZ);

      dummy.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius
      );
      dummy.scale.setScalar(scales[i]);
      dummy.rotation.set(time * i * 0.001, time * i * 0.002, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, ASTEROID_COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
});

export default AsteroidBelt;
