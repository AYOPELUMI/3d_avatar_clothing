import { useGLTF, Center } from "@react-three/drei";

export function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Center and scale the avatar appropriately
  scene.position.set(0, 0, 0);
  scene.scale.set(1, 1, 1);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}