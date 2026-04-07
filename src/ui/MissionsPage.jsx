import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout, { Card, Badge, StatBox } from './PageLayout';

const W = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
const MISSIONS = [
  { year: 1957, name: 'Спутник-1', country: 'КСРО', type: 'Жер орбитасы', description: 'Алғашқы жасанды жер серігі. Ғарыш дәуірінің басталуы.', details: 'Массасы 83.6 кг. 21 тәулік жұмыс істеді. «Бип-бип» сигналы бүкіл әлемді таңғалдырды.', image: `${W}/b/be/Sputnik_asm.jpg/400px-Sputnik_asm.jpg` },
  { year: 1961, name: 'Восток-1', country: 'КСРО', type: 'Адам ұшырылымы', description: 'Юрий Гагарин — ғарышқа ұшқан алғашқы адам.', details: '108 минутта Жерді айналып шықты. «Поехали!» сөзі тарихқа кірді.', image: `${W}/d/da/Yuri_Gagarin_%281961%29_-_Restoration.jpg/400px-Yuri_Gagarin_%281961%29_-_Restoration.jpg` },
  { year: 1969, name: 'Аполлон-11', country: 'АҚШ', type: 'Айға қону', description: 'Нил Армстронг пен Базз Олдрин Айға аяқ басты.', details: '«Адамзат үшін алып қадам». 21 сағат 36 минут Ай бетінде болды.', image: `${W}/9/98/Aldrin_Apollo_11_original.jpg/400px-Aldrin_Apollo_11_original.jpg` },
  { year: 1971, name: 'Марс-3', country: 'КСРО', type: 'Марс миссиясы', description: 'Марс бетіне алғашқы жұмсақ қону.', details: '14.5 секунд деректер жіберді. Алғашқы Марс суреті.', image: `${W}/a/a3/Mars_3_lander_vsm.jpg/400px-Mars_3_lander_vsm.jpg` },
  { year: 1977, name: 'Вояджер 1 & 2', country: 'АҚШ', type: 'Ғарыш зерттеуі', description: 'Күн жүйесінен шыққан алғашқы аппараттар.', details: 'Вояджер-1 — Жерден ең алыс адам жасаған нысан. 24 млрд км қашықтықта.', image: `${W}/6/60/Voyager_spacecraft_model.png/400px-Voyager_spacecraft_model.png` },
  { year: 1990, name: 'Хаббл телескопы', country: 'АҚШ/ESA', type: 'Телескоп', description: 'Орбиталық телескоп ғарышты зерттеу тарихын өзгертті.', details: '1.5 млн+ сурет түсірді. Deep Field суреті ғаламның тереңдігін көрсетті.', image: `${W}/3/3f/HST-SM4.jpg/400px-HST-SM4.jpg` },
  { year: 1991, name: 'Аубакиров ұшуы', country: 'Қазақстан/КСРО', type: 'Адам ұшырылымы', description: 'Тоқтар Аубакиров — алғашқы қазақ ғарышкер.', details: 'Союз ТМ-13 кемесімен ұшты. Мир станциясында 7 тәулік 22 сағат болды.', image: `${W}/2/24/Toktar_Aubakirov_MIR.jpg/400px-Toktar_Aubakirov_MIR.jpg` },
  { year: 1998, name: 'ХҒС құрылысы', country: 'Халықаралық', type: 'Ғарыш станциясы', description: 'Халықаралық ғарыш станциясының құрылысы басталды.', details: '16 ел қатысты. 2000 жылдан бері адамдар тұрақты тұрады.', image: `${W}/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/400px-International_Space_Station_after_undocking_of_STS-132.jpg` },
  { year: 2012, name: 'Curiosity', country: 'АҚШ', type: 'Марс миссиясы', description: 'Марс бетіндегі ең жетілдірілген ровер.', details: 'Марста бұрын сұйық су болғанын дәлелдеді. 2024 жылға дейін жұмыс істеді.', image: `${W}/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg/400px-Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg` },
  { year: 2021, name: 'Джеймс Уэбб', country: 'АҚШ/ESA/CSA', type: 'Телескоп', description: 'Ең қуатты ғарыш телескопы жіберілді.', details: 'Алғашқы жұлдыздар мен галактикаларды көре алады. L2 нүктесінде орналасқан.', image: `${W}/e/e2/Webb%27s_First_Deep_Field.jpg/400px-Webb%27s_First_Deep_Field.jpg` },
  { year: 2024, name: 'Artemis II', country: 'АҚШ', type: 'Ай миссиясы', description: 'Адамдарды қайта Айға жіберу бағдарламасы.', details: '50+ жылдан кейін адамдар қайта Айға барады.', image: `${W}/7/7c/Orion_with_service_module.jpg/400px-Orion_with_service_module.jpg` },
  { year: 2025, name: 'Starship Mars', country: 'SpaceX', type: 'Марс миссиясы', description: 'Марсқа адам жіберу жоспары.', details: 'Илон Маск адамзатты көппланеталық түр етуді мақсат етеді.', image: `${W}/1/16/Starship_stacked_2025_%28cropped%29.jpg/400px-Starship_stacked_2025_%28cropped%29.jpg` },
];

const TYPE_COLORS = {
  'Жер орбитасы': 'cyan',
  'Адам ұшырылымы': 'blue',
  'Айға қону': 'amber',
  'Марс миссиясы': 'red',
  'Ғарыш зерттеуі': 'purple',
  'Телескоп': 'emerald',
  'Ғарыш станциясы': 'pink',
  'Ай миссиясы': 'amber',
};

export default function MissionsPage() {
  const [activeFilter, setActiveFilter] = useState('Барлығы');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const uniqueTypes = ['Барлығы', ...Array.from(new Set(MISSIONS.map((m) => m.type)))];

  const filtered = activeFilter === 'Барлығы'
    ? MISSIONS
    : MISSIONS.filter((m) => m.type === activeFilter);

  return (
    <PageLayout title="ҒАРЫШ МИССИЯЛАРЫ" subtitle="Ғарышты бағындыру тарихы" gradient="from-cyan-400 to-blue-500">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10"
      >
        <StatBox label="Тарих" value="65+" unit="жыл" icon="🕰️" />
        <StatBox label="Миссиялар" value="12+" unit="миссия" icon="🚀" />
        <StatBox label="Елдер" value="20+" unit="ел" icon="🌍" />
      </motion.div>

      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => { setActiveFilter(type); setExpandedIndex(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              activeFilter === type
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Glowing vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/60 via-blue-500/40 to-cyan-400/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/30 via-blue-500/20 to-transparent blur-sm w-1 -translate-x-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-blue-500/10 to-transparent blur-md w-2 -translate-x-[3px]" />
        </div>

        {/* Mobile line */}
        <div className="absolute left-6 top-0 bottom-0 w-px md:hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/60 via-blue-500/40 to-cyan-400/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/30 via-blue-500/20 to-transparent blur-sm w-1" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((mission, index) => {
              const isLeft = index % 2 === 0;
              const isExpanded = expandedIndex === index;
              const badgeColor = TYPE_COLORS[mission.type] || 'cyan';

              return (
                <motion.div
                  key={mission.year + mission.name}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`relative flex items-start mb-10 md:mb-14 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6">
                    <div className="w-4 h-4 rounded-full bg-[#000005] border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-14 shrink-0 md:hidden" />

                  {/* Card side */}
                  <div className={`md:w-[calc(50%-2rem)] w-full ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card
                      delay={index * 0.1 + 0.15}
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="group"
                    >
                      {/* Mission image */}
                      {mission.image && (
                        <div className="relative h-36 -mx-4 -mt-4 mb-4 overflow-hidden rounded-t-xl bg-black/30">
                          <img
                            src={mission.image}
                            alt={mission.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
                        </div>
                      )}

                      {/* Year */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                          {mission.year}
                        </span>
                        <Badge color={badgeColor}>{mission.type}</Badge>
                      </div>

                      {/* Name & Country */}
                      <h4 className="text-lg font-bold text-white mb-1">{mission.name}</h4>
                      <div className="mb-3">
                        <Badge color="purple">{mission.country}</Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 leading-relaxed">{mission.description}</p>

                      {/* Expandable details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-sm text-cyan-300/80 leading-relaxed">{mission.details}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand indicator */}
                      <div className="flex justify-center mt-3">
                        <motion.svg
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </Card>
                  </div>

                  {/* Empty spacer for the other side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* End cap */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 bottom-0 z-10">
          <div className="w-3 h-3 rounded-full bg-cyan-400/30 border border-cyan-400/50" />
        </div>
      </div>
    </PageLayout>
  );
}
