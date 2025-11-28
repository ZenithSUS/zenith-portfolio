"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, PointLight } from "three";

function ContactAvatar({ isHovering }: { isHovering: boolean }) {
  const group = useRef<Group>(null);
  const glowLight = useRef<PointLight>(null);
  const { scene } = useGLTF("/avatars/avatar.glb");

  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;

    // ANIMATED POSITION + FLOAT
    group.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    group.current.position.x = Math.sin(t * 0.8) * 0.2;

    if (glowLight.current) {
      glowLight.current.intensity = 2 + Math.sin(t * 2) * 0.5;
    }

    if (isHovering) {
      const desiredY = (state.mouse.x * Math.PI) / 4;
      const desiredX = (state.mouse.y * -Math.PI) / 8;

      const MAX_DOWN = -0.25;
      const MAX_UP = 0.15;
      const clampedX = Math.max(MAX_DOWN, Math.min(MAX_UP, desiredX));

      targetRot.current.x = clampedX;
      targetRot.current.y = desiredY;
    } else {
      targetRot.current.x = 0;
      targetRot.current.y = 0;
    }

    // Smooth inertia
    const smoothing = 4;
    group.current.rotation.x +=
      (targetRot.current.x - group.current.rotation.x) * smoothing * delta;

    group.current.rotation.y +=
      (targetRot.current.y - group.current.rotation.y) * smoothing * delta;
  });

  return (
    <group
      ref={group}
      scale={5}
      position={[0, -8.5, 0]}
      castShadow
      receiveShadow
    >
      <pointLight
        ref={glowLight}
        position={[0, 1, 0]}
        color="#00cfff"
        intensity={2}
        distance={10}
      />
      <pointLight
        position={[0, 0.5, 1]}
        color="#7f00ff"
        intensity={1.5}
        distance={8}
      />
      <pointLight
        position={[2, 1, -2]}
        color="#00cfff"
        intensity={1}
        distance={6}
      />
      <pointLight
        position={[-2, 1, -2]}
        color="#ff00ff"
        intensity={1}
        distance={6}
      />

      <primitive object={scene} />
    </group>
  );
}

export default ContactAvatar;
