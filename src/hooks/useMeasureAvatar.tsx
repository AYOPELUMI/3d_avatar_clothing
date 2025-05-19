import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, Group } from "three";
import { useEffect, useRef, useState } from "react";

export function useAvatarMeasurements(avatarUrl: string) {
    const { scene } = useGLTF(avatarUrl);
    const ref = useRef<Group>(null);
    const [measurements, setMeasurements] = useState<{
        height: number;
        width: number;
        depth: number;
    } | null>(null);

    useEffect(() => {
        if (!scene || !ref.current) return;

        ref.current.add(scene.clone());

        const calculateMeasurements = () => {
            const bbox = new Box3().setFromObject(scene);
            const size = new Vector3();
            bbox.getSize(size);

            setMeasurements({
                height: size.y,
                width: size.x,
                depth: size.z
            });
        };

        // Wait for model to fully load
        const timer = setTimeout(calculateMeasurements, 100);

        return () => {
            clearTimeout(timer);
            ref.current?.remove(scene);
        };
    }, [scene]);

    return { measurements, ref };
}