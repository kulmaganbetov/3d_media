import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const W = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
const ASTRONAUTS = [
  {
    name: 'Юрий Гагарин', nameEn: 'Yuri Gagarin', country: 'КСРО', year: 1961,
    mission: 'Восток-1', achievement: 'Ғарышқа ұшқан алғашқы адам',
    bio: 'Юрий Алексеевич Гагарин (1934-1968) — кеңестік ұшқыш-ғарышкер. 1961 жылы 12 сәуірде Восток-1 ғарыш кемесімен ғарышқа ұшып, Жерді 108 минутта айналып шықты. «Поехали!» деген оның сөзі тарихқа кірді.',
    stats: { flights: 1, duration: '1 сағ 48 мин', altitude: '327 км' },
    color: '#ef4444',
    image: `${W}/d/da/Yuri_Gagarin_%281961%29_-_Restoration.jpg/440px-Yuri_Gagarin_%281961%29_-_Restoration.jpg`,
  },
  {
    name: 'Нил Армстронг', nameEn: 'Neil Armstrong', country: 'АҚШ', year: 1969,
    mission: 'Аполлон-11', achievement: 'Айға аяқ басқан алғашқы адам',
    bio: 'Нил Олден Армстронг (1930-2012) — американдық ғарышкер. 1969 жылы 20 шілдеде Айға аяқ басып, «Бұл — бір адамға кішкентай қадам, бірақ адамзатқа — алып секіріс» деген атақты сөзін айтты.',
    stats: { flights: 2, duration: '8 тәулік 14 сағ', altitude: '384,400 км' },
    color: '#3b82f6',
    image: `${W}/0/0d/Neil_Armstrong_pose.jpg/440px-Neil_Armstrong_pose.jpg`,
  },
  {
    name: 'Валентина Терешкова', nameEn: 'Valentina Tereshkova', country: 'КСРО', year: 1963,
    mission: 'Восток-6', achievement: 'Ғарышқа ұшқан алғашқы әйел',
    bio: 'Валентина Владимировна Терешкова (1937) — ғарышқа ұшқан алғашқы әйел. 1963 жылы 16-19 маусымда Восток-6 кемесімен 3 тәулікте Жерді 48 рет айналды. Позывной — «Чайка».',
    stats: { flights: 1, duration: '2 тәулік 22 сағ', altitude: '231 км' },
    color: '#ec4899',
    image: `${W}/a/a8/RIAN_archive_612748_Valentina_Tereshkova.jpg/440px-RIAN_archive_612748_Valentina_Tereshkova.jpg`,
  },
  {
    name: 'Тоқтар Аубакиров', nameEn: 'Toktar Aubakirov', country: 'Қазақстан', year: 1991,
    mission: 'Союз ТМ-13', achievement: 'Алғашқы қазақ ғарышкер',
    bio: 'Тоқтар Оңғарбайұлы Аубакиров (1946) — Қазақстанның алғашқы ғарышкері, Кеңес Одағының Батыры, сынақшы-ұшқыш. 1991 жылы 2 қазанда ғарышқа ұшып, «Мир» станциясында ғылыми тәжірибелер жүргізді. Сондай-ақ, МиГ-29 ұшағын авианесуші кемеден ұшырған алғашқы адам.',
    stats: { flights: 1, duration: '7 тәулік 22 сағ', altitude: '350 км' },
    color: '#22c55e',
    featured: true,
    image: `${W}/2/24/Toktar_Aubakirov_MIR.jpg/440px-Toktar_Aubakirov_MIR.jpg`,
  },
  {
    name: 'Алексей Леонов', nameEn: 'Alexei Leonov', country: 'КСРО', year: 1965,
    mission: 'Восход-2', achievement: 'Ашық ғарышқа шыққан алғашқы адам',
    bio: 'Алексей Архипович Леонов (1934-2019) — ашық ғарышқа шыққан алғашқы адам. 1965 жылы 18 наурызда 12 минут 9 секунд ашық ғарышта болды. Суретші-ғарышкер ретінде де танымал.',
    stats: { flights: 2, duration: '7 тәулік 0 сағ', altitude: '475 км' },
    color: '#f59e0b',
    image: `${W}/e/e6/Alexei_Leonov_in_1974.jpg/440px-Alexei_Leonov_in_1974.jpg`,
  },
  {
    name: 'Крис Хэдфилд', nameEn: 'Chris Hadfield', country: 'Канада', year: 1995,
    mission: 'STS-74, Союз ТМА-07М', achievement: 'ХҒС командирі, ғарыштағы музыкант',
    bio: 'Крис Остин Хэдфилд (1959) — канадалық ғарышкер, ХҒС-тың командирі. Ғарышта Дэвид Боуидің «Space Oddity» әнін орындап, миллиондарды тәнті етті. Ғарыш туралы бірнеше бестселлер кітап жазды.',
    stats: { flights: 3, duration: '166 тәулік', altitude: '408 км' },
    color: '#8b5cf6',
    image: `${W}/7/74/Chris_Hadfield_2011.jpg/440px-Chris_Hadfield_2011.jpg`,
  },
  {
    name: 'Айдын Айымбетов', nameEn: 'Aidyn Aimbetov', country: 'Қазақстан', year: 2015,
    mission: 'Союз ТМА-18М', achievement: 'Екінші қазақ ғарышкер',
    bio: 'Айдын Ақанұлы Айымбетов (1972) — Қазақстанның екінші ғарышкері. 2015 жылы 2 қыркүйекте ғарышқа ұшып, ХҒС-та 10 тәулік болды. Қазақ халқының ұлттық туын ғарышта алып жүрді.',
    stats: { flights: 1, duration: '9 тәулік 20 сағ', altitude: '408 км' },
    color: '#06b6d4',
    featured: true,
    image: `${W}/e/ed/Aydyn_Aimbetov_2015.jpg/440px-Aydyn_Aimbetov_2015.jpg`,
  },
  {
    name: 'Базз Олдрин', nameEn: 'Buzz Aldrin', country: 'АҚШ', year: 1969,
    mission: 'Аполлон-11', achievement: 'Айға аяқ басқан екінші адам',
    bio: 'Базз Олдрин (1930) — Айға аяқ басқан екінші адам. Аполлон-11 миссиясында Ай модулінің ұшқышы болды. 93 жасында ғарышты танымалдандыруды жалғастыруда.',
    stats: { flights: 2, duration: '12 тәулік 1 сағ', altitude: '384,400 км' },
    color: '#64748b',
    image: `${W}/d/d4/Buzz_Aldrin_%28Apollo_11%29.jpg/440px-Buzz_Aldrin_%28Apollo_11%29.jpg`,
  },
];

const COUNTRIES = ['Барлығы', 'Қазақстан', 'КСРО', 'АҚШ', 'Канада'];

const COUNTRY_BADGE_COLOR = {
  'КСРО': 'red',
  'АҚШ': 'blue',
  'Қазақстан': 'emerald',
  'Канада': 'purple',
};

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('');
}

function AstronautCard({ astronaut, index, onToggle, expanded }) {
  const { name, nameEn, country, year, mission, achievement, bio, stats, color, featured, image } = astronaut;
  const initials = getInitials(name);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        featured
          ? 'bg-white/[0.05] border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.15)] col-span-1 md:col-span-2'
          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
      }`}
    >
      {featured && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      )}

      <div className="relative p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar with photo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg border-2"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              boxShadow: `0 4px 20px ${color}44`,
              borderColor: `${color}66`,
            }}
          >
            {image && !imgErr ? (
              <img src={image} alt={name} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
            ) : (
              initials
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white">{name}</h3>
              {featured && (
                <Badge color="amber">Қазақстан</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{nameEn}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge color={COUNTRY_BADGE_COLOR[country] || 'cyan'}>{country}</Badge>
              <span className="text-xs text-gray-500">{year}</span>
              <span className="text-xs text-gray-600">|</span>
              <span className="text-xs text-cyan-400">{mission}</span>
            </div>
          </div>
        </div>

        {/* Achievement */}
        <div
          className="text-sm font-medium mb-4 pl-3 border-l-2"
          style={{ borderColor: color, color: `${color}cc` }}
        >
          {achievement}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatBox label="Ұшулар" value={stats.flights} icon="🚀" />
          <StatBox label="Ұзақтығы" value={stats.duration} icon="⏱" />
          <StatBox label="Биіктік" value={stats.altitude} icon="📏" />
        </div>

        {/* Expand bio */}
        <button
          onClick={() => onToggle(astronaut.nameEn)}
          className="w-full text-center text-xs text-gray-500 hover:text-cyan-400 transition-colors py-1"
        >
          {expanded ? 'Жабу ▲' : 'Толығырақ ▼'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-gray-400 leading-relaxed mt-2 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                {bio}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function AstronautsPage() {
  const [filter, setFilter] = useState('Барлығы');
  const [expandedBio, setExpandedBio] = useState(null);

  const toggleBio = (nameEn) => {
    setExpandedBio((prev) => (prev === nameEn ? null : nameEn));
  };

  const filtered = ASTRONAUTS
    .filter((a) => filter === 'Барлығы' || a.country === filter)
    .sort((a, b) => a.year - b.year);

  return (
    <PageLayout title="ҒАРЫШКЕРЛЕР" subtitle="Ғарыш батырлары" gradient="from-emerald-400 to-cyan-500">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto"
      >
        <StatBox label="Ғарышкерлер" value="560+" icon="👨‍🚀" />
        <StatBox label="Елдер" value="40+" icon="🌍" />
        <StatBox label="Бастау" value="1961" unit="жылдан бері" icon="📅" />
      </motion.div>

      {/* Country filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {COUNTRIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ${
              filter === c
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Astronaut cards grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((astronaut, i) => (
            <AstronautCard
              key={astronaut.nameEn}
              astronaut={astronaut}
              index={i}
              onToggle={toggleBio}
              expanded={expandedBio === astronaut.nameEn}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-12"
        >
          Бұл санатта ғарышкерлер табылмады.
        </motion.p>
      )}
    </PageLayout>
  );
}
