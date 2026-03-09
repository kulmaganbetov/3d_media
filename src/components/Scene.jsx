import React, { useRef, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import AsteroidBelt from './AsteroidBelt';
import StarField from './Stars';
import Galaxies from './Galaxies';
import useCamera from '../hooks/useCamera';
import useStore from '../store/useStore';
import { PLANETS } from '../data/planets';

function CameraController() {
  const controlsRef = useRef();
  const { flyToOverview } = useCamera(controlsRef);

  const { gl } = useThree();
  useEffect(() => {
    const handler = () => flyToOverview();
    gl.domElement.addEventListener('dblclick', handler);
    return () => gl.domElement.removeEventListener('dblclick', handler);
  }, [gl, flyToOverview]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={3}
      maxDistance={350}
      zoomSpeed={1.0}
      rotateSpeed={0.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.35} color="#c8d4ff" />
      <hemisphereLight args={['#c8d4ff', '#1a1025', 0.15]} />

      <StarField />
      <Galaxies />
      <Sun />

      {PLANETS.map((planet) => (
        <Orbit key={`orbit-${planet.id}`} distance={planet.distance} color={planet.orbitColor} opacity={planet.isDwarf ? 0.04 : 0.08} />
      ))}

      {PLANETS.map((planet) => (
        <Planet key={planet.id} data={planet} />
      ))}

      <AsteroidBelt />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.8}
          intensity={1.0}
          mipmapBlur
        />
      </EffectComposer>

      <CameraController />
    </>
  );
}

class ErrorBoundary3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-accent">
          <div className="text-center">
            <p className="text-xl mb-2">3D сахна жүктелмеді</p>
            <p className="text-gray-400 text-sm">Бетті жаңартып көріңіз</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Scene() {
  const setIsLoaded = useStore((s) => s.setIsLoaded);
  const loadTimerRef = useRef(null);

  const handleCreated = useCallback(() => {
    loadTimerRef.current = setTimeout(() => setIsLoaded(true), 500);
  }, [setIsLoaded]);

  useEffect(() => () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
  }, []);

  return (
    <ErrorBoundary3D>
      <Canvas
        camera={{ position: [200, 80, 200], fov: 50, near: 0.1, far: 2400 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.5]}
        onCreated={handleCreated}
        style={{ position: 'absolute', inset: 0 }}
        frameloop="always"
      >
        <color attach="background" args={['#000006']} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </ErrorBoundary3D>
  );
}
