import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Procedurally generate a galaxy/nebula sprite texture on a canvas
function createGalaxyTexture(type, hue) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;

  if (type === 'spiral') {
    // Spiral galaxy
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45);
    grad.addColorStop(0, `hsla(${hue}, 40%, 90%, 0.9)`);
    grad.addColorStop(0.15, `hsla(${hue}, 50%, 70%, 0.6)`);
    grad.addColorStop(0.4, `hsla(${hue}, 60%, 40%, 0.25)`);
    grad.addColorStop(0.7, `hsla(${hue}, 40%, 20%, 0.08)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Add spiral arms
    ctx.globalCompositeOperation = 'lighter';
    for (let arm = 0; arm < 2; arm++) {
      for (let i = 0; i < 60; i++) {
        const angle = (arm * Math.PI) + (i / 60) * Math.PI * 2.5;
        const dist = (i / 60) * size * 0.4;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const r = 3 + Math.random() * 5;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
        g2.addColorStop(0, `hsla(${hue + Math.random() * 30}, 50%, 80%, ${0.15 + Math.random() * 0.1})`);
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
  } else if (type === 'elliptical') {
    // Elliptical galaxy — simple glowing blob
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
    grad.addColorStop(0, `hsla(${hue}, 30%, 85%, 0.8)`);
    grad.addColorStop(0.3, `hsla(${hue}, 35%, 55%, 0.35)`);
    grad.addColorStop(0.6, `hsla(${hue}, 25%, 30%, 0.1)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else {
    // Nebula — irregular colorful cloud
    for (let j = 0; j < 15; j++) {
      const x = cx + (Math.random() - 0.5) * size * 0.5;
      const y = cy + (Math.random() - 0.5) * size * 0.5;
      const r = 10 + Math.random() * 25;
      const h = hue + (Math.random() - 0.5) * 60;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `hsla(${h}, 70%, 60%, ${0.12 + Math.random() * 0.08})`);
      grad.addColorStop(0.5, `hsla(${h}, 60%, 40%, ${0.04 + Math.random() * 0.04})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillRect(0, 0, size, size);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const GALAXY_CONFIGS = [
  // Far-off galaxies — scattered in background
  { type: 'spiral', hue: 30, pos: [380, 120, -200], size: 40, rot: 0.3 },
  { type: 'spiral', hue: 210, pos: [-300, 80, -350], size: 30, rot: -0.5 },
  { type: 'elliptical', hue: 50, pos: [200, -100, -400], size: 20, rot: 0 },
  { type: 'nebula', hue: 280, pos: [-250, 160, 300], size: 55, rot: 0.2 },
  { type: 'spiral', hue: 190, pos: [100, -150, 400], size: 25, rot: 1.2 },
  { type: 'nebula', hue: 340, pos: [350, -80, 250], size: 45, rot: -0.3 },
  { type: 'elliptical', hue: 15, pos: [-400, -60, -150], size: 18, rot: 0 },
  { type: 'nebula', hue: 220, pos: [-150, 200, -300], size: 50, rot: 0.8 },
  { type: 'spiral', hue: 120, pos: [280, 180, 200], size: 22, rot: -0.8 },
  { type: 'nebula', hue: 160, pos: [-350, -120, 180], size: 35, rot: 0 },
];

const Galaxies = React.memo(function Galaxies() {
  const textures = useMemo(
    () => GALAXY_CONFIGS.map((g) => createGalaxyTexture(g.type, g.hue)),
    []
  );

  return (
    <group>
      {GALAXY_CONFIGS.map((g, i) => (
        <sprite key={i} position={g.pos} scale={[g.size, g.size, 1]}>
          <spriteMaterial
            map={textures[i]}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
});

export default Galaxies;
