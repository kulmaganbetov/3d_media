import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Moon({ moon, isPaused, speedMultiplier }) {
  const ref = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current || isPaused) return;
    angleRef.current += moon.speed * speedMultiplier * delta;
    const x = Math.cos(angleRef.current) * moon.distance;
    const z = Math.sin(angleRef.current) * moon.distance;
    ref.current.position.set(x, 0, z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[moon.radius, 24, 24]} />
      <meshStandardMaterial color={moon.color} roughness={0.8} />
    </mesh>
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
