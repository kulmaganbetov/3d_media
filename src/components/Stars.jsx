import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

const STAR_COUNT = 3000;

// Nearby real stars with data (in Kazakh)
export const NEARBY_STARS = [
  {
    id: 'sirius',
    name: 'Сириус',
    nameEn: 'Sirius',
    color: '#aaccff',
    emissive: '#4466cc',
    radius: 1.2,
    position: [180, 40, -160],
    isStar: true,
    realData: {
      diameter_km: 2390000,
      mass_kg: '3.978 × 10³⁰ (2 M☉)',
      density: 0.58,
      distanceFromSun_km: '8.14 × 10¹³ (8.6 жарық жылы)',
      avgTemperature_c: 9940,
      gravity_ms2: 816,
      description:
        'Сириус — түнгі аспандағы ең жарық жұлдыз. Ол Үлкен Ит (Canis Major) шоқжұлдызында орналасқан. Сириус — екі жұлдыздан тұратын жүйе: Сириус A (негізгі) және Сириус B (ақ ергежейлі).',
      funFacts: [
        'Сириус Күннен 25 есе жарық',
        'Ежелгі Мысырда Ніл тасқынын болжау үшін қолданылған',
        'Сириус B — ақ ергежейлі жұлдыз, Жер көлемімен бірақ Күн массасымен',
        'Жерден 8.6 жарық жыл қашықтықта',
      ],
      spectralClass: 'A1V (ақ)',
      luminosity: '25.4 L☉',
      constellation: 'Үлкен Ит (Canis Major)',
    },
  },
  {
    id: 'alpha-centauri',
    name: 'Альфа Центавр',
    nameEn: 'Alpha Centauri',
    color: '#ffeeaa',
    emissive: '#886622',
    radius: 1.0,
    position: [-200, -30, 140],
    isStar: true,
    realData: {
      diameter_km: 1703000,
      mass_kg: '2.188 × 10³⁰ (1.1 M☉)',
      density: 1.08,
      distanceFromSun_km: '4.07 × 10¹³ (4.37 жарық жылы)',
      avgTemperature_c: 5790,
      gravity_ms2: 295,
      description:
        'Альфа Центавр — Күнге ең жақын жұлдыз жүйесі. Үш жұлдыздан тұрады: Альфа Центавр A, B және Проксима Центавр. Проксима Центавр — ең жақын жұлдыз (4.24 ж.ж.).',
      funFacts: [
        'Күнге ең жақын жұлдыз жүйесі — тек 4.37 жарық жыл',
        'Проксима Центавр — қызыл ергежейлі, экзопланетасы бар',
        'Оңтүстік жарты шардан жақсы көрінеді',
        'A компоненті Күнге өте ұқсас жұлдыз',
      ],
      spectralClass: 'G2V (сары)',
      luminosity: '1.52 L☉',
      constellation: 'Центавр (Centaurus)',
    },
  },
  {
    id: 'betelgeuse',
    name: 'Бетелгейзе',
    nameEn: 'Betelgeuse',
    color: '#ff6633',
    emissive: '#cc3300',
    radius: 1.8,
    position: [140, 120, 200],
    isStar: true,
    realData: {
      diameter_km: 1234000000,
      mass_kg: '2.188 × 10³¹ (11 M☉)',
      density: 0.0000012,
      distanceFromSun_km: '6.1 × 10¹⁵ (650 жарық жылы)',
      avgTemperature_c: 3500,
      gravity_ms2: 0.00047,
      description:
        'Бетелгейзе — Мысықтас (Орион) шоқжұлдызындағы қызыл алып жұлдыз. Күннен 700-1000 есе үлкен. Жақын болашақта аса жаңа жұлдыз (супернова) болып жарылуы мүмкін.',
      funFacts: [
        'Күннің орнына қойсақ, Юпитер орбитасына дейін жетер еді',
        'Жарықтығы тұрақсыз — периодты өзгеріп тұрады',
        'Болашақта супернова болып жарылады',
        'Қызыл түсі — бетінің температурасы төмен болғандықтан',
      ],
      spectralClass: 'M1-M2 (қызыл алып)',
      luminosity: '126,000 L☉',
      constellation: 'Мысықтас (Orion)',
    },
  },
  {
    id: 'vega',
    name: 'Вега',
    nameEn: 'Vega',
    color: '#ccddff',
    emissive: '#5566aa',
    radius: 0.9,
    position: [-150, 160, -120],
    isStar: true,
    realData: {
      diameter_km: 3370000,
      mass_kg: '4.074 × 10³⁰ (2.1 M☉)',
      density: 0.34,
      distanceFromSun_km: '2.37 × 10¹⁴ (25 жарық жылы)',
      avgTemperature_c: 9600,
      gravity_ms2: 537,
      description:
        'Вега — Сүлгі (Lyra) шоқжұлдызындағы ең жарық жұлдыз. 12,000 жыл бұрын Полярлық жұлдыз болған, және 13,700 жылдан кейін қайта болады.',
      funFacts: [
        'Аспандағы ең алғаш фотосуретке түсірілген жұлдыз (1850 ж.)',
        'Тоз дискісі бар — планета жүйесі қалыптасуда',
        'Өз осінен 12.5 сағатта айналады (Күн — 25 күнде)',
        'Жазғы үшбұрыш астеризмінің бір жұлдызы',
      ],
      spectralClass: 'A0V (ақ-көгілдір)',
      luminosity: '40 L☉',
      constellation: 'Сүлгі (Lyra)',
    },
  },
  {
    id: 'polaris',
    name: 'Полярлық жұлдыз',
    nameEn: 'Polaris',
    color: '#ffffcc',
    emissive: '#887744',
    radius: 1.1,
    position: [50, 200, -80],
    isStar: true,
    realData: {
      diameter_km: 70000000,
      mass_kg: '1.093 × 10³¹ (5.4 M☉)',
      density: 0.005,
      distanceFromSun_km: '4.07 × 10¹⁵ (433 жарық жылы)',
      avgTemperature_c: 6000,
      gravity_ms2: 1.5,
      description:
        'Полярлық жұлдыз (Полярис) — Кіші Аю шоқжұлдызының ең жарық жұлдызы. Солтүстік аспан полюсіне жақын орналасқан, сондықтан ғасырлар бойы навигацияда қолданылған.',
      funFacts: [
        'Солтүстік полюстен тура жоғарыда орналасқан',
        'Шын мәнінде 3 жұлдыздан тұратын жүйе',
        'Цефеида — жарықтығы периодты өзгеріп тұрады',
        'Теңізшілер мен саяхатшылар бағдарлау үшін пайдаланған',
      ],
      spectralClass: 'F7Ib (сары асп алып)',
      luminosity: '1,260 L☉',
      constellation: 'Кіші Аю (Ursa Minor)',
    },
  },
  {
    id: 'rigel',
    name: 'Ригель',
    nameEn: 'Rigel',
    color: '#aabbff',
    emissive: '#4455bb',
    radius: 1.4,
    position: [220, -80, -180],
    isStar: true,
    realData: {
      diameter_km: 108000000,
      mass_kg: '4.375 × 10³¹ (21 M☉)',
      density: 0.0002,
      distanceFromSun_km: '7.87 × 10¹⁵ (860 жарық жылы)',
      avgTemperature_c: 12100,
      gravity_ms2: 24,
      description:
        'Ригель — Мысықтас (Орион) шоқжұлдызының ең жарық жұлдызы. Көгілдір асп алып жұлдыз, Күннен 120,000 есе жарық. Аспандағы ең жарық жұлдыздардың бірі.',
      funFacts: [
        'Күннен 120,000 есе жарық',
        'Бетелгейзеден жарығырақ, бірақ алысырақ',
        'Көгілдір түсі — бетінің температурасы өте жоғары',
        'Болашақта супернова болып жарылуы мүмкін',
      ],
      spectralClass: 'B8Ia (көгілдір асп алып)',
      luminosity: '120,000 L☉',
      constellation: 'Мысықтас (Orion)',
    },
  },
  {
    id: 'antares',
    name: 'Антарес',
    nameEn: 'Antares',
    color: '#ff4422',
    emissive: '#aa2200',
    radius: 1.6,
    position: [-180, -100, 220],
    isStar: true,
    realData: {
      diameter_km: 946000000,
      mass_kg: '2.387 × 10³¹ (12 M☉)',
      density: 0.0000034,
      distanceFromSun_km: '5.52 × 10¹⁵ (550 жарық жылы)',
      avgTemperature_c: 3400,
      gravity_ms2: 0.00057,
      description:
        'Антарес — Сарышаян (Scorpius) шоқжұлдызының жүрегіндегі қызыл алып жұлдыз. Аты «Марстың қарсыласы» дегенді білдіреді, себебі қызыл түсімен Марсқа ұқсайды.',
      funFacts: [
        'Аты грекше «анти-Арес» — Марстың қарсыласы',
        'Күннің орнына қойсақ, Марс орбитасынан асар еді',
        'Қызыл түсін жалаңаш көзбен көруге болады',
        'Серігі бар — Антарес B (көгілдір жұлдыз)',
      ],
      spectralClass: 'M1.5Iab (қызыл асп алып)',
      luminosity: '75,900 L☉',
      constellation: 'Сарышаян (Scorpius)',
    },
  },
];

// Background star field (unchanged)
const StarField = React.memo(function StarField() {
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const introDone = useStore((s) => s.introDone);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 350 + Math.random() * 150;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const r = Math.random();
      if (r < 0.55) {
        const b = 0.85 + Math.random() * 0.15;
        col[i * 3] = b;
        col[i * 3 + 1] = b;
        col[i * 3 + 2] = b + 0.05;
      } else if (r < 0.75) {
        col[i * 3] = 0.7 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.75 + Math.random() * 0.15;
        col[i * 3 + 2] = 1.0;
      } else if (r < 0.9) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.15;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.6 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.4 + Math.random() * 0.2;
      }
    }

    return { positions: pos, colors: col };
  }, []);

  const handleStarClick = (star, e) => {
    e.stopPropagation();
    setSelectedPlanet(star);
    setCameraTarget({
      position: { x: star.position[0], y: star.position[1], z: star.position[2] },
      radius: star.radius * 3,
    });
  };

  return (
    <group>
      {/* Background points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={STAR_COUNT}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.8}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Named nearby stars — clickable 3D spheres with glow */}
      {NEARBY_STARS.map((star) => (
        <group key={star.id} position={star.position}>
          {/* Star body */}
          <mesh onClick={(e) => handleStarClick(star, e)}>
            <sphereGeometry args={[star.radius, 24, 24]} />
            <meshBasicMaterial color={star.color} />
          </mesh>

          {/* Inner glow */}
          <mesh>
            <sphereGeometry args={[star.radius * 2.0, 16, 16]} />
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[star.radius * 4.0, 12, 12]} />
            <meshBasicMaterial
              color={star.emissive}
              transparent
              opacity={0.05}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Label */}
          {introDone && (
            <Html position={[0, star.radius * 2.5, 0]} center distanceFactor={80}>
              <div
                className="text-xs font-medium pointer-events-none select-none whitespace-nowrap"
                style={{
                  color: star.color,
                  textShadow: `0 0 8px ${star.emissive}`,
                }}
              >
                {star.name}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
});

export default StarField;
