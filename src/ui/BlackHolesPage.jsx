import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const BLACKHOLES = [
  {
    name: 'Sagittarius A*',
    nameEn: 'Стрелец A*',
    location: 'Құс жолы галактикасының орталығы',
    mass: '4.3 млн Күн массасы',
    distance: '26,000 жарық жылы',
    diameter: '~44 млн км',
    type: 'Ультрамассивті',
    description:
      'Біздің галактикамыздың орталығындағы ультрамассивті қара тесік. 2022 жылы Event Horizon Telescope алғашқы суретін түсірді. Айналасында жұлдыздар сағатына миллиондаған км жылдамдықпен айналады.',
    facts: [
      '2022 жылы суреті түсірілді (EHT)',
      'Жанында S2 жұлдызы 7650 км/с жылдамдықпен ұшады',
      'Айналасындағы газ 10 млрд °C температурада',
      'Құс жолының орталығы осы нысан',
    ],
    color: '#f97316',
  },
  {
    name: 'M87*',
    nameEn: 'Messier 87*',
    location: 'M87 галактикасы',
    mass: '6.5 млрд Күн массасы',
    distance: '55 млн жарық жылы',
    diameter: '~38 млрд км',
    type: 'Ультрамассивті',
    description:
      'Адамзат тарихында алғашқы суреті түсірілген қара тесік (2019). M87 галактикасының орталығында. 5000 жарық жылы ұзындығында плазма ағыны (джет) шығарады.',
    facts: [
      'Алғашқы суреті 2019 жылы (EHT)',
      'Массасы Күннен 6.5 млрд есе ауыр',
      '5000 жарық жылы ұзындықтағы джет шығарады',
      'Суретін алу үшін Жер өлшемді телескоп керек болды',
    ],
    color: '#ef4444',
  },
  {
    name: 'Cygnus X-1',
    nameEn: 'Аққу X-1',
    location: 'Аққу шоқжұлдызы',
    mass: '21.2 Күн массасы',
    distance: '6,070 жарық жылы',
    diameter: '~90 км',
    type: 'Жұлдыздық',
    description:
      'Алғашқы анықталған қара тесік кандидаты (1964). Стивен Хокинг пен Кип Торн осы нысан бойынша бәс тіккен — Хокинг 1990 жылы ұтылғанын мойындады.',
    facts: [
      'Алғашқы анықталған қара тесік',
      'Хокинг бәс тігіп, ұтылды',
      'Серік жұлдызынан материя сорады',
      'Рентген сәулелері шығарады',
    ],
    color: '#3b82f6',
  },
  {
    name: 'TON 618',
    nameEn: 'TON 618',
    location: 'Тазы иттері шоқжұлдызы',
    mass: '66 млрд Күн массасы',
    distance: '10.4 млрд жарық жылы',
    diameter: '~390 млрд км',
    type: 'Ультрамассивті',
    description:
      'Белгілі ең массивті қара тесіктердің бірі. Массасы Күннен 66 миллиард есе ауыр. Диаметрі — бүкіл Күн жүйесінен 40 есе үлкен. Квазар ядросы.',
    facts: [
      'Күн жүйесінен 40 есе үлкен',
      'Массасы — 66 млрд Күн массасы',
      'Жарықтығы — Күннен 140 триллион есе',
      'Ең алыс белгілі қара тесіктердің бірі',
    ],
    color: '#8b5cf6',
  },
  {
    name: 'GRS 1915+105',
    nameEn: 'GRS 1915+105',
    location: 'Қарақұс шоқжұлдызы',
    mass: '12.4 Күн массасы',
    distance: '36,000 жарық жылы',
    diameter: '~70 км',
    type: 'Жұлдыздық',
    description:
      'Жарық жылдамдығына жақын жылдамдықпен материя атқылайтын микроквазар. Құс жолындағы ең массивті жұлдыздық қара тесіктердің бірі.',
    facts: [
      'Жарық жылдамдығының 92%-на жететін джеттер',
      'Ең ауыр жұлдыздық қара тесіктердің бірі',
      '1992 жылы гамма-сәулелермен ашылды',
      'Микроквазар — миниатюралы квазар',
    ],
    color: '#06b6d4',
  },
];

const TYPES = [
  {
    title: 'Жұлдыздық',
    subtitle: 'Stellar',
    description: '3-100 Күн массасы. Жұлдыз жарылысынан пайда болады. Құс жолында миллиондаған бар.',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Аралық',
    subtitle: 'Intermediate',
    description: '100-100,000 Күн массасы. Сирек кездеседі. Шоғырлардың орталығында болуы мүмкін.',
    color: '#a855f7',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    title: 'Ультрамассивті',
    subtitle: 'Supermassive',
    description: 'Миллиондаған-миллиардтаған Күн массасы. Барлық галактикалардың орталығында бар.',
    color: '#ef4444',
    gradient: 'from-red-500 to-red-700',
  },
];

const FUN_FACTS = [
  { icon: '⏳', title: 'Уақыт баяулайды', text: 'Қара тесікке жақындаған сайын уақыт баяулайды (гравитациялық уақыт дилатациясы)' },
  { icon: '🍝', title: 'Спагеттификация', text: 'Қара тесік сізді спагетти сияқты созады' },
  { icon: '❓', title: 'Ақпарат парадоксы', text: 'Қара тесікке түскен ақпарат жойылмайды — Хокингтің болжамы' },
  { icon: '🌡️', title: 'Хокинг сәулеленуі', text: 'Қара тесіктер баяу буланады — кванттық эффект' },
  { icon: '💨', title: 'Жарық жылдамдығынан тез', text: 'Қара тесік ішінде кеңістік жарық жылдамдығынан тез «құлайды»' },
  { icon: '🌀', title: 'Уормхол', text: 'Қара тесіктер ғарыштың басқа нүктелеріне жол ашуы мүмкін (теориялық)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlackHolesPage() {
  const [selectedHole, setSelectedHole] = useState(null);

  return (
    <PageLayout title="ҚАРА ТЕСІКТЕР" subtitle="Ғарыштың ең құпия нысандары" gradient="from-red-500 to-purple-600">
      {/* CSS-only Black Hole Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex justify-center mb-12"
      >
        <div className="blackhole-visual relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border-2 border-orange-500/30 animate-[bhSpin_8s_linear_infinite]" />
          <div className="absolute w-[85%] h-[85%] rounded-full border-2 border-red-500/40 animate-[bhSpin_6s_linear_infinite_reverse]" />
          <div className="absolute w-[70%] h-[70%] rounded-full border-2 border-orange-400/50 animate-[bhSpin_5s_linear_infinite]" />
          <div className="absolute w-[55%] h-[55%] rounded-full border-2 border-red-400/60 animate-[bhSpin_4s_linear_infinite_reverse]" />
          <div className="absolute w-[40%] h-[40%] rounded-full border border-orange-300/70 animate-[bhSpin_3s_linear_infinite]" />
          <div className="absolute w-[28%] h-[28%] rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 animate-[bhPulse_3s_ease-in-out_infinite]" />
          <div className="absolute w-[18%] h-[18%] rounded-full bg-black shadow-[0_0_60px_20px_rgba(249,115,22,0.3),0_0_120px_40px_rgba(239,68,68,0.15)]" />
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 mb-10"
      >
        <StatBox icon="🕳️" value="Мыңдаған" label="қара тесік" />
        <StatBox icon="📅" value="1964" label="жылдан бері" />
        <StatBox icon="🔮" value="Ғаламның" label="ең құпиясы" />
      </motion.div>

      {/* Section 1: What is a black hole */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          Қара тесік дегеніміз не?
        </h3>
        <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-red-500/20 p-6 sm:p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 pointer-events-none" />
          <p className="relative text-gray-300 leading-relaxed text-sm sm:text-base">
            Қара тесік — гравитациясы соншалықты күшті, тіпті жарық та шыға алмайтын ғарыш нысаны. Массивті жұлдыз
            жарылғанда, оның ядросы өз-өзіне құлап, кеңістік-уақытта «тесік» жасайды. Оқиға горизонты — қайтып шыға
            алмайтын шекара.
          </p>
        </div>
      </motion.section>

      {/* Section 2: Types of Black Holes */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-12"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          Қара тесіктердің түрлері
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TYPES.map((t, i) => (
            <Card key={t.title} delay={0.6 + i * 0.1} className="!border-transparent">
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${t.color}22, transparent)`,
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  border: `1px solid ${t.color}44`,
                  borderRadius: 'inherit',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: `0 0 12px ${t.color}88` }} />
                  <h4 className="font-bold text-white">{t.title}</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2 italic">{t.subtitle}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{t.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Section 3: Famous Black Holes */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          Атақты қара тесіктер
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLACKHOLES.map((bh, i) => (
            <motion.div key={bh.name} variants={itemVariants}>
              <Card
                delay={0}
                className="!border-transparent h-full"
                onClick={() => setSelectedHole(selectedHole === i ? null : i)}
              >
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    border: `1px solid ${bh.color}33`,
                    borderRadius: 'inherit',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${bh.color}11, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg" style={{ color: bh.color }}>
                      {bh.name}
                    </h4>
                    <Badge color={bh.type === 'Жұлдыздық' ? 'blue' : 'red'}>{bh.type}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{bh.nameEn} — {bh.location}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/[0.04] rounded-lg p-2 text-center">
                      <div className="text-[10px] text-gray-500">Масса</div>
                      <div className="text-xs font-bold text-gray-200">{bh.mass}</div>
                    </div>
                    <div className="bg-white/[0.04] rounded-lg p-2 text-center">
                      <div className="text-[10px] text-gray-500">Қашықтық</div>
                      <div className="text-xs font-bold text-gray-200">{bh.distance}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">{bh.description}</p>

                  {selectedHole === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="text-xs text-gray-500 mb-2">Диаметрі: {bh.diameter}</div>
                      <ul className="space-y-1.5">
                        {bh.facts.map((fact, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-gray-400">
                            <span style={{ color: bh.color }} className="mt-0.5">&#9679;</span>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <div className="mt-3 text-[10px] text-gray-600 text-center">
                    {selectedHole === i ? 'Жабу' : 'Толығырақ'}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 4: Fun Facts */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-12"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          Қызықты фактілер
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUN_FACTS.map((fact, i) => (
            <Card key={fact.title} delay={0.9 + i * 0.08}>
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-red-500/5 to-purple-500/5" />
              <div className="relative flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-0.5">{fact.icon}</div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">{fact.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{fact.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* CSS Animations */}
      <style>{`
        @keyframes bhSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bhPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </PageLayout>
  );
}
