import React, { useMemo } from 'react';
import * as THREE from 'three';

const Orbit = React.memo(function Orbit({ distance, color = '#ffffff', opacity = 0.08 }) {
  const points = useMemo(() => {
    const segments = 192;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    }
    return pts;
  }, [distance]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry} renderOrder={-1}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </line>
  );
});

export default Orbit;
