import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUN_DATA } from '../data/planets';
import useStore from '../store/useStore';

const textureCache = {};

function useTexture(url) {
  const [texture, setTexture] = React.useState(null);

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

const Sun = React.memo(function Sun() {
  const meshRef = useRef();
  const glowRef = useRef();
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const sunTexture = useTexture(SUN_DATA.textureUrl);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.02;
    if (glowRef.current) {
      const s = 1.0 + Math.sin(t * 1.4) * 0.025;
      glowRef.current.scale.setScalar(s);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPlanet({ ...SUN_DATA, id: 'sun', isSun: true });
    setCameraTarget({ position: new THREE.Vector3(0, 0, 0), radius: SUN_DATA.radius });
  };

  return (
    <group>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[SUN_DATA.radius, 128, 128]} />
        <meshBasicMaterial map={sunTexture || null} color={sunTexture ? '#ffffff' : '#FDB813'} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[SUN_DATA.radius * 1.2, 64, 64]} />
        <meshBasicMaterial color="#ffbb55" transparent opacity={0.16} side={THREE.BackSide} />
      </mesh>

      <pointLight color="#fff5d6" intensity={12} distance={0} decay={0.8} />

      <Html position={[0, SUN_DATA.radius + 2, 0]} center distanceFactor={60}>
        <div
          className="text-yellow-300 text-sm font-semibold pointer-events-none select-none whitespace-nowrap"
          style={{ textShadow: '0 0 10px rgba(253,184,19,0.8)' }}
        >
          {SUN_DATA.name}
        </div>
      </Html>
    </group>
  );
});

export default Sun;
