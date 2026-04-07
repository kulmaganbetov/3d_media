import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const EXOPLANETS = [
  { name: 'Kepler-442b', type: 'Жер тәрізді', distance: '1,206 жарық жылы', mass: '2.3 Жер', radius: '1.34 Жер', star: 'Kepler-442', orbitalPeriod: '112.3 тәулік', temperature: '~−40°C', habitable: true, year: 2015, description: 'Тұрғылықты аймақтағы ең перспективалы экзопланеталардың бірі. Жер массасынан 2.3 есе ауыр, бетінде сұйық су болуы мүмкін.', similarity: 84 },
  { name: 'Proxima Centauri b', type: 'Жер тәрізді', distance: '4.24 жарық жылы', mass: '1.17 Жер', radius: '1.08 Жер', star: 'Проксима Центавр', orbitalPeriod: '11.2 тәулік', temperature: '~−39°C', habitable: true, year: 2016, description: 'Жерге ең жақын экзопланета! Тұрғылықты аймақта орналасқан. Қызыл ергежейлі жұлдыздың серігі. Болашақ ғарыш миссияларының бірінші нысаны болуы мүмкін.', similarity: 87 },
  { name: 'TRAPPIST-1e', type: 'Жер тәрізді', distance: '40.7 жарық жылы', mass: '0.69 Жер', radius: '0.92 Жер', star: 'TRAPPIST-1', orbitalPeriod: '6.1 тәулік', temperature: '~−27°C', habitable: true, year: 2017, description: 'TRAPPIST-1 жүйесіндегі 7 планетаның ең перспективтісі. Жерге ұқсас өлшемде, тұрғылықты аймақтың ортасында.', similarity: 85 },
  { name: '51 Pegasi b', type: 'Ыстық Юпитер', distance: '50.6 жарық жылы', mass: '0.47 Юпитер', radius: '1.27 Юпитер', star: '51 Pegasi', orbitalPeriod: '4.23 тәулік', temperature: '~1200°C', habitable: false, year: 1995, description: 'Алғашқы ашылған экзопланета (Күн тәрізді жұлдыз серігі). 1995 жылы ашылғаны үшін Нобель сыйлығы берілді. «Ыстық Юпитер» санатын тудырды.', similarity: 0 },
  { name: 'Kepler-22b', type: 'Су әлемі', distance: '638 жарық жылы', mass: '~36 Жер', radius: '2.4 Жер', star: 'Kepler-22', orbitalPeriod: '289.9 тәулік', temperature: '~22°C', habitable: true, year: 2011, description: 'Кеплер тапқан тұрғылықты аймақтағы алғашқы планета. Бетінде ұлан-ғайыр мұхит болуы мүмкін — «Су әлемі».', similarity: 64 },
  { name: 'HD 209458 b (Осирис)', type: 'Ыстық Юпитер', distance: '159 жарық жылы', mass: '0.71 Юпитер', radius: '1.38 Юпитер', star: 'HD 209458', orbitalPeriod: '3.52 тәулік', temperature: '~1130°C', habitable: false, year: 1999, description: 'Атмосферасы анықталған алғашқы экзопланета. Транзит әдісімен бақыланған алғашқы планета. Атмосферасы «буланып» жатыр.', similarity: 0 },
  { name: 'Kepler-452b', type: 'Жер тәрізді', distance: '1,402 жарық жылы', mass: '~5 Жер', radius: '1.63 Жер', star: 'Kepler-452', orbitalPeriod: '384.8 тәулік', temperature: '~−8°C', habitable: true, year: 2015, description: '«Жердің ағасы» деп аталады. Күн тәрізді жұлдыздың тұрғылықты аймағында орналасқан. Орбита периоды Жерге ұқсас (385 тәулік).', similarity: 83 },
  { name: 'GJ 1214 b', type: 'Су әлемі', distance: '48 жарық жылы', mass: '6.55 Жер', radius: '2.68 Жер', star: 'GJ 1214', orbitalPeriod: '1.58 тәулік', temperature: '~120-280°C', habitable: false, year: 2009, description: 'Толық су әлемі — массасының 75%-ы судан тұруы мүмкін. Жер мұхиттарынан мыңдаған есе көп су. Қалың бу атмосферасы бар.', similarity: 15 },
  { name: 'TOI-700 d', type: 'Жер тәрізді', distance: '101.4 жарық жылы', mass: '1.72 Жер', radius: '1.19 Жер', star: 'TOI-700', orbitalPeriod: '37.4 тәулік', temperature: '~−2°C', habitable: true, year: 2020, description: 'TESS телескопы тапқан тұрғылықты аймақтағы алғашқы Жер өлшемді планета. Салыстырмалы жақын қашықтықта — болашақ зерттеу нысаны.', similarity: 80 },
  { name: 'WASP-121 b', type: 'Ультра-ыстық Юпитер', distance: '881 жарық жылы', mass: '1.18 Юпитер', radius: '1.81 Юпитер', star: 'WASP-121', orbitalPeriod: '1.27 тәулік', temperature: '~2500°C', habitable: false, year: 2015, description: 'Ең экстремалды экзопланеталардың бірі. Атмосферасында темір мен магний буланады. Планета «жыртылып» жатыр — Рош шегіне жақын.', similarity: 0 },
];

const FILTERS = [
  { key: 'all', label: 'Барлығы' },
  { key: 'habitable', label: 'Тұрғылықты' },
  { key: 'Жер тәрізді', label: 'Жер тәрізді' },
  { key: 'Ыстық Юпитер', label: 'Ыстық Юпитер' },
  { key: 'Су әлемі', label: 'Су әлемі' },
];

const SORTS = [
  { key: 'similarity', label: 'Ұқсастық' },
  { key: 'distance', label: 'Қашықтық' },
  { key: 'year', label: 'Ашылған жыл' },
];

function parseDistance(d) {
  return parseFloat(d.replace(/,/g, ''));
}

function ESICircle({ similarity, size = 64 }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (similarity / 100) * circumference;
  const color = similarity >= 80 ? '#22c55e' : similarity >= 60 ? '#eab308' : similarity >= 30 ? '#f97316' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{similarity}%</span>
    </div>
  );
}

function MassBar({ label, value, max = 10, color = '#ec4899' }) {
  const numVal = parseFloat(value);
  const pct = Math.min((numVal / max) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-gray-400 w-16 text-right shrink-0">{value}</span>
    </div>
  );
}

function HabitableZoneDiagram({ planets }) {
  const habitablePlanets = planets.filter(p => p.habitable);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 p-6 mb-8"
    >
      <h3 className="text-lg font-bold mb-1 text-white">Тұрғылықты аймақ диаграммасы</h3>
      <p className="text-xs text-gray-500 mb-5">Жұлдызға қатысты планеталардың орналасуы (орбита периоды бойынша)</p>

      <div className="relative h-48 sm:h-56">
        {/* Star glow */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5),0_0_80px_rgba(250,204,21,0.2)]" />
        </div>

        {/* Too hot zone */}
        <div className="absolute left-16 sm:left-24 top-0 bottom-0 w-[15%] bg-gradient-to-r from-red-500/10 to-red-500/5 border-r border-red-500/20 flex items-end pb-2 justify-center">
          <span className="text-[9px] text-red-400/60">Ыстық</span>
        </div>

        {/* Habitable zone */}
        <div className="absolute left-[calc(4rem+15%)] sm:left-[calc(6rem+15%)] top-0 bottom-0 w-[40%] bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border-x border-emerald-500/20 flex items-end pb-2 justify-center">
          <span className="text-[9px] text-emerald-400/80">Тұрғылықты аймақ</span>
        </div>

        {/* Too cold zone */}
        <div className="absolute right-0 top-0 bottom-0 left-[calc(4rem+55%)] sm:left-[calc(6rem+55%)] bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-l border-blue-500/20 flex items-end pb-2 justify-center">
          <span className="text-[9px] text-blue-400/60">Суық</span>
        </div>

        {/* Planet markers */}
        {habitablePlanets.map((planet, i) => {
          const orbDays = parseFloat(planet.orbitalPeriod);
          const maxOrb = 400;
          const minPct = 20;
          const maxPct = 85;
          const pct = minPct + (Math.min(orbDays, maxOrb) / maxOrb) * (maxPct - minPct);
          const vertOffset = 20 + (i % 3) * 50 + (i > 2 ? 25 : 0);

          return (
            <motion.div
              key={planet.name}
              className="absolute flex flex-col items-center"
              style={{ left: `${pct}%`, top: `${vertOffset}px` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            >
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-emerald-400 bg-emerald-500/30 shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                title={planet.name}
              />
              <span className="text-[8px] sm:text-[10px] text-emerald-300 mt-1 whitespace-nowrap font-medium">{planet.name}</span>
              <span className="text-[7px] sm:text-[9px] text-gray-500">{planet.orbitalPeriod}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function typeBadgeColor(type) {
  if (type === 'Жер тәрізді') return 'emerald';
  if (type === 'Ыстық Юпитер' || type === 'Ультра-ыстық Юпитер') return 'red';
  if (type === 'Су әлемі') return 'blue';
  return 'cyan';
}

export default function ExoplanetsPage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('similarity');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = [...EXOPLANETS];

    if (filter === 'habitable') {
      list = list.filter(p => p.habitable);
    } else if (filter !== 'all') {
      list = list.filter(p => p.type === filter);
    }

    list.sort((a, b) => {
      if (sortBy === 'similarity') return b.similarity - a.similarity;
      if (sortBy === 'distance') return parseDistance(a.distance) - parseDistance(b.distance);
      if (sortBy === 'year') return a.year - b.year;
      return 0;
    });

    return list;
  }, [filter, sortBy]);

  return (
    <PageLayout title="ЭКЗОПЛАНЕТАЛАР" subtitle="Күн жүйесінен тыс әлемдер" gradient="from-pink-400 to-rose-500">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBox label="Расталған экзопланеталар" value="5,500+" icon="🪐" />
        <StatBox label="Галактикадағы болжам" value="200 млрд+" icon="🌌" />
        <StatBox label="Зерттеу тарихы" value="1995 жылдан бері" icon="🔭" />
      </div>

      {/* Habitable Zone Diagram */}
      <HabitableZoneDiagram planets={EXOPLANETS} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs text-gray-500 mr-1">Сүзгі:</span>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              filter === f.key
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.2)]'
                : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs text-gray-500 mr-1">Сұрыптау:</span>
        {SORTS.map(s => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              sortBy === s.key
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((planet, i) => (
          <Card
            key={planet.name}
            delay={i * 0.07}
            className={planet.habitable ? 'border-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.06)]' : ''}
            onClick={() => setExpanded(expanded === planet.name ? null : planet.name)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-base sm:text-lg font-bold text-white truncate">{planet.name}</h4>
                  <Badge color={typeBadgeColor(planet.type)}>{planet.type}</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {planet.star} &middot; {planet.year} ж. ашылған
                </p>
              </div>
              {planet.habitable && planet.similarity > 0 && (
                <ESICircle similarity={planet.similarity} size={56} />
              )}
              {!planet.habitable && planet.similarity > 0 && (
                <ESICircle similarity={planet.similarity} size={56} />
              )}
            </div>

            {/* Key info row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/[0.03] rounded-lg p-2 text-center border border-white/5">
                <div className="text-[10px] text-gray-500 mb-0.5">Қашықтық</div>
                <div className="text-xs font-semibold text-pink-300">{planet.distance}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2 text-center border border-white/5">
                <div className="text-[10px] text-gray-500 mb-0.5">Орбита</div>
                <div className="text-xs font-semibold text-purple-300">{planet.orbitalPeriod}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2 text-center border border-white/5">
                <div className="text-[10px] text-gray-500 mb-0.5">Температура</div>
                <div className="text-xs font-semibold text-amber-300">{planet.temperature}</div>
              </div>
            </div>

            {/* Mass / Radius bars */}
            <div className="space-y-1.5 mb-3">
              <MassBar
                label="Масса"
                value={planet.mass}
                max={planet.mass.includes('Юпитер') ? 2 : 40}
                color={planet.mass.includes('Юпитер') ? '#f97316' : '#ec4899'}
              />
              <MassBar
                label="Радиус"
                value={planet.radius}
                max={planet.radius.includes('Юпитер') ? 2 : 3}
                color={planet.radius.includes('Юпитер') ? '#f97316' : '#a855f7'}
              />
            </div>

            {/* Habitable indicator */}
            {planet.habitable && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                <span className="text-[11px] text-emerald-400 font-medium">Тұрғылықты аймақта</span>
              </div>
            )}

            {/* Expanded description */}
            {expanded === planet.name && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 pt-3 border-t border-white/5"
              >
                <p className="text-sm text-gray-300 leading-relaxed">{planet.description}</p>
                {planet.similarity > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Жерге ұқсастық индексі (ESI):</span>
                    <span className={`text-sm font-bold ${
                      planet.similarity >= 80 ? 'text-emerald-400' : planet.similarity >= 60 ? 'text-yellow-400' : 'text-orange-400'
                    }`}>
                      {planet.similarity}%
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Expand hint */}
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600">
                {expanded === planet.name ? 'Жабу' : 'Толығырақ'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">Нәтиже табылмады</p>
          <p className="text-sm">Сүзгі параметрлерін өзгертіңіз</p>
        </div>
      )}
    </PageLayout>
  );
}
