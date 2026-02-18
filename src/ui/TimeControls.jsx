import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { LABELS } from '../data/planets';

const SPEEDS = [1, 10, 100, 1000, 10000];

export default function TimeControls() {
  const isPaused = useStore((s) => s.isPaused);
  const togglePause = useStore((s) => s.togglePause);
  const speedMultiplier = useStore((s) => s.speedMultiplier);
  const setSpeedMultiplier = useStore((s) => s.setSpeedMultiplier);
  const realPositions = useStore((s) => s.realPositions);
  const toggleRealPositions = useStore((s) => s.toggleRealPositions);
  const simDate = useStore((s) => s.simDate);
  const setSimDate = useStore((s) => s.setSimDate);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetDate = () => {
    setSimDate(new Date());
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('kk-KZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap justify-center"
    >
      {/* Play/Pause */}
      <button
        onClick={togglePause}
        className="w-9 h-9 rounded-xl bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent transition-colors"
        title={isPaused ? LABELS.play : LABELS.pause}
      >
        {isPaused ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>

      {/* Speed selector */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-500 mr-1">{LABELS.speed}:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeedMultiplier(s)}
            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
              speedMultiplier === s
                ? 'bg-accent/20 text-accent'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10" />

      {/* Real positions toggle */}
      <button
        onClick={toggleRealPositions}
        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
          realPositions
            ? 'bg-accent/20 text-accent border border-accent/30'
            : 'text-gray-500 hover:text-gray-300 bg-white/5'
        }`}
      >
        {realPositions ? LABELS.realPositions : LABELS.demoMode}
      </button>

      {/* Date display */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="text-xs text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg px-3 py-1.5"
        >
          <span className="block text-[10px] text-gray-600">{LABELS.date}</span>
          <span className="font-mono">{formatDate(simDate)}</span>
        </button>

        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-strong rounded-xl p-3 z-50"
          >
            <input
              type="date"
              value={simDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setSimDate(new Date(e.target.value));
                setShowDatePicker(false);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
            />
            <button
              onClick={() => { resetDate(); setShowDatePicker(false); }}
              className="mt-2 w-full text-xs text-accent bg-accent/10 rounded-lg py-1.5 hover:bg-accent/20 transition-colors"
            >
              {LABELS.reset}
            </button>
          </motion.div>
        )}
      </div>

      {/* Current time */}
      <div className="text-xs text-gray-500 font-mono hidden sm:block">
        {formatTime(simDate)}
      </div>
    </motion.div>
  );
}
