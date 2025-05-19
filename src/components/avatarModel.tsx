import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { Group } from "three";

export function AvatarModel({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<Group>(null);
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args: [0.5, 1.7, 0.3], // Human-sized collision box
  }));

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...position);
    groupRef.current.scale.set(1, 1, 1);
  }, [position]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} ref={ref} />
    </group>
  );
}