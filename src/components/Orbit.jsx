import React, { useMemo } from 'react';
import * as THREE from 'three';

const Orbit = React.memo(function Orbit({ distance, color = '#ffffff', opacity = 0.15 }) {
  const points = useMemo(() => {
    const segments = 128;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    }
    return pts;
  }, [distance]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
});

export default Orbit;
