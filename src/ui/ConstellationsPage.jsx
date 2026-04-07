import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout, { Card, Badge } from './PageLayout';

const CONSTELLATIONS = [
  { name: 'Үлкен Аю', nameEn: 'Ursa Major', symbol: 'UMa', stars: 7, mainStar: 'Дубхе', area: 1280, mythology: 'Грек мифінде Зевс Каллистоны аюға айналдырып, аспанға орналастырды. Қазақ халқы «Жеті қарақшы» деп атаған — жеті жарқыраған жұлдыз аспанда «шелек» пішінін құрайды.', season: 'Бүкіл жыл', hemisphere: 'Солтүстік', visible: true },
  { name: 'Кіші Аю', nameEn: 'Ursa Minor', symbol: 'UMi', stars: 7, mainStar: 'Полярлық жұлдыз', area: 256, mythology: 'Кіші Аю шоқжұлдызының ең жарық жұлдызы — Полярлық жұлдыз. Ол әрқашан солтүстікті көрсетеді. Саяхатшылар мен теңізшілер бағдар ретінде пайдаланған.', season: 'Бүкіл жыл', hemisphere: 'Солтүстік', visible: true },
  { name: 'Орион', nameEn: 'Orion', symbol: 'Ori', stars: 7, mainStar: 'Бетелгейзе', area: 594, mythology: 'Грек мифіндегі аңшы Орион. Үш жұлдыздан тұратын «белдігі» ерекше. Ригель мен Бетелгейзе — ең жарық жұлдыздары. Орион тұмандығы — жаңа жұлдыздар туатын орын.', season: 'Қыс', hemisphere: 'Екі жарты шар', visible: true },
  { name: 'Қос егіз', nameEn: 'Gemini', symbol: 'Gem', stars: 2, mainStar: 'Поллукс', area: 514, mythology: 'Кастор мен Поллукс — ажырамас егіз ағайынды. Зевс оларды аспанға жұлдыз етіп орналастырды. Зодиак шоқжұлдызы.', season: 'Қыс', hemisphere: 'Солтүстік', visible: true },
  { name: 'Арыстан', nameEn: 'Leo', symbol: 'Leo', stars: 9, mainStar: 'Регул', area: 947, mythology: 'Грек мифіндегі Немей арыстаны — Геракл жеңген қасқыр. Аспандағы ең танымал шоқжұлдыздардың бірі. Зодиак шоқжұлдызы.', season: 'Көктем', hemisphere: 'Солтүстік', visible: true },
  { name: 'Сарышұнақ', nameEn: 'Scorpius', symbol: 'Sco', stars: 15, mainStar: 'Антарес', area: 497, mythology: 'Грек мифінде Орионды шаққан сарышұнақ. Антарес — «Аресқа қарсы» деген мағынада, қызыл алып жұлдыз. Оның қызыл түсі Марс планетасына ұқсайды.', season: 'Жаз', hemisphere: 'Оңтүстік', visible: true },
  { name: 'Аққу', nameEn: 'Cygnus', symbol: 'Cyg', stars: 9, mainStar: 'Денеб', area: 804, mythology: 'Зевс аққуға айналып, аспанда ұшады. Құс жолы (Млечный путь) осы шоқжұлдыз арқылы өтеді. Денеб — ең жарық жұлдыздарының бірі.', season: 'Жаз-Күз', hemisphere: 'Солтүстік', visible: true },
  { name: 'Лира', nameEn: 'Lyra', symbol: 'Lyr', stars: 5, mainStar: 'Вега', area: 286, mythology: 'Орфейдің лирасы — музыка аспабы. Вега — аспандағы 5-ші жарық жұлдыз. 12,000 жылдан кейін Вега Полярлық жұлдыз болады.', season: 'Жаз', hemisphere: 'Солтүстік', visible: true },
  { name: 'Кассиопея', nameEn: 'Cassiopeia', symbol: 'Cas', stars: 5, mainStar: 'Шедар', area: 598, mythology: 'Грек мифіндегі мақтаншақ патшайым. W немесе M пішінді 5 жұлдыз. Бүкіл жыл бойы солтүстік жарты шарда көрінеді.', season: 'Бүкіл жыл', hemisphere: 'Солтүстік', visible: true },
  { name: 'Андромеда', nameEn: 'Andromeda', symbol: 'And', stars: 3, mainStar: 'Альферац', area: 722, mythology: 'Кассиопеяның қызы. Андромеда галактикасы (M31) осы шоқжұлдызда орналасқан — жалаңаш көзбен көрінетін ең алыс нысан.', season: 'Күз', hemisphere: 'Солтүстік', visible: true },
  { name: 'Өгіз', nameEn: 'Taurus', symbol: 'Tau', stars: 5, mainStar: 'Альдебаран', area: 797, mythology: 'Зевс бұқаға айналып, Европаны алып кетті. Альдебаран — қызғылт сары алып жұлдыз. Плеяда шоғыры (Үркер) осы жерде.', season: 'Қыс', hemisphere: 'Солтүстік', visible: true },
  { name: 'Қарақұс', nameEn: 'Aquila', symbol: 'Aql', stars: 3, mainStar: 'Альтаир', area: 652, mythology: 'Зевстің қыраны. Альтаир жұлдызы — Жазғы үшбұрыштың бір бұрышы. Қазақ аңызында құс тәрізді шоқжұлдыз маңызды рөл атқарады.', season: 'Жаз', hemisphere: 'Екі жарты шар', visible: true },
  { name: 'Кентавр', nameEn: 'Centaurus', symbol: 'Cen', stars: 11, mainStar: 'Альфа Центавр', area: 1060, mythology: 'Грек мифіндегі жарты адам, жарты ат. Альфа Центавр — Күнге ең жақын жұлдыз жүйесі (4.37 жарық жылы).', season: 'Көктем', hemisphere: 'Оңтүстік', visible: false },
  { name: 'Оңтүстік Крест', nameEn: 'Crux', symbol: 'Cru', stars: 4, mainStar: 'Акрукс', area: 68, mythology: 'Ең кіші шоқжұлдыз, бірақ ең танымал. Оңтүстік жарты шарда бағыт көрсетеді. Австралия, Бразилия, Жаңа Зеландия тулардында кездеседі.', season: 'Бүкіл жыл', hemisphere: 'Оңтүстік', visible: false },
  { name: 'Тарта', nameEn: 'Libra', symbol: 'Lib', stars: 4, mainStar: 'Зубенешамали', area: 538, mythology: 'Әділдік таразысы. Жалғыз зодиак шоқжұлдызы — жансыз зат. Бұрын Сарышұнақтың бір бөлігі болған.', season: 'Жаз', hemisphere: 'Оңтүстік', visible: true },
  { name: 'Бикеш', nameEn: 'Virgo', symbol: 'Vir', stars: 9, mainStar: 'Спика', area: 1294, mythology: 'Егін мен құнарлылық құдайы Деметра. Ең үлкен зодиак шоқжұлдызы. Бикеш галактика шоғыры (2000+ галактика) осы жерде.', season: 'Көктем', hemisphere: 'Екі жарты шар', visible: true },
  { name: 'Жыланиесі', nameEn: 'Ophiuchus', symbol: 'Oph', stars: 7, mainStar: 'Расальхаге', area: 948, mythology: '«13-ші зодиак шоқжұлдызы» — Күн 29 қарашадан 18 желтоқсанға дейін осы шоқжұлдыздан өтеді, бірақ дәстүрлі зодиакқа кірмейді.', season: 'Жаз', hemisphere: 'Екі жарты шар', visible: true },
  { name: 'Персей', nameEn: 'Perseus', symbol: 'Per', stars: 6, mainStar: 'Мирфак', area: 615, mythology: 'Грек батыры Персей Медузаны жеңді. Персеид метеор ағыны (тамыз) осы шоқжұлдыздан «ағады». Алгол — «жыпылықтайтын жұлдыз».', season: 'Қыс', hemisphere: 'Солтүстік', visible: true },
  { name: 'Пегас', nameEn: 'Pegasus', symbol: 'Peg', stars: 4, mainStar: 'Маркаб', area: 1121, mythology: 'Қанатты ат Пегас. «Пегас квадраты» — аспандағы ең танымал фигуралардың бірі. Алғашқы ашылған экзопланета (51 Pegasi b) осы шоқжұлдызда.', season: 'Күз', hemisphere: 'Солтүстік', visible: true },
  { name: 'Меңдей', nameEn: 'Aries', symbol: 'Ari', stars: 3, mainStar: 'Хамал', area: 441, mythology: 'Алтын жүнді тоқты. Зодиак белгілерінің бірінші шоқжұлдызы. Көктем теңескенінің нүктесі бұрын осы жерде болған.', season: 'Күз-Қыс', hemisphere: 'Солтүстік', visible: true },
];

const SEASONS = ['Барлығы', 'Қыс', 'Көктем', 'Жаз', 'Күз', 'Бүкіл жыл'];
const HEMISPHERES = ['Барлығы', 'Солтүстік', 'Оңтүстік', 'Екі жарты шар'];

const SYMBOL_COLORS = [
  'from-blue-400 to-indigo-500',
  'from-indigo-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-violet-400 to-indigo-500',
  'from-blue-300 to-cyan-500',
  'from-purple-400 to-blue-500',
  'from-sky-400 to-indigo-500',
  'from-indigo-300 to-blue-500',
];

function getSymbolColor(index) {
  return SYMBOL_COLORS[index % SYMBOL_COLORS.length];
}

function getSeasonColor(season) {
  if (season.includes('Қыс')) return 'blue';
  if (season.includes('Көктем')) return 'emerald';
  if (season.includes('Жаз')) return 'amber';
  if (season.includes('Күз')) return 'purple';
  if (season === 'Бүкіл жыл') return 'cyan';
  return 'cyan';
}

function getHemisphereColor(hemisphere) {
  if (hemisphere === 'Солтүстік') return 'blue';
  if (hemisphere === 'Оңтүстік') return 'red';
  return 'purple';
}

export default function ConstellationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Барлығы');
  const [selectedHemisphere, setSelectedHemisphere] = useState('Барлығы');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filtered = useMemo(() => {
    return CONSTELLATIONS.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mainStar.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeason =
        selectedSeason === 'Барлығы' || c.season.includes(selectedSeason);

      const matchesHemisphere =
        selectedHemisphere === 'Барлығы' || c.hemisphere === selectedHemisphere;

      return matchesSearch && matchesSeason && matchesHemisphere;
    });
  }, [searchQuery, selectedSeason, selectedHemisphere]);

  return (
    <PageLayout
      title="ШОҚЖҰЛДЫЗДАР"
      subtitle="Аспан картасы"
      gradient="from-blue-400 to-indigo-500"
    >
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-6 mb-10"
      >
        {[
          { value: '88', label: 'шоқжұлдыз' },
          { value: '20', label: 'таңдаулы' },
          { value: '~5000', label: 'жыл тарих' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-6 py-3 text-center min-w-[120px]"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text font-mono">
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-6 py-3 text-center min-w-[140px]">
          <div className="text-sm font-semibold text-indigo-300">Ежелгі</div>
          <div className="text-xs text-gray-400 mt-1">замандардан бері</div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Шоқжұлдыз іздеу..."
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8 space-y-4"
      >
        {/* Season filter */}
        <div>
          <div className="text-xs text-gray-500 mb-2 text-center">Маусым бойынша</div>
          <div className="flex flex-wrap justify-center gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSeason === season
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-white/[0.04] text-gray-400 border border-white/5 hover:bg-white/[0.08] hover:text-gray-300'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Hemisphere filter */}
        <div>
          <div className="text-xs text-gray-500 mb-2 text-center">Жарты шар бойынша</div>
          <div className="flex flex-wrap justify-center gap-2">
            {HEMISPHERES.map((hem) => (
              <button
                key={hem}
                onClick={() => setSelectedHemisphere(hem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedHemisphere === hem
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-white/[0.04] text-gray-400 border border-white/5 hover:bg-white/[0.08] hover:text-gray-300'
                }`}
              >
                {hem}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="text-center text-sm text-gray-500 mb-6">
        {filtered.length} шоқжұлдыз табылды
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((constellation, i) => {
          const globalIndex = CONSTELLATIONS.indexOf(constellation);
          const isExpanded = expandedIndex === globalIndex;

          return (
            <Card
              key={constellation.symbol}
              delay={Math.min(i * 0.05, 0.5)}
              onClick={() =>
                setExpandedIndex(isExpanded ? null : globalIndex)
              }
            >
              <div className="flex items-start gap-4">
                {/* Symbol circle */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${getSymbolColor(
                    globalIndex
                  )} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-sm">
                    {constellation.symbol}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {constellation.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {constellation.nameEn}
                  </p>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300">
                      <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{constellation.mainStar}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{constellation.stars} жұлдыз</span>
                      <span>{constellation.area} шаршы град.</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <Badge color={getSeasonColor(constellation.season)}>
                      {constellation.season}
                    </Badge>
                    <Badge color={getHemisphereColor(constellation.hemisphere)}>
                      {constellation.hemisphere}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Expandable mythology */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {constellation.mythology}
                      </p>
                      {!constellation.visible && (
                        <p className="text-xs text-amber-400/70 mt-2">
                          * Қазақстаннан көрінбейді
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand indicator */}
              <div className="flex justify-center mt-3">
                <motion.svg
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-4">*</div>
          <p className="text-gray-400">Шоқжұлдыз табылмады</p>
          <p className="text-gray-600 text-sm mt-1">Сүзгілерді өзгертіп көріңіз</p>
        </motion.div>
      )}
    </PageLayout>
  );
}
