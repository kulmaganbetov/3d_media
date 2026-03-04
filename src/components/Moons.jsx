import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../store/useStore';

function Moon({ moon, isPaused, speedMultiplier }) {
  const ref = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const introDone = useStore((s) => s.introDone);

  useFrame((_, delta) => {
    if (!ref.current || isPaused) return;
    angleRef.current += moon.speed * speedMultiplier * delta;
    const x = Math.cos(angleRef.current) * moon.distance;
    const z = Math.sin(angleRef.current) * moon.distance;
    ref.current.position.set(x, 0, z);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (moon.realData) {
      setSelectedPlanet(moon);
    }
  };

  return (
    <group ref={ref}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[moon.radius, 24, 24]} />
        <meshStandardMaterial
          color={moon.color}
          emissive={moon.color}
          emissiveIntensity={0.08}
          roughness={0.85}
        />
      </mesh>

      {/* Moon label */}
      {introDone && moon.realData && (
        <Html position={[0, moon.radius + 0.3, 0]} center distanceFactor={20}>
          <div
            className="text-[9px] text-gray-400 font-medium pointer-events-none select-none whitespace-nowrap"
            style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
          >
            {moon.name}
          </div>
        </Html>
      )}
    </group>
  );
}

const Moons = React.memo(function Moons({ moons, parentRadius, isPaused, speedMultiplier }) {
  return (
    <group>
      {moons.map((moon) => (
        <Moon key={moon.name} moon={moon} isPaused={isPaused} speedMultiplier={speedMultiplier} />
      ))}
    </group>
  );
});

export default Moons;
