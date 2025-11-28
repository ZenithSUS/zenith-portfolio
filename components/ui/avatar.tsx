"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, PointLight } from "three";

function Avatar() {
  const group = useRef<Group>(null);
  const glowLight = useRef<PointLight>(null);
  const { scene } = useGLTF("/avatars/avatar.glb");

  // Sliding animation left to right infinite
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }

    // Animate glow intensity
    if (glowLight.current) {
      glowLight.current.intensity =
        2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group ref={group} scale={5} position={[0, -8.5, 0]}>
      {/* Glow effect using point lights */}
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

      {/* Rim light for edge glow */}
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

export default Avatar;
