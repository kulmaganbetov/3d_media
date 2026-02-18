import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';

const OVERVIEW_POS = new THREE.Vector3(0, 60, 100);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);
const LERP_SPEED = 2.0;

export default function useCamera(controlsRef) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3().copy(OVERVIEW_POS));
  const targetLook = useRef(new THREE.Vector3().copy(OVERVIEW_TARGET));
  const isAnimating = useRef(false);
  const introPhase = useRef(0);
  const introTime = useRef(0);

  const cameraTarget = useStore((s) => s.cameraTarget);
  const introDone = useStore((s) => s.introDone);
  const setIntroDone = useStore((s) => s.setIntroDone);

  const flyTo = useCallback(
    (position, lookAt) => {
      targetPos.current.copy(position);
      targetLook.current.copy(lookAt);
      isAnimating.current = true;
    },
    []
  );

  const flyToOverview = useCallback(() => {
    flyTo(OVERVIEW_POS, OVERVIEW_TARGET);
    useStore.getState().setSelectedPlanet(null);
    useStore.getState().setCameraTarget(null);
  }, [flyTo]);

  // Handle cameraTarget changes from store
  useEffect(() => {
    if (cameraTarget) {
      const offset = new THREE.Vector3(
        cameraTarget.radius * 4 + 3,
        cameraTarget.radius * 2 + 2,
        cameraTarget.radius * 4 + 3
      );
      const pos = new THREE.Vector3().copy(cameraTarget.position).add(offset);
      flyTo(pos, new THREE.Vector3().copy(cameraTarget.position));
    }
  }, [cameraTarget, flyTo]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Intro animation
    if (!introDone) {
      introTime.current += delta;
      const t = introTime.current;

      if (introPhase.current === 0) {
        // Start far away
        camera.position.set(200, 80, 200);
        controlsRef.current.target.set(0, 0, 0);
        introPhase.current = 1;
      } else if (introPhase.current === 1) {
        // Sweep in
        const progress = Math.min(t / 4.0, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(
          new THREE.Vector3(200, 80, 200),
          OVERVIEW_POS,
          ease
        );
        controlsRef.current.target.set(0, 0, 0);
        if (progress >= 1) {
          setIntroDone(true);
          isAnimating.current = false;
        }
      }
      controlsRef.current.update();
      return;
    }

    // Camera fly-to animation
    if (isAnimating.current) {
      const speed = delta * LERP_SPEED;
      camera.position.lerp(targetPos.current, speed);
      controlsRef.current.target.lerp(targetLook.current, speed);

      const dist = camera.position.distanceTo(targetPos.current);
      if (dist < 0.5) {
        isAnimating.current = false;
      }
      controlsRef.current.update();
    }
  });

  return { flyTo, flyToOverview };
}
