import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const W = (file, width = 440) =>
  `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
const ROCKETS = [
  { name: 'Saturn V', country: 'АҚШ', agency: 'NASA', year: '1967-1973', height: 110.6, diameter: 10.1, mass: 2970000, payload_leo: 140000, payload_moon: 48600, thrust: 34020, engines: 'F-1 × 5 (1-ші сатысы)', fuel: 'Керосин/LOX', launches: 13, success: 13, status: 'Зейнетте', description: 'Адамзат тарихындағы ең қуатты ракета. Аполлон бағдарламасында Айға адам жіберу үшін қолданылды. 13 ұшырылымның барлығы сәтті болды.', color: '#f59e0b', image: W('Apollo_4_Saturn_V,_s67-50531.jpg') },
  { name: 'Falcon 9', country: 'АҚШ', agency: 'SpaceX', year: '2010-қазіргі', height: 70, diameter: 3.7, mass: 549054, payload_leo: 22800, payload_moon: null, thrust: 7607, engines: 'Merlin 1D × 9', fuel: 'Керосин/LOX', launches: 300, success: 298, status: 'Белсенді', description: 'Әлемдегі ең сенімді және қайта пайдаланылатын ракета. 1-ші сатысы тігінен қайта қонады. Ғарыш индустриясын революциялады.', color: '#3b82f6', image: W('Falcon_9_Flight_17_approaching_landing.jpg') },
  { name: 'Starship', country: 'АҚШ', agency: 'SpaceX', year: '2023-қазіргі', height: 121, diameter: 9, mass: 5000000, payload_leo: 150000, payload_moon: 100000, thrust: 74400, engines: 'Raptor × 33 (Super Heavy)', fuel: 'Метан/LOX', launches: 6, success: 3, status: 'Сынақта', description: 'Тарихтағы ең үлкен және ең қуатты ракета. Марсқа адам жіберу үшін жасалуда. Толық қайта пайдаланылатын.', color: '#8b5cf6', image: W('Starship_IFT-6_Launch_(cropped).jpg') },
  { name: 'Союз', country: 'Ресей', agency: 'Роскосмос', year: '1966-қазіргі', height: 46.1, diameter: 2.95, mass: 312000, payload_leo: 8200, payload_moon: null, thrust: 4144, engines: 'РД-108А + 4×РД-107А', fuel: 'Керосин/LOX', launches: 1900, success: 1860, status: 'Белсенді', description: 'Әлемдегі ең ұзақ қолданылған және ең көп ұшырылған ракета. 1966 жылдан бері 1900+ ұшырылым жасалды. Адамдарды ХҒС-қа жеткізудің негізгі құралы.', color: '#22c55e', image: W('Soyuz_TMA-6_launch.jpg') },
  { name: 'Протон-М', country: 'Ресей', agency: 'Роскосмос', year: '2001-қазіргі', height: 58.2, diameter: 7.4, mass: 705000, payload_leo: 23700, payload_moon: 6300, thrust: 10470, engines: 'РД-275М × 6', fuel: 'НДМГ/АТ', launches: 115, success: 105, status: 'Белсенді', description: 'Ресейдің ауыр ракетасы. Ғарыш станциялары модульдерін, ауыр серіктерді орбитаға шығарады. Байқоңырдан ұшырылады.', color: '#ef4444', image: W('Proton_Zvezda_crop.jpg') },
  { name: 'Ariane 5', country: 'Еуропа', agency: 'ESA/Arianespace', year: '1996-2023', height: 52, diameter: 5.4, mass: 780000, payload_leo: 21000, payload_moon: null, thrust: 15120, engines: 'Vulcain 2 + 2×EAP', fuel: 'Сутегі/LOX', launches: 117, success: 112, status: 'Зейнетте', description: 'Еуропаның негізгі ауыр ракетасы. Джеймс Уэбб телескопын ұшырды. 2023 жылы Ariane 6-ға орнын берді.', color: '#06b6d4', image: W('Ariane_5ES_with_ATV_4_on_its_way_to_ELA-3.jpg') },
  { name: 'Long March 5', country: 'Қытай', agency: 'CNSA', year: '2016-қазіргі', height: 56.97, diameter: 5, mass: 867000, payload_leo: 25000, payload_moon: 8200, thrust: 10780, engines: 'YF-77 × 2 + 8×YF-100', fuel: 'Сутегі/LOX + Керосин', launches: 14, success: 13, status: 'Белсенді', description: 'Қытайдың ең қуатты ракетасы. Тяньгун ғарыш станциясы модульдерін және Ай миссияларын ұшырады.', color: '#dc2626', image: W('CZ-5_at_Wenchang_Spacecraft_Launch_Site.jpg') },
];

const STATUS_COLORS = {
  'Белсенді': 'emerald',
  'Сынақта': 'amber',
  'Зейнетте': 'cyan',
};

const FILTERS = ['Барлығы', 'Белсенді', 'Сынақта', 'Зейнетте'];

const SORT_OPTIONS = [
  { key: 'height', label: 'Биіктігі' },
  { key: 'payload_leo', label: 'Жүк көтерімі' },
  { key: 'launches', label: 'Ұшырылымдар' },
];

function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default function RocketsPage() {
  const [filter, setFilter] = useState('Барлығы');
  const [sortBy, setSortBy] = useState('height');
  const [expandedIdx, setExpandedIdx] = useState(null);

  const maxHeight = Math.max(...ROCKETS.map((r) => r.height));

  const filtered = useMemo(() => {
    let list = filter === 'Барлығы' ? [...ROCKETS] : ROCKETS.filter((r) => r.status === filter);
    list.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
    return list;
  }, [filter, sortBy]);

  return (
    <PageLayout title="РАКЕТАЛАР" subtitle="Ғарышқа жол ашқан ракеталар" gradient="from-red-400 to-orange-500">
      {/* ===== HEIGHT COMPARISON HERO ===== */}
      <section className="mb-14">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">Биіктік салыстыру</h3>
        <p className="text-gray-500 text-center text-sm mb-8">Масштабы сақталған</p>

        <div className="relative flex items-end justify-center gap-3 sm:gap-5 md:gap-7 px-2" style={{ height: 380 }}>
          {/* horizontal grid lines */}
          {[0, 30, 60, 90, 120].map((v) => (
            <div
              key={v}
              className="absolute left-0 right-0 border-t border-white/5"
              style={{ bottom: `${(v / maxHeight) * 100}%` }}
            >
              <span className="absolute -top-3 left-1 text-[10px] text-gray-600 font-mono">{v} м</span>
            </div>
          ))}

          {ROCKETS.map((rocket, i) => {
            const barH = (rocket.height / maxHeight) * 100;
            return (
              <div key={rocket.name} className="flex flex-col items-center flex-1 max-w-[80px] relative z-10">
                {/* height label */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                  className="text-[11px] font-mono font-bold mb-1 whitespace-nowrap"
                  style={{ color: rocket.color }}
                >
                  {rocket.height} м
                </motion.span>

                {/* bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barH}%` }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to top, ${rocket.color}33, ${rocket.color})`,
                    boxShadow: `0 0 24px ${rocket.color}55`,
                    minWidth: 28,
                  }}
                >
                  {/* shimmer */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '-100%' }}
                    transition={{ delay: 1 + i * 0.1, duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, transparent, ${rocket.color}66, transparent)`,
                    }}
                  />
                  {/* rocket nose cone shape */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '14px solid transparent',
                      borderRight: '14px solid transparent',
                      borderBottom: `18px solid ${rocket.color}`,
                      marginTop: -16,
                    }}
                  />
                </motion.div>

                {/* name */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                  className="mt-2 text-[10px] sm:text-xs text-gray-300 text-center font-medium leading-tight whitespace-nowrap"
                >
                  {rocket.name}
                </motion.span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FILTERS & SORT ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                filter === f
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/[0.02] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Сұрыптау:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1 rounded-lg text-xs border transition-all duration-200 ${
                sortBy === opt.key
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : 'bg-white/[0.02] border-white/10 text-gray-500 hover:text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== ROCKET CARDS GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((rocket, i) => {
          const successRate = ((rocket.success / rocket.launches) * 100).toFixed(1);
          const isExpanded = expandedIdx === rocket.name;

          return (
            <Card
              key={rocket.name}
              delay={i * 0.08}
              onClick={() => setExpandedIdx(isExpanded ? null : rocket.name)}
              className="!p-0 overflow-hidden"
            >
              {/* Rocket image */}
              {rocket.image && (
                <div className="relative h-48 overflow-hidden bg-black/30">
                  <img
                    src={rocket.image}
                    alt={rocket.name}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000005] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: rocket.color }} />
                </div>
              )}
              {!rocket.image && <div className="h-1" style={{ background: rocket.color }} />}

              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: rocket.color, boxShadow: `0 0 8px ${rocket.color}` }}
                      />
                      {rocket.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge color="blue">{rocket.country} / {rocket.agency}</Badge>
                      <Badge color={STATUS_COLORS[rocket.status]}>{rocket.status}</Badge>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono whitespace-nowrap">{rocket.year}</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  <StatBox label="Биіктігі" value={rocket.height} unit="м" />
                  <StatBox label="Диаметрі" value={rocket.diameter} unit="м" />
                  <StatBox label="Массасы" value={formatNumber(rocket.mass)} unit="кг" />
                  <StatBox label="LEO жүк" value={formatNumber(rocket.payload_leo)} unit="кг" />
                </div>

                {/* Additional stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <StatBox label="Тарту күші" value={formatNumber(rocket.thrust)} unit="кН" />
                  <StatBox label="Ұшырылымдар" value={rocket.launches} />
                  <StatBox
                    label="Ай жүгі"
                    value={rocket.payload_moon ? formatNumber(rocket.payload_moon) : '—'}
                    unit={rocket.payload_moon ? 'кг' : ''}
                  />
                </div>

                {/* Engine & fuel info */}
                <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                  <span className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-gray-400">
                    {rocket.engines}
                  </span>
                  <span className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-gray-400">
                    {rocket.fuel}
                  </span>
                </div>

                {/* Success rate bar */}
                <div className="mb-1">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-400">Сәттілік деңгейі</span>
                    <span className="font-mono font-bold" style={{ color: rocket.color }}>
                      {successRate}% ({rocket.success}/{rocket.launches})
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${successRate}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${rocket.color}88, ${rocket.color})` }}
                    />
                  </div>
                </div>

                {/* Expandable description */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-400 leading-relaxed pt-3 border-t border-white/5 mt-3">
                    {rocket.description}
                  </p>
                </motion.div>

                {/* expand hint */}
                <div className="text-center mt-2">
                  <span className="text-[10px] text-gray-600">
                    {isExpanded ? 'Жабу' : 'Толығырақ'}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Бұл санаттағы ракеталар табылмады</p>
        </div>
      )}
    </PageLayout>
  );
}
