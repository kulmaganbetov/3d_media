import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import Moons from './Moons';

const textureCache = {};
const J2000_MS = new Date('2000-01-01T12:00:00Z').getTime();

// Planet-specific material properties for realistic look without textures
const PLANET_MATERIALS = {
  mercury: { emissive: '#2a2420', emissiveI: 0.08, roughness: 0.95, metalness: 0.1 },
  venus:   { emissive: '#3a2810', emissiveI: 0.12, roughness: 0.6, metalness: 0.0 },
  earth:   { emissive: '#0a1530', emissiveI: 0.1, roughness: 0.7, metalness: 0.05 },
  mars:    { emissive: '#2a0800', emissiveI: 0.1, roughness: 0.9, metalness: 0.05 },
  jupiter: { emissive: '#1a1008', emissiveI: 0.1, roughness: 0.5, metalness: 0.0 },
  saturn:  { emissive: '#1a1508', emissiveI: 0.1, roughness: 0.5, metalness: 0.0 },
  uranus:  { emissive: '#081820', emissiveI: 0.15, roughness: 0.4, metalness: 0.0 },
  neptune: { emissive: '#080830', emissiveI: 0.15, roughness: 0.4, metalness: 0.0 },
  pluto:   { emissive: '#181510', emissiveI: 0.08, roughness: 0.9, metalness: 0.05 },
};

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mixColor(a, b, t) {
  return new THREE.Color(a).lerp(new THREE.Color(b), t);
}

function createPlanetPatternTexture(planetId, baseColor) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(hashString(planetId));

  const base = new THREE.Color(baseColor);
  const dark = mixColor(base, '#050505', 0.35);
  const light = mixColor(base, '#ffffff', 0.2);

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, `#${dark.getHexString()}`);
  bg.addColorStop(0.5, `#${base.getHexString()}`);
  bg.addColorStop(1, `#${light.getHexString()}`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  const drawNoise = (count, alpha, radius) => {
    for (let i = 0; i < count; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = radius * (0.4 + rand());
      const c = mixColor(dark, light, rand());
      ctx.fillStyle = `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawBands = (count, amp, thickness, alpha) => {
    for (let i = 0; i < count; i++) {
      const y = (i / count) * size;
      const curve = (rand() - 0.5) * amp;
      const c = mixColor(dark, light, rand());
      ctx.fillStyle = `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(size * 0.5, y + curve, size, y);
      ctx.lineTo(size, y + thickness);
      ctx.quadraticCurveTo(size * 0.5, y + thickness + curve, 0, y + thickness);
      ctx.closePath();
      ctx.fill();
    }
  };

  if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(planetId)) {
    drawBands(28, 20, 26, 0.33);
    drawNoise(250, 0.08, 12);
  } else if (planetId === 'earth') {
    drawNoise(150, 0.25, 20);
    ctx.fillStyle = 'rgba(240, 240, 255, 0.22)';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(rand() * size, rand() * size, 16 + rand() * 26, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planetId === 'venus') {
    drawNoise(260, 0.16, 18);
    drawBands(20, 14, 22, 0.18);
  } else {
    drawNoise(350, 0.18, 14);
    for (let i = 0; i < 28; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 12 + rand() * 28;
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  return texture;
}

function usePlanetTexture(url) {
  const [texture, setTexture] = useState(null);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    if (!url) { setFailed(true); return; }
    if (textureCache[url]) {
      if (textureCache[url] === 'failed') { setFailed(true); return; }
      setTexture(textureCache[url]);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // Timeout — if texture doesn't load in 8s, use fallback
    const timeout = setTimeout(() => {
      textureCache[url] = 'failed';
      setFailed(true);
    }, 8000);

    loader.load(
      url,
      (tex) => {
        clearTimeout(timeout);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        textureCache[url] = tex;
        setTexture(tex);
      },
      undefined,
      () => {
        clearTimeout(timeout);
        textureCache[url] = 'failed';
        setFailed(true);
      }
    );

    return () => clearTimeout(timeout);
  }, [url]);

  return { texture, failed };
}

const Planet = React.memo(function Planet({ data }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const posRef = useRef(new THREE.Vector3());

  const isPaused = useStore((s) => s.isPaused);
  const speedMultiplier = useStore((s) => s.speedMultiplier);
  const realPositions = useStore((s) => s.realPositions);
  const simDate = useStore((s) => s.simDate);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const introDone = useStore((s) => s.introDone);

  const { texture, failed } = usePlanetTexture(data.textureUrl);
  const fallbackTexture = useMemo(
    () => createPlanetPatternTexture(data.id, data.color),
    [data.id, data.color]
  );

  const orbitalPeriod = data.realData.orbitalPeriod_days;
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, [data.id]);

  const segments = data.radius > 2 ? 64 : data.radius > 1 ? 48 : 32;

  const matProps = PLANET_MATERIALS[data.id] || PLANET_MATERIALS.mercury;

  // Atmosphere color for planets with thick atmospheres
  const atmosphereColor = useMemo(() => {
    const colors = {
      earth: '#4488ff',
      venus: '#e8a050',
      jupiter: '#c89040',
      saturn: '#d4b060',
      uranus: '#60ccee',
      neptune: '#3366dd',
    };
    return colors[data.id] || null;
  }, [data.id]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    let angle;

    if (realPositions && simDate) {
      const daysSinceJ2000 = (simDate.getTime() - J2000_MS) / 86400000;
      angle = ((daysSinceJ2000 / orbitalPeriod) * Math.PI * 2) % (Math.PI * 2);
    } else {
      const speed = isPaused ? 0 : data.orbitalSpeed * speedMultiplier;
      angle = elapsed * speed * 0.2 + angleOffset;
    }

    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;
    groupRef.current.position.set(x, 0, z);
    posRef.current.set(x, 0, z);

    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += data.rotationSpeed * speedMultiplier * 0.016;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPlanet(data);
    setCameraTarget({ position: posRef.current.clone(), radius: data.radius });
  };

  const effectiveTexture = texture && !failed ? texture : fallbackTexture;

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[data.radius, segments, segments]} />
        <meshStandardMaterial
          map={effectiveTexture}
          color={data.color}
          emissive={matProps.emissive}
          emissiveIntensity={texture && !failed ? matProps.emissiveI * 0.5 : matProps.emissiveI}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
        />
      </mesh>

      {/* Atmosphere glow */}
      {atmosphereColor && (
        <mesh scale={1.04}>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Rim light */}
      <mesh scale={1.02}>
        <sphereGeometry args={[data.radius, 24, 24]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn rings */}
      {data.hasRings && (
        <group rotation={[-Math.PI * 0.4, 0, 0]}>
          <mesh>
            <ringGeometry args={[data.radius * 1.3, data.radius * 1.8, 128]} />
            <meshStandardMaterial
              color="#d4b878"
              emissive="#2a2010"
              emissiveIntensity={0.15}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[data.radius * 1.85, data.radius * 2.3, 128]} />
            <meshStandardMaterial
              color="#c0a060"
              emissive="#1a1508"
              emissiveIntensity={0.1}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[data.radius * 2.35, data.radius * 2.6, 128]} />
            <meshStandardMaterial
              color="#a8905a"
              emissive="#100c05"
              emissiveIntensity={0.08}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Moons */}
      {data.moons && (
        <Moons
          moons={data.moons}
          parentRadius={data.radius}
          isPaused={isPaused}
          speedMultiplier={speedMultiplier}
        />
      )}

      {/* Label */}
      {introDone && (
        <Html position={[0, data.radius + 0.8, 0]} center distanceFactor={40}>
          <div
            className="text-accent text-xs font-medium pointer-events-none select-none whitespace-nowrap"
            style={{ textShadow: '0 0 8px rgba(0,212,255,0.6)' }}
          >
            {data.name}
            {data.isDwarf && (
              <span className="text-gray-500 text-[10px] ml-1">(ергежейлі)</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
});

export default Planet;
