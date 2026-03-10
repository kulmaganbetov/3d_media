import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthExtras({ earthRadius }) {
  const issOrbitRef = useRef();
  const astronautRef = useRef();
  const solarPanelGeom = useMemo(() => new THREE.BoxGeometry(0.34, 0.015, 0.12), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (issOrbitRef.current) {
      issOrbitRef.current.rotation.y += 0.006;
      issOrbitRef.current.rotation.z = Math.sin(t * 0.3) * 0.06;
    }

    if (astronautRef.current) {
      astronautRef.current.position.y = earthRadius * 1.45 + Math.sin(t * 1.4) * 0.05;
      astronautRef.current.rotation.y += 0.005;
      astronautRef.current.rotation.z = Math.sin(t * 1.2) * 0.1;
    }
  });

  return (
    <>
      <group ref={issOrbitRef} rotation={[0.35, 0, 0.2]}>
        <group position={[earthRadius * 1.55, 0.03, 0]} scale={[0.65, 0.65, 0.65]}>
          <mesh>
            <boxGeometry args={[0.34, 0.16, 0.16]} />
            <meshStandardMaterial color="#d6d8de" metalness={0.75} roughness={0.3} />
          </mesh>

          <mesh position={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.28, 18]} />
            <meshStandardMaterial color="#bcc4d0" metalness={0.65} roughness={0.35} />
          </mesh>

          <mesh position={[-0.25, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.24, 18]} />
            <meshStandardMaterial color="#b8c0cd" metalness={0.6} roughness={0.4} />
          </mesh>

          <mesh geometry={solarPanelGeom} position={[0, 0, 0.22]}>
            <meshStandardMaterial color="#2d5aa5" emissive="#1d3258" emissiveIntensity={0.25} metalness={0.2} roughness={0.55} />
          </mesh>
          <mesh geometry={solarPanelGeom} position={[0, 0, -0.22]}>
            <meshStandardMaterial color="#2d5aa5" emissive="#1d3258" emissiveIntensity={0.25} metalness={0.2} roughness={0.55} />
          </mesh>
        </group>
      </group>

      <group ref={astronautRef} position={[earthRadius * 1.3, earthRadius * 1.45, 0.2]} scale={[0.35, 0.35, 0.35]}>
        <mesh>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshStandardMaterial color="#f0f3f8" metalness={0.08} roughness={0.7} />
        </mesh>

        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.1, 0.22, 8, 14]} />
          <meshStandardMaterial color="#f3f5f9" metalness={0.05} roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.16, 0.11]}>
          <boxGeometry args={[0.12, 0.13, 0.06]} />
          <meshStandardMaterial color="#dce3ed" roughness={0.75} metalness={0.08} />
        </mesh>

        <mesh position={[0.16, -0.19, 0]} rotation={[0, 0, -0.55]}>
          <capsuleGeometry args={[0.03, 0.18, 5, 8]} />
          <meshStandardMaterial color="#f3f5f9" roughness={0.8} />
        </mesh>
        <mesh position={[-0.16, -0.19, 0]} rotation={[0, 0, 0.55]}>
          <capsuleGeometry args={[0.03, 0.18, 5, 8]} />
          <meshStandardMaterial color="#f3f5f9" roughness={0.8} />
        </mesh>

        <mesh position={[0.07, -0.45, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 5, 8]} />
          <meshStandardMaterial color="#e9edf4" roughness={0.82} />
        </mesh>
        <mesh position={[-0.07, -0.45, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 5, 8]} />
          <meshStandardMaterial color="#e9edf4" roughness={0.82} />
        </mesh>

        <mesh position={[0, 0.01, 0.09]}>
          <sphereGeometry args={[0.065, 20, 20]} />
          <meshStandardMaterial color="#2b3c63" emissive="#1a2644" emissiveIntensity={0.35} metalness={0.6} roughness={0.2} transparent opacity={0.82} />
        </mesh>
      </group>
    </>
  );
}
