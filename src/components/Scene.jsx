import React, { useRef, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import AsteroidBelt from './AsteroidBelt';
import StarField from './Stars';
import useCamera from '../hooks/useCamera';
import useStore from '../store/useStore';
import { PLANETS } from '../data/planets';

function CameraController() {
  const controlsRef = useRef();
  const { flyToOverview } = useCamera(controlsRef);

  // Double click to return to overview
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
      minDistance={5}
      maxDistance={300}
      zoomSpeed={0.8}
      rotateSpeed={0.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.08} />

      {/* Stars */}
      <StarField />

      {/* Sun */}
      <Sun />

      {/* Orbits */}
      {PLANETS.map((planet) => (
        <Orbit
          key={`orbit-${planet.id}`}
          distance={planet.distance}
          color={planet.orbitColor}
          opacity={planet.isDwarf ? 0.08 : 0.12}
        />
      ))}

      {/* Planets */}
      {PLANETS.map((planet) => (
        <Planet key={planet.id} data={planet} />
      ))}

      {/* Asteroid Belt */}
      <AsteroidBelt />

      {/* Post processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>

      {/* Camera */}
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

  const handleCreated = useCallback(() => {
    // Mark loaded after a small delay to let textures start loading
    setTimeout(() => setIsLoaded(true), 1500);
  }, [setIsLoaded]);

  return (
    <ErrorBoundary3D>
      <Canvas
        camera={{ position: [200, 80, 200], fov: 50, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        onCreated={handleCreated}
        style={{ position: 'absolute', inset: 0 }}
      >
        <color attach="background" args={['#000005']} />
        <fog attach="fog" args={['#000005', 200, 500]} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </ErrorBoundary3D>
  );
}
