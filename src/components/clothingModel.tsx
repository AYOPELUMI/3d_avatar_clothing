import { useGLTF, Center } from "@react-three/drei";
import { Color } from "three";
import { useEffect } from "react";

export function ClothingModel({ url, color }: { url: string; color: string }) {
    const { scene } = useGLTF(url);

    useEffect(() => {

        scene.traverse((child: any) => {
            if (child.isMesh && child.material) {
                child.material.color = new Color(color);

                child.material.needsUpdate = true;
            }
        });
    }, [color, scene]);

    scene.position.set(0, 0, 0);
    scene.scale.set(1.02, 1.02, 1.02);

    return (
        <Center>
            <primitive object={scene} />
        </Center>
    );
}