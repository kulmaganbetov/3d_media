import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Card, Badge } from './PageLayout';

const W = (file, width = 600) =>
  `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
const NEBULAE = [
  {
    name: 'Орион тұмандығы',
    nameEn: 'Orion Nebula (M42)',
    type: 'Эмиссиялық',
    distance: '1,344 жарық жылы',
    size: '24 жарық жылы',
    constellation: 'Орион',
    description:
      'Жалаңаш көзбен көрінетін ең жарқын тұмандық. Жаңа жұлдыздар мен планеталар жүйелерінің «бесігі». Орион белдігінің астында орналасқан.',
    facts: [
      'Жалаңаш көзбен көрінеді',
      '700+ жас жұлдыз бар',
      'Жұлдыз тууының негізгі орны',
      'Жасы — шамамен 2 млн жыл',
    ],
    color: '#e879f9',
    gradient: 'from-purple-600 to-pink-500',
    image: W('Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg', 600),
  },
  {
    name: 'Тіршілік бағаналары',
    nameEn: 'Pillars of Creation (M16)',
    type: 'Эмиссиялық',
    distance: '6,500 жарық жылы',
    size: '4-5 жарық жылы',
    constellation: 'Жылан',
    description:
      'Хаббл телескопының ең атақты суреті. Қыран тұмандығындағы газ бен шаң бағаналары — жаңа жұлдыздар осы жерде туады. Ен үлкен бағана 4 жарық жылы биіктікте.',
    facts: [
      'Хабблдің ең атақты суреті (1995)',
      'Биіктігі — 4 жарық жылы',
      'Жаңа жұлдыздар тууда',
      'Уэбб 2022-де жаңа суретін түсірді',
    ],
    color: '#a78bfa',
    gradient: 'from-indigo-600 to-purple-500',
    image: W('Eagle_nebula_pillars.jpg', 600),
  },
  {
    name: 'Шақырымдық тұмандық',
    nameEn: 'Crab Nebula (M1)',
    type: 'Жұлдыз жарылысы',
    distance: '6,500 жарық жылы',
    size: '11 жарық жылы',
    constellation: 'Өгіз',
    description:
      '1054 жылы жарылған жұлдыздың қалдығы. Қытай мен араб астрономдары жазып алған. Ортасында секундына 30 рет айналатын пульсар (нейтрон жұлдызы) бар.',
    facts: [
      '1054 жылғы суперновадан пайда болған',
      'Ортасында пульсар бар (секундына 30 айналым)',
      'Қытай жазбаларында «қонақ жұлдыз» деп жазылған',
      'Күндізгі аспанда 23 күн көрінген',
    ],
    color: '#f97316',
    gradient: 'from-orange-600 to-red-500',
    image: W('Crab_Nebula.jpg', 600),
  },
  {
    name: 'Сақина тұмандығы',
    nameEn: 'Ring Nebula (M57)',
    type: 'Планетарлық',
    distance: '2,283 жарық жылы',
    size: '1.3 жарық жылы',
    constellation: 'Лира',
    description:
      'Өлген жұлдыздың шығарған газ қабықшасы. Планетарлық тұмандықтың классикалық мысалы. Ортасында ақ ергежейлі жұлдыз бар — Күннің болашақ тағдыры.',
    facts: [
      'Біздің Күннің болашақ тағдырын көрсетеді',
      'Ортасында ақ ергежейлі жұлдыз бар',
      'Жасы — шамамен 4,000 жыл',
      'Секундына 20-30 км жылдамдықпен кеңейіп жатыр',
    ],
    color: '#38bdf8',
    gradient: 'from-cyan-500 to-blue-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Webb_captures_detailed_beauty_of_Ring_Nebula_%28NIRCam_image%29_%28weic2320b%29.jpg',
  },
  {
    name: 'Қарақұс тұмандығы',
    nameEn: 'Eagle Nebula (M16)',
    type: 'Эмиссиялық',
    distance: '7,000 жарық жылы',
    size: '70 × 55 жарық жылы',
    constellation: 'Жылан',
    description:
      'Тіршілік бағаналарын қамтитын алып тұмандық. Жас ашық шоғыр мен газ бұлтынан тұрады. Ең белсенді жұлдыз түзілу аймақтарының бірі.',
    facts: [
      'Тіршілік бағаналарын қамтиды',
      '460+ жас жұлдыздан тұратын шоғыр бар',
      'Жасы — 1-2 млн жыл',
      'Ауданы — Толық Айдан 4 есе үлкен',
    ],
    color: '#34d399',
    gradient: 'from-emerald-500 to-teal-600',
    image: W('Eagle_nebula_pillars.jpg', 600),
  },
  {
    name: 'Ат басы тұмандығы',
    nameEn: 'Horsehead Nebula (B33)',
    type: 'Қараңғы',
    distance: '1,375 жарық жылы',
    size: '3.5 жарық жылы',
    constellation: 'Орион',
    description:
      'Ат басы пішініндегі қараңғы тұмандық — ғарыштың ең танымал нысандарының бірі. Артындағы қызыл жарық эмиссиялық тұмандықтан келеді.',
    facts: [
      'Ен танымал қараңғы тұмандық',
      'Ат басы пішінін жасайтын газ бен шаң',
      '100,000 жылдан кейін жойылуы мүмкін',
      'Уэбб телескопы инфрақызыл суретін түсірді',
    ],
    color: '#ef4444',
    gradient: 'from-red-700 to-rose-600',
    image: W('Barnard_33.jpg', 600),
  },
  {
    name: 'Кошачий Глаз',
    nameEn: "Cat's Eye Nebula (NGC 6543)",
    type: 'Планетарлық',
    distance: '3,262 жарық жылы',
    size: '0.2 жарық жылы',
    constellation: 'Айдаһар',
    description:
      'Ең күрделі құрылымды планетарлық тұмандық. 11 сақинадан тұратын пияз тәрізді құрылым. Хаббл суреттері ғарыштық өнер туындысы сияқты.',
    facts: [
      '11 концентрикалық сақина',
      'Ортадағы жұлдыз Күннен 10,000 есе жарық',
      'Жасы — 1,000 жыл шамасы',
      'Хабблдің алғашқы суреттерінің бірі (1994)',
    ],
    color: '#14b8a6',
    gradient: 'from-teal-400 to-emerald-600',
    image: W('Catseye-big.jpg', 600),
  },
  {
    name: 'Кариналық тұмандық',
    nameEn: 'Carina Nebula (NGC 3372)',
    type: 'Эмиссиялық',
    distance: '8,500 жарық жылы',
    size: '460 жарық жылы',
    constellation: 'Кіл',
    description:
      'Құс жолы галактикасындағы ең үлкен тұмандықтардың бірі. Ета Каринасы — жарылуға дайын гипералып жұлдыз. Уэбб телескопының алғашқы суреттерінде бейнеленді.',
    facts: [
      'Орион тұмандығынан 4 есе үлкен',
      'Ета Каринасы — Күннен 5 млн есе жарық',
      'Уэбб телескопының алғашқы мақсаты',
      'Мыңдаған жұлдыздар тууда',
    ],
    color: '#f472b6',
    gradient: 'from-pink-500 to-rose-600',
    image: W('Carina_Nebula_by_Harel_Boren_(151851961,_modified).jpg', 600),
  },
];

const FILTERS = ['Барлығы', 'Эмиссиялық', 'Планетарлық', 'Қараңғы', 'Жұлдыз жарылысы'];

const STATS = [
  { label: 'Мыңдаған тұмандық', icon: '🌌' },
  { label: 'Жұлдыз бесігі', icon: '⭐' },
  { label: 'Ғарыштық өнер', icon: '🎨' },
];

const TYPE_BADGE_COLORS = {
  'Эмиссиялық': 'purple',
  'Планетарлық': 'cyan',
  'Қараңғы': 'red',
  'Жұлдыз жарылысы': 'amber',
};

export default function NebulaePage() {
  const [activeFilter, setActiveFilter] = useState('Барлығы');

  const filtered =
    activeFilter === 'Барлығы'
      ? NEBULAE
      : NEBULAE.filter((n) => n.type === activeFilter);

  return (
    <PageLayout
      title="ТҰМАНДЫҚТАР"
      subtitle="Ғарыштың ең әдемі нысандары"
      gradient="from-purple-400 to-violet-500"
    >
      {/* Stats */}
      <div className="flex justify-center gap-6 sm:gap-10 mb-8">
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xs sm:text-sm text-gray-400">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
              activeFilter === f
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Nebula cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((nebula, i) => (
          <motion.div
            key={nebula.nameEn}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 transition-all duration-300 group"
            style={{
              '--glow-color': nebula.color,
            }}
          >
            {/* Hover glow effect via inline style */}
            <style>{`
              .group:hover {
                border-color: var(--glow-color) !important;
                box-shadow: 0 0 30px color-mix(in srgb, var(--glow-color) 20%, transparent),
                            0 0 60px color-mix(in srgb, var(--glow-color) 10%, transparent);
              }
            `}</style>

            {/* Nebula image */}
            {nebula.image && (
              <div className="relative h-48 overflow-hidden bg-black/30">
                <img
                  src={nebula.image}
                  alt={nebula.name}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000005] via-transparent to-transparent" />
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${nebula.gradient}`}
                />
              </div>
            )}
            {!nebula.image && (
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${nebula.gradient}`}
              />
            )}

            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">
                    {nebula.name}
                  </h3>
                  <p className="text-xs text-gray-500">{nebula.nameEn}</p>
                </div>
                <Badge color={TYPE_BADGE_COLORS[nebula.type] || 'cyan'}>
                  {nebula.type}
                </Badge>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
                <span>
                  <span className="text-gray-500">Қашықтық:</span>{' '}
                  <span className="text-gray-300">{nebula.distance}</span>
                </span>
                <span>
                  <span className="text-gray-500">Өлшемі:</span>{' '}
                  <span className="text-gray-300">{nebula.size}</span>
                </span>
                <span>
                  <span className="text-gray-500">Шоқжұлдыз:</span>{' '}
                  <span className="text-gray-300">{nebula.constellation}</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {nebula.description}
              </p>

              {/* Facts */}
              <ul className="space-y-1.5">
                {nebula.facts.map((fact, fi) => (
                  <motion.li
                    key={fi}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + fi * 0.07, duration: 0.4 }}
                    className="flex items-start gap-2 text-xs text-gray-400"
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: nebula.color }}
                    />
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
