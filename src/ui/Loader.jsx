import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LABELS } from '../data/planets';
import useStore from '../store/useStore';

export default function Loader() {
  const isLoaded = useStore((s) => s.isLoaded);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          {/* Animated solar system icon */}
          <div className="relative w-32 h-32 mb-8">
            {/* Sun */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 shadow-[0_0_30px_rgba(253,184,19,0.8)]" />

            {/* Orbit 1 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-accent/20 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400" />
            </div>

            {/* Orbit 2 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-accent/10 animate-spin" style={{ animationDuration: '5s' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
            </div>

            {/* Orbit 3 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-accent/5 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-600" />
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-accent tracking-[0.3em] mb-4"
          >
            КҮН ЖҮЙЕСІ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm"
          >
            {LABELS.loading}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
