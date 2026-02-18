import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANETS, LABELS } from '../data/planets';
import useStore from '../store/useStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);

  const results = query.length > 0
    ? PLANETS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.nameEn.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const selectPlanet = (planet) => {
    setSelectedPlanet(planet);
    // Approximate position for camera fly-to
    setCameraTarget({
      position: { x: planet.distance, y: 0, z: 0 },
      radius: planet.radius,
    });
    setQuery('');
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="glass rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">{LABELS.search}</span>
        <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-500">/</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 glass-strong rounded-xl overflow-hidden z-50"
          >
            <div className="p-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={LABELS.search}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results.length > 0) {
                    selectPlanet(results[0]);
                  }
                }}
              />
            </div>

            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto px-2 pb-2">
                {results.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => selectPlanet(planet)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: planet.color }}
                    />
                    <div>
                      <p className="text-sm text-white">{planet.name}</p>
                      <p className="text-[10px] text-gray-500">{planet.nameEn}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length > 0 && results.length === 0 && (
              <p className="px-4 pb-3 text-sm text-gray-500">Нәтиже табылмады</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
