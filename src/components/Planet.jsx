import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import Moons from './Moons';

const textureCache = {};
const J2000_MS = new Date('2000-01-01T12:00:00Z').getTime();

function usePlanetTexture(url) {
  const [texture, setTexture] = useState(null);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    if (textureCache[url]) {
      setTexture(textureCache[url]);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        textureCache[url] = tex;
        setTexture(tex);
      },
      undefined,
      () => setFailed(true)
    );
  }, [url]);

  return { texture, failed };
}

const Planet = React.memo(function Planet({ data }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const posRef = useRef(new THREE.Vector3());
  const atmosphereRef = useRef();

  const isPaused = useStore((s) => s.isPaused);
  const speedMultiplier = useStore((s) => s.speedMultiplier);
  const realPositions = useStore((s) => s.realPositions);
  const simDate = useStore((s) => s.simDate);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const introDone = useStore((s) => s.introDone);

  const { texture, failed } = usePlanetTexture(data.textureUrl);

  const orbitalPeriod = data.realData.orbitalPeriod_days;
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, [data.id]);

  // Sphere detail based on planet size
  const segments = data.radius > 2 ? 64 : data.radius > 1 ? 48 : 32;

  // Atmosphere color for gas giants and Earth
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

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[data.radius, segments, segments]} />
        {texture && !failed ? (
          <meshPhysicalMaterial
            map={texture}
            roughness={0.85}
            metalness={0.05}
            clearcoat={0.05}
            envMapIntensity={0.3}
          />
        ) : (
          <meshPhysicalMaterial
            color={data.color}
            roughness={0.7}
            metalness={0.15}
            clearcoat={0.1}
          />
        )}
      </mesh>

      {/* Atmosphere glow (for planets with thick atmospheres) */}
      {atmosphereColor && (
        <mesh ref={atmosphereRef} scale={1.03}>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Rim light / Fresnel glow */}
      <mesh scale={1.015}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn rings */}
      {data.hasRings && (
        <mesh rotation={[-Math.PI * 0.4, 0, 0]}>
          <ringGeometry args={[data.radius * 1.3, data.radius * 2.5, 128]} />
          <meshPhysicalMaterial
            color="#d4b878"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            roughness={0.95}
            metalness={0}
          />
        </mesh>
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
