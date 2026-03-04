import { create } from 'zustand';

const useStore = create((set, get) => ({
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),

  comparePlanets: [],
  addComparePlanet: (planet) =>
    set((state) => {
      if (state.comparePlanets.find((p) => p.id === planet.id)) return state;
      if (state.comparePlanets.length >= 2) return { comparePlanets: [planet] };
      return { comparePlanets: [...state.comparePlanets, planet] };
    }),
  removeComparePlanet: (id) =>
    set((state) => ({
      comparePlanets: state.comparePlanets.filter((p) => p.id !== id),
    })),
  clearComparePlanets: () => set({ comparePlanets: [] }),

  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setPaused: (v) => set({ isPaused: v }),

  speedMultiplier: 1,
  setSpeedMultiplier: (s) => set({ speedMultiplier: s }),

  realPositions: false,
  toggleRealPositions: () => set((state) => ({ realPositions: !state.realPositions })),

  simDate: new Date(),
  setSimDate: (d) => {
    if (typeof d === 'function') {
      const result = d(get().simDate);
      set({ simDate: result instanceof Date && !isNaN(result) ? result : new Date() });
    } else {
      const date = d instanceof Date ? d : new Date(d);
      set({ simDate: !isNaN(date) ? date : new Date() });
    }
  },

  isLoaded: false,
  setIsLoaded: (v) => set({ isLoaded: v }),

  cameraTarget: null,
  setCameraTarget: (t) => set({ cameraTarget: t }),

  introDone: false,
  setIntroDone: (v) => set({ introDone: v }),
}));

export default useStore;
