import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import Moons from './Moons';

const textureCache = {};

function usePlanetTexture(url, fallbackColor) {
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
  const ringRef = useRef();
  const posRef = useRef(new THREE.Vector3());

  const isPaused = useStore((s) => s.isPaused);
  const speedMultiplier = useStore((s) => s.speedMultiplier);
  const realPositions = useStore((s) => s.realPositions);
  const simDate = useStore((s) => s.simDate);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const introDone = useStore((s) => s.introDone);

  const { texture, failed } = usePlanetTexture(data.textureUrl, data.color);

  // Calculate real position using astronomy-engine (simplified to Keplerian for demo)
  const getRealAngle = useCallback(() => {
    if (!realPositions) return null;
    try {
      const daysSinceJ2000 =
        (simDate.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) /
        86400000;
      const period = data.realData.orbitalPeriod_days;
      return ((daysSinceJ2000 / period) * Math.PI * 2) % (Math.PI * 2);
    } catch {
      return null;
    }
  }, [realPositions, simDate, data]);

  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, [data.id]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    let angle;

    const realAngle = getRealAngle();
    if (realAngle !== null) {
      angle = realAngle;
    } else {
      const speed = isPaused ? 0 : data.orbitalSpeed * speedMultiplier;
      angle = elapsed * speed * 0.2 + angleOffset;
    }

    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;
    groupRef.current.position.set(x, 0, z);
    posRef.current.set(x, 0, z);

    // Planet rotation
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += data.rotationSpeed * speedMultiplier * 0.016;
    }

    // Ring rotation for Saturn
    if (ringRef.current) {
      ringRef.current.rotation.x = -Math.PI * 0.4;
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
      <mesh ref={meshRef} onClick={handleClick} castShadow receiveShadow>
        <sphereGeometry args={[data.radius, 48, 48]} />
        {texture && !failed ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.8}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial
            color={data.color}
            roughness={0.7}
            metalness={0.2}
          />
        )}
      </mesh>

      {/* Saturn rings */}
      {data.hasRings && (
        <mesh ref={ringRef} rotation={[-Math.PI * 0.4, 0, 0]}>
          <ringGeometry args={[data.radius * 1.4, data.radius * 2.4, 128]} />
          <meshStandardMaterial
            color="#c8b080"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
      )}

      {/* Moons */}
      {data.moons && <Moons moons={data.moons} parentRadius={data.radius} isPaused={isPaused} speedMultiplier={speedMultiplier} />}

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
