import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PageLayout({ children, title, subtitle, gradient = 'from-cyan-400 to-blue-500' }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, () => ({
        w: Math.random() * 2.5 + 0.5,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
        dur: 2 + Math.random() * 5,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="fixed inset-0 bg-[#000005] text-white overflow-y-auto z-50">
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w, height: s.w,
              left: s.left, top: s.top,
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm hidden sm:inline">Күн жүйесі</span>
            </Link>
            <div className="w-px h-5 bg-white/10 hidden sm:block" />
            <Link to="/explore" className="text-sm text-gray-400 hover:text-accent transition-colors hidden sm:block">
              Барлық бөлімдер
            </Link>
          </div>
          <h1 className="text-xs sm:text-sm font-bold tracking-[0.15em] text-accent">{title}</h1>
        </div>
      </header>

      {/* Hero */}
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center pt-10 pb-6 px-4"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
              {subtitle}
            </span>
          </h2>
        </motion.div>
      )}

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        {children}
      </main>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export function Card({ children, className = '', delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] p-5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl sm:text-2xl font-bold mb-6 text-white ${className}`}>
      {children}
    </h3>
  );
}

export function Badge({ children, color = 'cyan' }) {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${colors[color] || colors.cyan}`}>
      {children}
    </span>
  );
}

export function StatBox({ label, value, unit, icon }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center">
      {icon && <div className="text-lg mb-1">{icon}</div>}
      <div className="text-lg sm:text-xl font-bold text-accent font-mono">{value}</div>
      {unit && <div className="text-[10px] text-gray-500">{unit}</div>}
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}
