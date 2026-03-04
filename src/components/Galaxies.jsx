import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

// Procedurally generate galaxy sprite texture
function createGalaxyTexture(type, hue) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  if (type === 'spiral') {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45);
    grad.addColorStop(0, `hsla(${hue}, 40%, 90%, 0.9)`);
    grad.addColorStop(0.15, `hsla(${hue}, 50%, 70%, 0.6)`);
    grad.addColorStop(0.4, `hsla(${hue}, 60%, 40%, 0.25)`);
    grad.addColorStop(0.7, `hsla(${hue}, 40%, 20%, 0.08)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'lighter';
    for (let arm = 0; arm < 2; arm++) {
      for (let i = 0; i < 60; i++) {
        const angle = (arm * Math.PI) + (i / 60) * Math.PI * 2.5;
        const dist = (i / 60) * size * 0.4;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const r = 3 + Math.random() * 5;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
        g2.addColorStop(0, `hsla(${hue + Math.random() * 30}, 50%, 80%, ${0.15 + Math.random() * 0.1})`);
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
  } else if (type === 'elliptical') {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
    grad.addColorStop(0, `hsla(${hue}, 30%, 85%, 0.8)`);
    grad.addColorStop(0.3, `hsla(${hue}, 35%, 55%, 0.35)`);
    grad.addColorStop(0.6, `hsla(${hue}, 25%, 30%, 0.1)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else {
    // Irregular
    for (let j = 0; j < 20; j++) {
      const x = cx + (Math.random() - 0.5) * size * 0.6;
      const y = cy + (Math.random() - 0.5) * size * 0.6;
      const r = 8 + Math.random() * 20;
      const h = hue + (Math.random() - 0.5) * 50;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `hsla(${h}, 70%, 60%, ${0.15 + Math.random() * 0.1})`);
      grad.addColorStop(0.5, `hsla(${h}, 60%, 40%, ${0.05 + Math.random() * 0.05})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillRect(0, 0, size, size);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// 6 real galaxies with data in Kazakh
export const GALAXY_DATA = [
  {
    id: 'andromeda',
    name: 'Андромеда галактикасы',
    nameEn: 'Andromeda Galaxy (M31)',
    type: 'spiral',
    hue: 220,
    pos: [380, 100, -250],
    size: 55,
    color: '#8899cc',
    isGalaxy: true,
    realData: {
      diameter_km: '2.0 × 10¹⁸ (220,000 жарық жылы)',
      mass_kg: '1.5 × 10⁴² (1.5 трлн M☉)',
      distanceFromSun_km: '2.37 × 10¹⁹ (2.537 млн жарық жылы)',
      avgTemperature_c: '—',
      description:
        'Андромеда (M31) — Құс жолы галактикасына ең жақын спиральді галактика. Жалаңаш көзбен көруге болады. Шамамен 4.5 миллиард жылдан кейін Құс жолымен бірігеді.',
      funFacts: [
        'Жалаңаш көзбен көрінетін ең алыс нысан',
        'Шамамен 1 триллион жұлдыз бар',
        '4.5 млрд жылдан кейін Құс жолымен бірігеді',
        'Диаметрі Құс жолынан 2 есе үлкен',
        '1920-жылдарға дейін «тұмандық» деп саналды',
      ],
      galaxyType: 'SA(s)b — спиральді',
      starCount: '~1 триллион',
      constellation: 'Андромеда (Andromeda)',
    },
  },
  {
    id: 'milky-way-ref',
    name: 'Құс жолы (біздің)',
    nameEn: 'Milky Way (reference)',
    type: 'spiral',
    hue: 35,
    pos: [-320, 60, -300],
    size: 50,
    color: '#ccbb88',
    isGalaxy: true,
    realData: {
      diameter_km: '9.5 × 10¹⁷ (105,700 жарық жылы)',
      mass_kg: '1.15 × 10⁴² (1.15 трлн M☉)',
      distanceFromSun_km: '0 (біз ішіндеміз)',
      avgTemperature_c: '—',
      description:
        'Құс жолы — біздің Күн жүйесі орналасқан спиральді галактика. Ортасында асп қара тесік — Sagittarius A* бар. 100-400 миллиард жұлдыздан тұрады.',
      funFacts: [
        'Біздің Күн жүйесі шеткі спираль тармағында',
        'Орталығында 4 млн Күн массалы қара тесік бар',
        'Жарық бір шетінен екіншісіне 100,000 жылда жетеді',
        'Күн галактика айналасын 225-250 млн жылда айналады',
        'Шамамен 13.6 миллиард жасында',
      ],
      galaxyType: 'SBbc — тілімше спиральді',
      starCount: '100-400 миллиард',
      constellation: '— (біз ішіндеміз)',
    },
  },
  {
    id: 'triangulum',
    name: 'Үшбұрыш галактикасы',
    nameEn: 'Triangulum Galaxy (M33)',
    type: 'spiral',
    hue: 200,
    pos: [200, 150, 300],
    size: 35,
    color: '#7799bb',
    isGalaxy: true,
    realData: {
      diameter_km: '5.7 × 10¹⁷ (61,000 жарық жылы)',
      mass_kg: '5 × 10⁴⁰ (50 млрд M☉)',
      distanceFromSun_km: '2.73 × 10¹⁹ (2.73 млн жарық жылы)',
      avgTemperature_c: '—',
      description:
        'Үшбұрыш галактикасы (M33) — Жергілікті топтағы үшінші ірі галактика. Андромедаға серік галактика болуы мүмкін. Белсенді жұлдыз қалыптасу аймақтары бар.',
      funFacts: [
        'Жергілікті топтағы 3-ші ірі галактика',
        'Жалаңаш көзбен өте қараңғы жерде ғана көрінеді',
        'Ішінде NGC 604 — ең ірі жұлдыз қалыптасу тұмандығы бар',
        'Шамамен 40 миллиард жұлдыз бар',
      ],
      galaxyType: 'SA(s)cd — спиральді',
      starCount: '~40 миллиард',
      constellation: 'Үшбұрыш (Triangulum)',
    },
  },
  {
    id: 'sombrero',
    name: 'Сомбреро галактикасы',
    nameEn: 'Sombrero Galaxy (M104)',
    type: 'elliptical',
    hue: 40,
    pos: [-250, -120, 200],
    size: 30,
    color: '#ddcc88',
    isGalaxy: true,
    realData: {
      diameter_km: '4.7 × 10¹⁷ (49,000 жарық жылы)',
      mass_kg: '8 × 10⁴¹ (800 млрд M☉)',
      distanceFromSun_km: '2.84 × 10²⁰ (29.3 млн жарық жылы)',
      avgTemperature_c: '—',
      description:
        'Сомбреро галактикасы (M104) — мексикалық қалпақ тәрізді ерекше пішінімен танымал. Жарқын ядросы мен қараңғы шаң белдеуі бар. Орталығында асп қара тесік бар.',
      funFacts: [
        'Мексикалық қалпақ сияқты пішіні бар',
        'Орталық қара тесігінің массасы — 1 млрд Күн',
        '2000-ге жуық шар тәрізді жұлдыз шоғыры бар',
        'Хаббл телескопының ең әйгілі суреттерінің бірі',
      ],
      galaxyType: 'SA(s)a — спиральді-линзалық',
      starCount: '~100 миллиард',
      constellation: 'Мекен (Virgo)',
    },
  },
  {
    id: 'whirlpool',
    name: 'Құйын галактикасы',
    nameEn: 'Whirlpool Galaxy (M51)',
    type: 'spiral',
    hue: 260,
    pos: [300, -60, -180],
    size: 38,
    color: '#9988cc',
    isGalaxy: true,
    realData: {
      diameter_km: '7.6 × 10¹⁷ (76,000 жарық жылы)',
      mass_kg: '3.2 × 10⁴¹ (160 млрд M☉)',
      distanceFromSun_km: '2.18 × 10²⁰ (23 млн жарық жылы)',
      avgTemperature_c: '—',
      description:
        'Құйын галактикасы (M51) — классикалық спиральді галактиканың мінсіз мысалы. Кіші серік галактика NGC 5195 оның спираль тармағымен өзара әрекеттеседі.',
      funFacts: [
        'Алғашқы спиральді құрылымы байқалған галактика (1845 ж.)',
        'Серік галактикасымен өзара әрекеттесуде',
        'Хаббл телескопымен таңғажайып суреттері бар',
        'Жұлдыз қалыптасуы белсенді жүруде',
      ],
      galaxyType: 'SA(s)bc — спиральді',
      starCount: '~100 миллиард',
      constellation: 'Тазылар (Canes Venatici)',
    },
  },
  {
    id: 'lmc',
    name: 'Үлкен Магеллан Бұлты',
    nameEn: 'Large Magellanic Cloud',
    type: 'irregular',
    hue: 190,
    pos: [-150, 180, 280],
    size: 42,
    color: '#88bbcc',
    isGalaxy: true,
    realData: {
      diameter_km: '1.33 × 10¹⁷ (14,000 жарық жылы)',
      mass_kg: '1.38 × 10⁴⁰ (10 млрд M☉)',
      distanceFromSun_km: '1.49 × 10¹⁸ (158,200 жарық жылы)',
      avgTemperature_c: '—',
      description:
        'Үлкен Магеллан Бұлты (ҮМБ) — Құс жолының серік галактикасы. Ережесіз пішінді. 1987 жылы SN 1987A супернова оқиғасы осы галактикада болған — жақын ғарыштағы соңғы супернова.',
      funFacts: [
        'Құс жолына ең жақын галактикалардың бірі',
        'Оңтүстік жарты шардан жалаңаш көзбен көрінеді',
        'SN 1987A супернова осында болды — соңғы 400 жылдағы ең жақын',
        'Тарантул тұмандығы — ең жарқын жұлдыз қалыптасу аймағы',
      ],
      galaxyType: 'SB(s)m — ережесіз / тілімше спиральді',
      starCount: '~30 миллиард',
      constellation: 'Алтын Балық (Dorado)',
    },
  },
];

const Galaxies = React.memo(function Galaxies() {
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const introDone = useStore((s) => s.introDone);

  const textures = useMemo(
    () => GALAXY_DATA.map((g) => createGalaxyTexture(g.type, g.hue)),
    []
  );

  const handleClick = (galaxy, e) => {
    e.stopPropagation();
    setSelectedPlanet(galaxy);
    setCameraTarget({
      position: { x: galaxy.pos[0], y: galaxy.pos[1], z: galaxy.pos[2] },
      radius: galaxy.size * 0.5,
    });
  };

  return (
    <group>
      {GALAXY_DATA.map((g, i) => (
        <group key={g.id}>
          {/* Galaxy sprite */}
          <sprite
            position={g.pos}
            scale={[g.size, g.size, 1]}
            onClick={(e) => handleClick(g, e)}
          >
            <spriteMaterial
              map={textures[i]}
              transparent
              opacity={0.75}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>

          {/* Label */}
          {introDone && (
            <group position={g.pos}>
              <Html
                position={[0, g.size * 0.55, 0]}
                center
                distanceFactor={100}
              >
                <div
                  className="text-[10px] font-medium pointer-events-none select-none whitespace-nowrap opacity-70"
                  style={{ color: g.color, textShadow: `0 0 6px ${g.color}60` }}
                >
                  {g.name}
                </div>
              </Html>
            </group>
          )}
        </group>
      ))}
    </group>
  );
});

export default Galaxies;
