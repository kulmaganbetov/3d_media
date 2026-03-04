import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { LABELS } from '../data/planets';

function AtmosphereChart({ atmosphere }) {
  if (!atmosphere) return null;
  const entries = Object.entries(atmosphere);
  const colors = ['#00d4ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6'];

  let cumulative = 0;

  return (
    <div className="space-y-2">
      <h4 className="text-xs text-gray-400 uppercase tracking-wider">{LABELS.atmosphere}</h4>
      {/* Bar chart */}
      <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden flex">
        {entries.map(([name, pct], i) => {
          const width = Math.max(pct, 0.5);
          return (
            <motion.div
              key={name}
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="h-full"
              style={{ backgroundColor: colors[i % colors.length] }}
              title={`${name}: ${pct}%`}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="space-y-1">
        {entries.map(([name, pct], i) => (
          <div key={name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-gray-300 flex-1">{name}</span>
            <span className="text-accent font-mono">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatRow({ label, value, unit }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-white font-mono">
        {value}
        {unit && <span className="text-gray-500 ml-1 text-xs">{unit}</span>}
      </span>
    </div>
  );
}

export default function PlanetPanel() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const addComparePlanet = useStore((s) => s.addComparePlanet);

  const close = () => {
    setSelectedPlanet(null);
    setCameraTarget(null);
  };

  const planet = selectedPlanet;

  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          key={planet.id || planet.name}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[380px] max-w-[90vw] z-40 glass-strong overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 glass-strong z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full shadow-lg"
                style={{
                  backgroundColor: planet.color || '#FDB813',
                  boxShadow: `0 0 15px ${planet.color || '#FDB813'}40`,
                }}
              />
              <div>
                <h2 className="text-lg font-bold text-white">{planet.name}</h2>
                <p className="text-xs text-gray-500">{planet.nameEn || ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!planet.isSun && !planet.isStar && !planet.isGalaxy && (
                <button
                  onClick={() => addComparePlanet(planet)}
                  className="text-xs px-3 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  {LABELS.compare}
                </button>
              )}
              <button
                onClick={close}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Description */}
            {planet.realData?.description && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{LABELS.description}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{planet.realData.description}</p>
              </div>
            )}

            {/* Type badge */}
            {(planet.isStar || planet.isGalaxy || planet.isMoon) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-3 py-1 rounded-full text-xs border ${
                  planet.isStar
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : planet.isGalaxy
                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {planet.isStar ? 'Жұлдыз' : planet.isGalaxy ? 'Галактика' : 'Серік'}
                </span>
                {planet.parentName && (
                  <span className="text-xs text-gray-500">
                    {planet.parentName} серігі
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            {planet.realData && (
              <div>
                {planet.realData.diameter_km != null && (
                  <StatRow label={LABELS.diameter} value={typeof planet.realData.diameter_km === 'number' ? planet.realData.diameter_km.toLocaleString() : planet.realData.diameter_km} unit={typeof planet.realData.diameter_km === 'number' ? LABELS.km : ''} />
                )}
                {planet.realData.mass_kg && (
                  <StatRow label={LABELS.mass} value={planet.realData.mass_kg} unit="кг" />
                )}
                {planet.realData.density != null && planet.realData.density !== '—' && (
                  <StatRow label={LABELS.density} value={planet.realData.density} unit="г/см³" />
                )}
                {planet.realData.distanceFromSun_km != null && (
                  <StatRow label={planet.isStar || planet.isGalaxy ? 'Қашықтығы' : LABELS.distanceFromSun} value={typeof planet.realData.distanceFromSun_km === 'number' ? planet.realData.distanceFromSun_km.toLocaleString() : planet.realData.distanceFromSun_km} unit={typeof planet.realData.distanceFromSun_km === 'number' ? LABELS.km : ''} />
                )}
                {planet.realData.orbitalPeriod_days && (
                  <StatRow label={LABELS.orbitalPeriod} value={planet.realData.orbitalPeriod_days.toLocaleString()} unit={LABELS.days} />
                )}
                {planet.realData.rotationPeriod_hours && (
                  <StatRow label={LABELS.rotationPeriod} value={Math.abs(planet.realData.rotationPeriod_hours)} unit={LABELS.hours} />
                )}
                {planet.realData.avgTemperature_c != null && planet.realData.avgTemperature_c !== '—' && (
                  <StatRow label={LABELS.temperature} value={`${planet.realData.avgTemperature_c}°C`} />
                )}
                {planet.realData.gravity_ms2 && (
                  <StatRow label={LABELS.gravity} value={planet.realData.gravity_ms2} unit="м/с²" />
                )}
                {planet.realData.moons_count !== undefined && (
                  <StatRow label={LABELS.moons} value={planet.realData.moons_count} />
                )}
                {/* Star-specific fields */}
                {planet.realData.spectralClass && (
                  <StatRow label="Спектрлік класы" value={planet.realData.spectralClass} />
                )}
                {planet.realData.luminosity && (
                  <StatRow label="Жарықтығы" value={planet.realData.luminosity} />
                )}
                {planet.realData.constellation && (
                  <StatRow label="Шоқжұлдызы" value={planet.realData.constellation} />
                )}
                {/* Galaxy-specific fields */}
                {planet.realData.galaxyType && (
                  <StatRow label="Галактика түрі" value={planet.realData.galaxyType} />
                )}
                {planet.realData.starCount && (
                  <StatRow label="Жұлдыздар саны" value={planet.realData.starCount} />
                )}
              </div>
            )}

            {/* Atmosphere */}
            {planet.realData?.atmosphere && (
              <AtmosphereChart atmosphere={planet.realData.atmosphere} />
            )}

            {/* Missions */}
            {planet.realData?.missions && planet.realData.missions.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{LABELS.missions}</h4>
                <div className="space-y-1.5">
                  {planet.realData.missions.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">▸</span>
                      <span className="text-gray-300">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Facts */}
            {planet.realData?.funFacts && planet.realData.funFacts.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{LABELS.funFacts}</h4>
                <div className="space-y-2">
                  {planet.realData.funFacts.map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="text-sm text-gray-300 bg-white/5 rounded-lg p-3"
                    >
                      <span className="text-accent mr-2">★</span>
                      {fact}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Dwarf planet badge */}
            {planet.isDwarf && (
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                  {LABELS.dwarfPlanet}
                </span>
              </div>
            )}

            {/* Spacer for scroll */}
            <div className="h-8" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
