import React from 'react';
import PageLayout, { Card } from './PageLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sections = [
  { path: '/', title: 'Күн жүйесі', desc: 'Планеталар, серіктер және 3D модельдер', color: 'amber', dot: 'bg-yellow-400', glow: 'shadow-amber-500/40', hoverBg: 'from-amber-900/30 to-amber-800/10', border: 'border-amber-500/30' },
  { path: '/missions', title: 'Ғарыш миссиялары', desc: 'Спутниктен Артемисқа дейін', color: 'cyan', dot: 'bg-cyan-400', glow: 'shadow-cyan-500/40', hoverBg: 'from-cyan-900/30 to-cyan-800/10', border: 'border-cyan-500/30', icon: '🚀' },
  { path: '/astronauts', title: 'Ғарышкерлер', desc: 'Гагариннен Аубакировқа дейін', color: 'emerald', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/40', hoverBg: 'from-emerald-900/30 to-emerald-800/10', border: 'border-emerald-500/30' },
  { path: '/rockets', title: 'Ракеталар', desc: 'Saturn V, Falcon 9, Starship', color: 'red', dot: 'bg-red-400', glow: 'shadow-red-500/40', hoverBg: 'from-red-900/30 to-red-800/10', border: 'border-red-500/30' },
  { path: '/telescopes', title: 'Телескоптар', desc: 'Хаббл, Джеймс Уэбб, Кеплер', color: 'purple', dot: 'bg-purple-400', glow: 'shadow-purple-500/40', hoverBg: 'from-purple-900/30 to-purple-800/10', border: 'border-purple-500/30' },
  { path: '/constellations', title: 'Шоқжұлдыздар', desc: '88 шоқжұлдыз және аңыздар', color: 'blue', dot: 'bg-blue-400', glow: 'shadow-blue-500/40', hoverBg: 'from-blue-900/30 to-blue-800/10', border: 'border-blue-500/30' },
  { path: '/exoplanets', title: 'Экзопланеталар', desc: 'Күн жүйесінен тыс әлемдер', color: 'pink', dot: 'bg-pink-400', glow: 'shadow-pink-500/40', hoverBg: 'from-pink-900/30 to-pink-800/10', border: 'border-pink-500/30' },
  { path: '/nebulae', title: 'Тұмандықтар', desc: 'Ғарыштың ең әдемі нысандары', color: 'purple', dot: 'bg-purple-400', glow: 'shadow-purple-500/40', hoverBg: 'from-purple-900/30 to-purple-800/10', border: 'border-purple-500/30' },
  { path: '/blackholes', title: 'Қара тесіктер', desc: 'Ғарыштың ең құпия нысандары', color: 'red', dot: 'bg-red-400', glow: 'shadow-red-500/40', hoverBg: 'from-red-900/30 to-red-800/10', border: 'border-red-500/30' },
  { path: '/quiz', title: 'Ғарыш викторинасы', desc: 'Білімді тексер!', color: 'amber', dot: 'bg-amber-400', glow: 'shadow-amber-500/40', hoverBg: 'from-amber-900/30 to-amber-800/10', border: 'border-amber-500/30' },
  { path: '/documentaries', title: 'Деректі фильмдер', desc: 'Ғарыш туралы бейнелер', color: 'cyan', dot: 'bg-cyan-400', glow: 'shadow-cyan-500/40', hoverBg: 'from-cyan-900/30 to-cyan-800/10', border: 'border-cyan-500/30' },
  { path: '/chat', title: 'AI Көмекші', desc: 'Ғарыш туралы сұрақтар қой', color: 'emerald', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/40', hoverBg: 'from-emerald-900/30 to-emerald-800/10', border: 'border-emerald-500/30' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function ExplorePage() {
  return (
    <PageLayout
      title="ҒАРЫШ ЭНЦИКЛОПЕДИЯСЫ"
      subtitle="Ғарышты зерттеңіз"
      gradient="from-cyan-400 to-purple-500"
    >
      {/* Stats bar */}
      <div className="text-center mb-10">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm text-gray-400 tracking-wide"
        >
          9 планета &bull; 15+ серік &bull; 8 жұлдыз &bull; 6 галактика &bull; 50+ мақала
        </motion.p>
      </div>

      {/* Navigation grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto px-4 pb-20"
      >
        {sections.map((section, index) => (
          <motion.div key={section.path} variants={cardVariants}>
            <Link to={section.path} className="block group">
              <div
                className={`
                  relative overflow-hidden rounded-2xl border ${section.border}
                  bg-white/[0.03] backdrop-blur-sm
                  p-5 transition-all duration-300
                  hover:bg-gradient-to-br ${section.hoverBg}
                  hover:shadow-lg hover:${section.glow}
                  hover:scale-[1.02] hover:border-opacity-60
                `}
              >
                {/* Colored dot indicator */}
                <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${section.dot}`} />

                {/* Content */}
                <div className="pl-6 pr-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                      {section.icon && <span className="text-xl">{section.icon}</span>}
                      {section.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{section.desc}</p>
                  </div>

                  {/* Arrow icon */}
                  <div className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover glow overlay */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-500 pointer-events-none
                    bg-gradient-to-br ${section.hoverBg}
                  `}
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
