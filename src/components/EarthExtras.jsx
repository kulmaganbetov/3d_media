import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';

export const ISS_DATA = {
  id: 'iss',
  name: 'ХҒС (МКС)',
  nameEn: 'International Space Station',
  color: '#b0c4de',
  isISS: true,
  realData: {
    diameter_km: '109 × 73 м',
    mass_kg: '420 000',
    density: '—',
    distanceFromSun_km: '408 км (Жерден)',
    avgTemperature_c: '−157-дан +121-ге дейін',
    gravity_ms2: '~0 (микрогравитация)',
    description:
      'Халықаралық ғарыш станциясы (ХҒС) — Жер орбитасындағы ең ірі адам жасаған құрылым. 1998 жылдан бері құрастырылып, 2000 жылдан бері адамдар тұрақты тұрады. 16 елдің ғарыш агенттіктері бірлесіп жасаған.',
    funFacts: [
      'ХҒС Жерді тәулігіне 16 рет айналады — сағатына 28 000 км жылдамдықпен',
      'Станция ішінде 6 зертхана модулі бар',
      'ХҒС-ды Жерден жалаңаш көзбен көруге болады — ең жарық жасанды нысан',
      'Станцияда 260-тан астам адам болған (20+ елден)',
      'Күн панельдерінің ауданы — футбол алаңындай (2 500 м²)',
      'ХҒС-тың жалпы құны — $150 миллиардтан астам',
    ],
    missions: [
      'Зарья модулі — алғашқы блок (1998)',
      'Экипаж-1 (2000) — тұрақты адам тұруы басталды',
      'Коламбус зертханасы (ESA, 2008)',
      'Кібо зертханасы (JAXA, 2009)',
      'SpaceX Crew Dragon (2020-қазіргі)',
      'Artemis бағдарламасымен байланысты зерттеулер',
    ],
  },
};

function ISSModel({ earthRadius }) {
  const issGroupRef = useRef();
  const issOrbitRef = useRef();
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);

  // Materials
  const hullMat = useMemo(
    () => ({ color: '#d6d8de', metalness: 0.75, roughness: 0.3 }),
    []
  );
  const solarMat = useMemo(
    () => ({
      color: '#1e4a8a',
      emissive: '#0d2244',
      emissiveIntensity: 0.35,
      metalness: 0.3,
      roughness: 0.5,
    }),
    []
  );
  const radiatorMat = useMemo(
    () => ({ color: '#f0e8d8', metalness: 0.1, roughness: 0.9 }),
    []
  );
  const moduleMat = useMemo(
    () => ({ color: '#c8ccd4', metalness: 0.6, roughness: 0.35 }),
    []
  );
  const goldMat = useMemo(
    () => ({
      color: '#c8a830',
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#504010',
      emissiveIntensity: 0.15,
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (issOrbitRef.current) {
      issOrbitRef.current.rotation.y += 0.005;
      issOrbitRef.current.rotation.z = Math.sin(t * 0.2) * 0.04;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPlanet(ISS_DATA);
    // Camera target near Earth
    setCameraTarget({
      position: { x: 24, y: 0, z: 0 },
      radius: 0.76,
    });
  };

  const orbitR = earthRadius * 1.55;

  return (
    <group ref={issOrbitRef} rotation={[0.4, 0, 0.15]}>
      <group
        ref={issGroupRef}
        position={[orbitR, 0.03, 0]}
        scale={[0.55, 0.55, 0.55]}
      >
        {/* === MAIN TRUSS (ITS — Integrated Truss Structure) === */}
        <mesh>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
          <meshStandardMaterial {...hullMat} />
        </mesh>

        {/* Center node (Unity/Harmony) */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial {...moduleMat} />
        </mesh>

        {/* === PRESSURIZED MODULES === */}
        {/* Destiny Lab (US) */}
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.07, 0.28, 8, 14]} />
          <meshStandardMaterial {...moduleMat} />
        </mesh>

        {/* Columbus Lab (ESA) */}
        <mesh position={[0.22, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.06, 0.2, 8, 14]} />
          <meshStandardMaterial color="#c0c8d8" metalness={0.55} roughness={0.4} />
        </mesh>

        {/* Kibo Lab (JAXA) */}
        <mesh position={[-0.24, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.065, 0.22, 8, 14]} />
          <meshStandardMaterial color="#d0d4dc" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Zarya / FGB */}
        <mesh position={[0, -0.15, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.065, 0.2, 8, 14]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>

        {/* Zvezda Service Module */}
        <mesh position={[0, -0.15, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.06, 0.18, 8, 14]} />
          <meshStandardMaterial color="#b8bcc4" metalness={0.65} roughness={0.3} />
        </mesh>

        {/* === SOLAR ARRAYS (4 pairs = 8 panels) === */}
        {/* Starboard arrays */}
        {[0.45, 0.7].map((x, i) => (
          <group key={`s-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 0, 0.22]}>
              <boxGeometry args={[0.22, 0.012, 0.38]} />
              <meshStandardMaterial {...solarMat} />
            </mesh>
            <mesh position={[0, 0, -0.22]}>
              <boxGeometry args={[0.22, 0.012, 0.38]} />
              <meshStandardMaterial {...solarMat} />
            </mesh>
          </group>
        ))}
        {/* Port arrays */}
        {[-0.45, -0.7].map((x, i) => (
          <group key={`p-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 0, 0.22]}>
              <boxGeometry args={[0.22, 0.012, 0.38]} />
              <meshStandardMaterial {...solarMat} />
            </mesh>
            <mesh position={[0, 0, -0.22]}>
              <boxGeometry args={[0.22, 0.012, 0.38]} />
              <meshStandardMaterial {...solarMat} />
            </mesh>
          </group>
        ))}

        {/* === RADIATOR PANELS === */}
        <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.008]} />
          <meshStandardMaterial {...radiatorMat} />
        </mesh>
        <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.008]} />
          <meshStandardMaterial {...radiatorMat} />
        </mesh>
        <mesh position={[0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.08, 0.18, 0.008]} />
          <meshStandardMaterial {...radiatorMat} />
        </mesh>
        <mesh position={[-0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.08, 0.18, 0.008]} />
          <meshStandardMaterial {...radiatorMat} />
        </mesh>

        {/* === DOCKING PORTS (small cylinders) === */}
        <mesh position={[0, -0.32, 0.38]}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
          <meshStandardMaterial color="#aab0b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
          <meshStandardMaterial color="#aab0b8" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* === CANADARM2 (robotic arm) === */}
        <group position={[0.1, -0.08, 0]}>
          <mesh position={[0, 0, 0.08]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.2, 6]} />
            <meshStandardMaterial color="#e8e8e8" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.06, 0.18]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.18, 6]} />
            <meshStandardMaterial color="#e8e8e8" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>

        {/* Invisible click-target covering the whole ISS */}
        <mesh onClick={handleClick}>
          <boxGeometry args={[1.8, 0.5, 0.9]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function Astronaut({ earthRadius }) {
  const astronautRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (astronautRef.current) {
      astronautRef.current.position.y =
        earthRadius * 1.45 + Math.sin(t * 1.4) * 0.05;
      astronautRef.current.rotation.y += 0.005;
      astronautRef.current.rotation.z = Math.sin(t * 1.2) * 0.1;
    }
  });

  return (
    <group
      ref={astronautRef}
      position={[earthRadius * 1.3, earthRadius * 1.45, 0.2]}
      scale={[0.35, 0.35, 0.35]}
    >
      {/* Helmet */}
      <mesh>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial
          color="#f0f3f8"
          metalness={0.08}
          roughness={0.7}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, -0.18, 0]}>
        <capsuleGeometry args={[0.1, 0.22, 8, 14]} />
        <meshStandardMaterial
          color="#f3f5f9"
          metalness={0.05}
          roughness={0.8}
        />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, -0.16, 0.11]}>
        <boxGeometry args={[0.12, 0.13, 0.06]} />
        <meshStandardMaterial
          color="#dce3ed"
          roughness={0.75}
          metalness={0.08}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.16, -0.19, 0]} rotation={[0, 0, -0.55]}>
        <capsuleGeometry args={[0.03, 0.18, 5, 8]} />
        <meshStandardMaterial color="#f3f5f9" roughness={0.8} />
      </mesh>
      <mesh position={[-0.16, -0.19, 0]} rotation={[0, 0, 0.55]}>
        <capsuleGeometry args={[0.03, 0.18, 5, 8]} />
        <meshStandardMaterial color="#f3f5f9" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.07, -0.45, 0]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.035, 0.18, 5, 8]} />
        <meshStandardMaterial color="#e9edf4" roughness={0.82} />
      </mesh>
      <mesh position={[-0.07, -0.45, 0]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.035, 0.18, 5, 8]} />
        <meshStandardMaterial color="#e9edf4" roughness={0.82} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 0.01, 0.09]}>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshStandardMaterial
          color="#2b3c63"
          emissive="#1a2644"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.82}
        />
      </mesh>
    </group>
  );
}

export default function EarthExtras({ earthRadius }) {
  return (
    <>
      <ISSModel earthRadius={earthRadius} />
      <Astronaut earthRadius={earthRadius} />
    </>
  );
}
