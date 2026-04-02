import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Scene from './components/Scene';
import Loader from './ui/Loader';
import PlanetPanel from './ui/PlanetPanel';
import ComparePanel from './ui/ComparePanel';
import TimeControls from './ui/TimeControls';
import SearchBar from './ui/SearchBar';
import DocumentariesPage from './ui/DocumentariesPage';
import useStore from './store/useStore';
import { PLANETS, LABELS } from './data/planets';

function TopBar() {
  const [clock, setClock] = React.useState(new Date());

  React.useEffect(() => {
    const iv = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 glass px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(253,184,19,0.6)]" />
        <h1 className="text-sm font-bold tracking-[0.25em] text-accent">
          {LABELS.title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/documentaries"
          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">Бейнелер</span>
        </Link>
        <span className="text-xs text-gray-500 font-mono hidden sm:block">
          {String(clock.getHours()).padStart(2,'0')}:{String(clock.getMinutes()).padStart(2,'0')}:{String(clock.getSeconds()).padStart(2,'0')}
        </span>
        <SearchBar />
      </div>
    </div>
  );
}

function KeyboardHint() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 text-[10px] text-gray-600 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur">
      {LABELS.keyboard}
    </div>
  );
}

export default function App() {
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const setCameraTarget = useStore((s) => s.setCameraTarget);
  const togglePause = useStore((s) => s.togglePause);
  const isLoaded = useStore((s) => s.isLoaded);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const targetTag = e.target?.tagName;
      const isTypingTarget = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || e.target?.isContentEditable;
      if (isTypingTarget) return;

      // ESC - deselect
      if (e.key === 'Escape') {
        setSelectedPlanet(null);
        setCameraTarget(null);
      }
      // Space - pause/play
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePause();
      }
      // Numbers 1-9 to jump to planets
      if (/^[1-9]$/.test(e.key) && PLANETS[Number(e.key) - 1]) {
        const num = Number(e.key);
        const planet = PLANETS[num - 1];
        setSelectedPlanet(planet);
        setCameraTarget({
          position: { x: planet.distance, y: 0, z: 0 },
          radius: planet.radius,
        });
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSelectedPlanet, setCameraTarget, togglePause]);

  // Update sim date every second when not paused
  const isPaused = useStore((s) => s.isPaused);
  const setSimDate = useStore((s) => s.setSimDate);
  const speedMultiplier = useStore((s) => s.speedMultiplier);

  useEffect(() => {
    if (isPaused) return;
    const iv = setInterval(() => {
      setSimDate((prev) => new Date(prev.getTime() + 1000 * speedMultiplier));
    }, 1000);
    return () => clearInterval(iv);
  }, [isPaused, speedMultiplier, setSimDate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="w-full h-full relative bg-black">
            <Loader />
            <Scene />
            {isLoaded && (
              <>
                <TopBar />
                <PlanetPanel />
                <ComparePanel />
                <TimeControls />
                <KeyboardHint />
              </>
            )}
          </div>
        }
      />
      <Route path="/documentaries" element={<DocumentariesPage />} />
    </Routes>
  );
}
