import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ASTEROID_COUNT = 500;
const INNER_RADIUS = 35;
const OUTER_RADIUS = 42;

const AsteroidBelt = React.memo(function AsteroidBelt() {
  const meshRef = useRef();
  const frameCount = useRef(0);

  const asteroids = useMemo(() => {
    const data = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      data.push({
        angle: Math.random() * Math.PI * 2,
        radius: INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS),
        y: (Math.random() - 0.5) * 1.2,
        scale: 0.02 + Math.random() * 0.06,
        orbitSpeed: 0.008 + Math.random() * 0.006,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const initialized = useRef(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Update every 3rd frame for performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0 && initialized.current) return;

    const time = clock.getElapsedTime();

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const a = asteroids[i];
      const ang = a.angle + time * a.orbitSpeed;
      dummy.position.set(Math.cos(ang) * a.radius, a.y, Math.sin(ang) * a.radius);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    initialized.current = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, ASTEROID_COUNT]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#777777" roughness={0.95} metalness={0.05} flatShading />
    </instancedMesh>
  );
});

export default AsteroidBelt;
