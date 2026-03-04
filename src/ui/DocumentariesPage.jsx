import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VIDEOS = [
  {
    id: 'Lert9K_4VjU',
    title: 'Ғарыштың шексіздігі — Құпия әлем',
    description: 'Ғаламның құрылымы мен оның шексіз кеңістіктері туралы таңғажайып деректі фильм.',
  },
  {
    id: '4_muMnYZabw',
    title: 'Күн жүйесінің құпиялары',
    description: 'Біздің Күн жүйесіндегі планеталар, серіктер және басқа ғарыш денелері туралы.',
  },
  {
    id: 'OhDu0Azu0Kc',
    title: 'Ғаламның ең үлкен құрылымдары',
    description: 'Галактикалар, тұмандықтар және ғаламның ауқымы туралы керемет саяхат.',
  },
  {
    id: 'S3ET7O5j8zI',
    title: 'Қара тесіктер — Ғарыштың жұтқыштары',
    description: 'Қара тесіктердің табиғаты, олардың пайда болуы және ғаламдағы рөлі туралы.',
  },
];

function VideoCard({ video, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.5 }}
      className="group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
        {/* YouTube Embed */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-base mb-1 group-hover:text-accent transition-colors">
            {video.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {video.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function DocumentariesPage() {
  return (
    <div className="min-h-screen bg-[#000005] text-white">
      {/* Starry background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Күн жүйесі</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <h1 className="text-sm font-bold tracking-[0.2em] text-accent">
              ҒАРЫШ ДЕРЕКТІ ФИЛЬМДЕР
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Ғарыш туралы
            </span>{' '}
            қызықты бейнелер
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Ғаламның құпияларын ашатын таңдаулы деректі фильмдер мен бейнелер жинағы.
            Әр бейнені тікелей осы жерден көре аласыз.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-xs mt-10 mb-6"
        >
          Бейнелер YouTube платформасынан алынған. Авторлық құқықтар бейне авторларына тиесілі.
        </motion.p>
      </main>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
