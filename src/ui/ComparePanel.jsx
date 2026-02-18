import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { LABELS } from '../data/planets';

const COMPARE_FIELDS = [
  { key: 'diameter_km', label: LABELS.diameter, unit: LABELS.km, higher: true },
  { key: 'density', label: LABELS.density, unit: 'г/см³', higher: true },
  { key: 'distanceFromSun_km', label: LABELS.distanceFromSun, unit: LABELS.km, higher: false },
  { key: 'orbitalPeriod_days', label: LABELS.orbitalPeriod, unit: LABELS.days, higher: false },
  { key: 'avgTemperature_c', label: LABELS.temperature, unit: '°C', higher: null },
  { key: 'gravity_ms2', label: LABELS.gravity, unit: 'м/с²', higher: true },
  { key: 'moons_count', label: LABELS.moons, unit: '', higher: true },
];

function CompareRow({ field, v1, v2 }) {
  const val1 = typeof v1 === 'number' ? v1 : parseFloat(v1) || 0;
  const val2 = typeof v2 === 'number' ? v2 : parseFloat(v2) || 0;

  let winner = null;
  if (field.higher !== null && val1 !== val2) {
    if (field.higher) winner = val1 > val2 ? 1 : 2;
    else winner = val1 < val2 ? 1 : 2;
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center py-1.5">
      <div className={`text-right text-sm font-mono ${winner === 1 ? 'text-accent' : 'text-gray-300'}`}>
        {typeof v1 === 'number' ? v1.toLocaleString() : v1}
        {winner === 1 && <span className="ml-1 text-xs">✦</span>}
      </div>
      <div className="text-center text-[10px] text-gray-500 w-28 leading-tight">
        {field.label}
        {field.unit && <span className="block text-gray-600">{field.unit}</span>}
      </div>
      <div className={`text-left text-sm font-mono ${winner === 2 ? 'text-accent' : 'text-gray-300'}`}>
        {winner === 2 && <span className="mr-1 text-xs">✦</span>}
        {typeof v2 === 'number' ? v2.toLocaleString() : v2}
      </div>
    </div>
  );
}

export default function ComparePanel() {
  const comparePlanets = useStore((s) => s.comparePlanets);
  const clearComparePlanets = useStore((s) => s.clearComparePlanets);
  const removeComparePlanet = useStore((s) => s.removeComparePlanet);

  const show = comparePlanets.length === 2;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-[95vw] z-40 glass-strong rounded-t-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">
              {LABELS.compareTitle}
            </h3>
            <button
              onClick={clearComparePlanets}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* Planet names */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 px-4 pt-3 items-center">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-white font-semibold">{comparePlanets[0].name}</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: comparePlanets[0].color }} />
              </div>
            </div>
            <div className="text-gray-600 text-xs">VS</div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: comparePlanets[1].color }} />
                <span className="text-white font-semibold">{comparePlanets[1].name}</span>
              </div>
            </div>
          </div>

          {/* Visual size comparison */}
          <div className="flex items-end justify-center gap-8 py-4">
            {comparePlanets.map((p) => {
              const maxD = Math.max(
                comparePlanets[0].realData.diameter_km,
                comparePlanets[1].realData.diameter_km
              );
              const size = Math.max((p.realData.diameter_km / maxD) * 60, 10);
              return (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="rounded-full"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: p.color,
                      boxShadow: `0 0 20px ${p.color}40`,
                    }}
                  />
                  <span className="text-[10px] text-gray-500">{p.realData.diameter_km.toLocaleString()} км</span>
                </div>
              );
            })}
          </div>

          {/* Stats comparison */}
          <div className="px-4 pb-4 max-h-48 overflow-y-auto">
            {COMPARE_FIELDS.map((field) => (
              <CompareRow
                key={field.key}
                field={field}
                v1={comparePlanets[0].realData[field.key]}
                v2={comparePlanets[1].realData[field.key]}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
