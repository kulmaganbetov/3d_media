import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const W = (file, width = 600) =>
  `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
const TELESCOPES = [
  {
    name: 'Хаббл',
    nameEn: 'Hubble Space Telescope',
    year: 1990,
    status: 'Белсенді',
    orbit: '547 км',
    mass: '11,110 кг',
    mirror: '2.4 м',
    wavelength: 'Көрінетін, УК, ЖҚ',
    agency: 'NASA/ESA',
    lifetime: '34+ жыл',
    discoveries: '1.5 млн+ бақылау',
    description:
      'Хаббл — ғарыш астрономиясын революциялаған телескоп. Deep Field суреттері ғаламның тереңдігін алғаш рет көрсетті. Ғаламның кеңею жылдамдығын нақтылады.',
    highlights: [
      'Ғаламның жасын 13.8 млрд жыл деп анықтады',
      'Экзопланеталар атмосферасын зерттеді',
      '«Тіршілік бағаналары» суретін түсірді',
      '5 рет жөнделді (shuttle миссиялары)',
    ],
    color: '#a855f7',
    image: W('HST-SM4.jpg', 600),
  },
  {
    name: 'Джеймс Уэбб',
    nameEn: 'James Webb Space Telescope',
    year: 2021,
    status: 'Белсенді',
    orbit: 'L2 нүктесі (1.5 млн км)',
    mass: '6,500 кг',
    mirror: '6.5 м',
    wavelength: 'Инфрақызыл',
    agency: 'NASA/ESA/CSA',
    lifetime: '20+ жыл (жоспар)',
    discoveries: 'Алғашқы галактикалар',
    description:
      'Джеймс Уэбб — адамзат жасаған ең қуатты телескоп. Алғашқы жұлдыздар мен галактикаларды, экзопланеталар атмосферасын зерттеуге арналған. Алтынмен қапталған 6.5 м айна.',
    highlights: [
      'Хабблден 100 есе қуатты',
      'Ғаламның алғашқы 200 млн жылын көре алады',
      'Күн қалқаны теннис кортындай',
      'Экзопланетада су буын тапты (WASP-96b)',
    ],
    color: '#f59e0b',
    image: W("Webb's_First_Deep_Field.jpg", 600),
  },
  {
    name: 'Кеплер',
    nameEn: 'Kepler Space Telescope',
    year: 2009,
    status: 'Аяқталды (2018)',
    orbit: 'Күн орбитасы',
    mass: '1,052.4 кг',
    mirror: '0.95 м',
    wavelength: 'Көрінетін жарық',
    agency: 'NASA',
    lifetime: '9.5 жыл',
    discoveries: '2,662 экзопланета',
    description:
      'Кеплер — экзопланеталарды іздеуге арнайы жасалған телескоп. Транзит әдісімен 2600+ экзопланета тапты. Ғаламда миллиардтаған планета бар екенін дәлелдеді.',
    highlights: [
      '2,662 экзопланета тапты',
      'Тұрғылықты аймақта 50+ планета анықтады',
      '530,506 жұлдызды бақылады',
      'K2 миссиясы — 2-ші өмір',
    ],
    color: '#06b6d4',
    image: W('KeplerSpaceTelescope-20130103-717260main_702702.jpg', 600),
  },
  {
    name: 'Чандра',
    nameEn: 'Chandra X-ray Observatory',
    year: 1999,
    status: 'Белсенді',
    orbit: '16,000–133,000 км',
    mass: '4,790 кг',
    mirror: '1.2 м (4 қабат)',
    wavelength: 'Рентген сәулесі',
    agency: 'NASA',
    lifetime: '25+ жыл',
    discoveries: 'Қара тесіктер, нейтрондық жұлдыздар',
    description:
      'Чандра — рентген сәулелерімен ғарышты зерттейтін телескоп. Қара тесіктер, жарылған жұлдыздар, қараңғы материяны зерттеуде маңызды рөл атқарады.',
    highlights: [
      'Қара тесіктердің рентген сәулелерін зерттеді',
      'Қараңғы материя картасын жасауға көмектесті',
      'Жұлдыз жарылыстарының қалдықтарын бақылады',
      'Ең биік орбиталы телескоп',
    ],
    color: '#ef4444',
    image: W('Chandra_X-ray_Observatory.jpg', 600),
  },
  {
    name: 'Спитцер',
    nameEn: 'Spitzer Space Telescope',
    year: 2003,
    status: 'Аяқталды (2020)',
    orbit: 'Күн орбитасы',
    mass: '861 кг',
    mirror: '0.85 м',
    wavelength: 'Инфрақызыл',
    agency: 'NASA',
    lifetime: '16 жыл',
    discoveries: 'TRAPPIST-1 жүйесі',
    description:
      'Спитцер — инфрақызыл телескоп, шаң мен газ бұлттарының артындағы нысандарды көре алды. TRAPPIST-1 жүйесінде 7 жер тәрізді планета тапты.',
    highlights: [
      'TRAPPIST-1 жүйесінде 7 планета тапты',
      'Ең алыс галактикаларды бақылады',
      'Сатурнның жаңа сақинасын тапты',
      'Жұлдыз түзілу аймақтарын зерттеді',
    ],
    color: '#22c55e',
    image: W('Spitzer_space_telescope.jpg', 600),
  },
  {
    name: 'TESS',
    nameEn: 'Transiting Exoplanet Survey Satellite',
    year: 2018,
    status: 'Белсенді',
    orbit: '108,000–373,000 км',
    mass: '362 кг',
    mirror: '4 × 10.5 см линза',
    wavelength: 'Көрінетін/ЖҚ',
    agency: 'NASA',
    lifetime: '6+ жыл',
    discoveries: '400+ экзопланета',
    description:
      'TESS — аспанның 85%-ын зерттейтін экзопланета аңшысы. Кеплердің ісін жалғастырушы. Жақын жұлдыздар айналасындағы планеталарды іздейді.',
    highlights: [
      'Аспанның 85%-ын қамтиды',
      'Кеплерден 400 есе көп аймақты бақылайды',
      'Жақын жұлдыздардағы планеталарға фокус',
      'TOI каталогы — мыңдаған кандидат',
    ],
    color: '#3b82f6',
    image: W('Transiting_Exoplanet_Survey_Satellite_artist_concept_(transparent_background).png', 600),
  },
];

const MAX_MIRROR = 6.5;

function parseMirrorSize(mirror) {
  const match = mirror.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

const FILTERS = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Белсенді', value: 'active' },
  { label: 'Аяқталды', value: 'completed' },
];

export default function TelescopesPage() {
  const [filter, setFilter] = useState('all');

  const filtered = TELESCOPES.filter((t) => {
    if (filter === 'active') return t.status === 'Белсенді';
    if (filter === 'completed') return t.status.startsWith('Аяқталды');
    return true;
  });

  return (
    <PageLayout
      title="ҒАРЫШ ТЕЛЕСКОПТАРЫ"
      subtitle="Ғаламға терезе"
      gradient="from-purple-400 to-pink-500"
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8 max-w-xl mx-auto">
        <StatBox label="Телескоптар" value="6" icon="🔭" />
        <StatBox label="Экзопланеталар" value="4,000+" icon="🪐" />
        <StatBox label="Бастапқы жыл" value="1990" unit="жылдан бері" icon="📅" />
      </div>

      {/* Filter buttons */}
      <div className="flex justify-center gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              filter === f.value
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Telescope cards */}
      <div className="space-y-6">
        {filtered.map((telescope, index) => {
          const mirrorSize = parseMirrorSize(telescope.mirror);
          const mirrorPercent = (mirrorSize / MAX_MIRROR) * 100;
          const isActive = telescope.status === 'Белсенді';

          return (
            <motion.div
              key={telescope.nameEn}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.005 }}
              className="relative group"
            >
              {/* Hover glow */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${telescope.color}22, #ec489922)`,
                }}
              />

              <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 group-hover:border-purple-500/30 transition-all duration-300">
                {/* Telescope image */}
                {telescope.image && (
                  <div className="relative h-48 overflow-hidden bg-black/30">
                    <img
                      src={telescope.image}
                      alt={telescope.name}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000005] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: telescope.color }} />
                  </div>
                )}

                <div className="p-5 sm:p-6">
                {/* Top: status badge + name */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {telescope.name}
                      </h3>
                      <Badge color={isActive ? 'emerald' : 'cyan'}>
                        {telescope.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{telescope.nameEn}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: telescope.color }}
                    />
                    {telescope.year} · {telescope.lifetime}
                  </div>
                </div>

                {/* Key specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                  {[
                    { label: 'Айна', value: telescope.mirror },
                    { label: 'Масса', value: telescope.mass },
                    { label: 'Орбита', value: telescope.orbit },
                    { label: 'Толқын ұзындығы', value: telescope.wavelength },
                    { label: 'Агенттік', value: telescope.agency },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-white/[0.04] rounded-lg px-3 py-2 border border-white/5"
                    >
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                        {spec.label}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {telescope.description}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {telescope.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-cyan-400 mt-0.5 shrink-0">&#9679;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mirror size comparison bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Айна өлшемі салыстыру</span>
                    <span className="font-mono text-gray-400">{telescope.mirror}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mirrorPercent}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${telescope.color}, ${telescope.color}88)`,
                      }}
                    />
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageLayout>
  );
}
