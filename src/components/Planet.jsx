import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import Moons from './Moons';

const textureCache = {};
const J2000_MS = new Date('2000-01-01T12:00:00Z').getTime();
const TEX = '/api/textures';

const PLANET_TEXTURES = {
  mercury: { map: `${TEX}/2k_mercury.jpg`, normal: `${TEX}/2k_mercury.jpg` },
  venus: { map: `${TEX}/2k_venus_surface.jpg`, atmosphere: `${TEX}/2k_venus_atmosphere.jpg` },
  earth: { map: `${TEX}/2k_earth_daymap.jpg`, normal: `${TEX}/2k_earth_normal_map.jpg`, specular: `${TEX}/2k_earth_specular_map.jpg` },
  mars: { map: `${TEX}/2k_mars.jpg`, normal: `${TEX}/2k_mars.jpg` },
  jupiter: { map: `${TEX}/2k_jupiter.jpg` },
  saturn: { map: `${TEX}/2k_saturn.jpg` },
  uranus: { map: `${TEX}/2k_uranus.jpg` },
  neptune: { map: `${TEX}/2k_neptune.jpg` },
  pluto: { map: `${TEX}/2k_makemake_fictional.jpg` },
};

const PLANET_MATERIALS = {
  mercury: { roughness: 0.95, metalness: 0.05, bumpScale: 0.05, emissive: '#1a1510', emissiveIntensity: 0.12 },
  venus:   { roughness: 0.8,  metalness: 0.0,                   emissive: '#2a1a08', emissiveIntensity: 0.15 },
  earth:   { roughness: 0.75, metalness: 0.05, bumpScale: 0.04, emissive: '#081525', emissiveIntensity: 0.12 },
  mars:    { roughness: 0.9,  metalness: 0.0,  bumpScale: 0.05, emissive: '#200800', emissiveIntensity: 0.15 },
  jupiter: { roughness: 0.8,  metalness: 0.0,                   emissive: '#150c04', emissiveIntensity: 0.12 },
  saturn:  { roughness: 0.8,  metalness: 0.0,                   emissive: '#151005', emissiveIntensity: 0.12 },
  uranus:  { roughness: 0.75, metalness: 0.0,                   emissive: '#051215', emissiveIntensity: 0.18 },
  neptune: { roughness: 0.75, metalness: 0.0,                   emissive: '#040828', emissiveIntensity: 0.20 },
  pluto:   { roughness: 0.95, metalness: 0.0,                   emissive: '#10100c', emissiveIntensity: 0.10 },
};

function useTexture(url) {
  const [texture, setTexture] = useState(null);

  React.useEffect(() => {
    if (!url) return;
    if (textureCache[url]) {
      if (textureCache[url] !== 'failed') setTexture(textureCache[url]);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        textureCache[url] = tex;
        setTexture(tex);
      },
      undefined,
      () => {
        textureCache[url] = 'failed';
      }
    );
  }, [url]);

  return texture;
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

  const textureSet = PLANET_TEXTURES[data.id] || { map: data.textureUrl };
  const colorMap = useTexture(textureSet.map || data.textureUrl);
  const normalMap = useTexture(textureSet.normal);
  const specularMap = useTexture(textureSet.specular);
  const ringUrl = data.hasRings ? `${TEX}/2k_saturn_ring_alpha.png` : null;
  const saturnRingMap = useTexture(ringUrl);

  const orbitalPeriod = data.realData.orbitalPeriod_days;
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, [data.id]);

  const segments = 96;
  const matProps = PLANET_MATERIALS[data.id] || PLANET_MATERIALS.mercury;

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

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[data.radius, segments, segments]} />
        <meshStandardMaterial
          map={colorMap || null}
          normalMap={normalMap || null}
          bumpMap={!normalMap ? colorMap || null : null}
          bumpScale={matProps.bumpScale || 0}
          roughnessMap={specularMap || null}
          color={colorMap ? '#ffffff' : data.color}
          emissive={matProps.emissive}
          emissiveIntensity={matProps.emissiveIntensity}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
        />
      </mesh>

      {data.id === 'earth' && (
        <mesh scale={1.04}>
          <sphereGeometry args={[data.radius, 96, 96]} />
          <meshPhongMaterial
            color="#66aaff"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {data.hasRings && (
        <group rotation={[-Math.PI * 0.4, 0, 0]}>
          <mesh>
            <ringGeometry args={[data.radius * 1.25, data.radius * 2.15, 256]} />
            <meshStandardMaterial
              map={saturnRingMap || null}
              color="#d8c08a"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              alphaTest={0.2}
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        </group>
      )}

      {introDone && (
        <Html position={[0, data.radius + 1.1, 0]} center distanceFactor={40}>
          <div className="text-[10px] px-2 py-1 rounded-full bg-black/40 border border-white/10 text-gray-200 pointer-events-none select-none whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      )}

      {data.moons && <Moons parentData={data} />}
    </group>
  );
});

export default Planet;
