import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUN_DATA } from '../data/planets';
import { SunGlowMaterial } from '../shaders/glowShader';
import useStore from '../store/useStore';

const Sun = React.memo(function Sun() {
  const meshRef = useRef();
  const glowRef = useRef();
  const materialRef = useRef();
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#FDB813') },
      uColor2: { value: new THREE.Color('#ff6600') },
      uIntensity: { value: 1.8 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.03;
    }
    if (glowRef.current) {
      const s = 1.0 + Math.sin(t * 1.5) * 0.02;
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
      {/* Sun sphere with procedural shader */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[SUN_DATA.radius, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={SunGlowMaterial.vertexShader}
          fragmentShader={SunGlowMaterial.fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner corona */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[SUN_DATA.radius * 1.15, 32, 32]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* Outer corona */}
      <mesh>
        <sphereGeometry args={[SUN_DATA.radius * 1.6, 32, 32]} />
        <meshBasicMaterial color="#ff9900" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Faint outermost glow */}
      <mesh>
        <sphereGeometry args={[SUN_DATA.radius * 2.5, 16, 16]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.015} side={THREE.BackSide} />
      </mesh>

      {/* Primary sun light — warm white, strong */}
      <pointLight color="#fff5e0" intensity={4} distance={500} decay={1.5} />
      <pointLight color="#FFD080" intensity={0.8} distance={200} decay={2} />

      {/* Label */}
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
