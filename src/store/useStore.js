import { create } from 'zustand';

const useStore = create((set) => ({
  // Selected planet
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),

  // Comparison
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

  // Time controls
  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setPaused: (v) => set({ isPaused: v }),

  speedMultiplier: 1,
  setSpeedMultiplier: (s) => set({ speedMultiplier: s }),

  // Real positions mode
  realPositions: false,
  toggleRealPositions: () => set((state) => ({ realPositions: !state.realPositions })),

  // Simulation date
  simDate: new Date(),
  setSimDate: (d) => set({ simDate: d instanceof Date ? d : new Date(d) }),

  // Loading
  isLoaded: false,
  setIsLoaded: (v) => set({ isLoaded: v }),

  // Camera target for fly-to
  cameraTarget: null,
  setCameraTarget: (t) => set({ cameraTarget: t }),

  // Intro done
  introDone: false,
  setIntroDone: (v) => set({ introDone: v }),
}));

export default useStore;
