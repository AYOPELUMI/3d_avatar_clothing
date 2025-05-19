import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { Group, Color, Box3, Vector3, Object3D, Mesh } from "three";

export function ClothingModel({
    url,
    color,
    avatarUrl,
}: {
    url: string;
    color: string;
    avatarUrl: string;
}) {
    const { scene: clothingScene } = useGLTF(url);
    const { scene: avatarScene } = useGLTF(avatarUrl);
    const clothingRef = useRef<Object3D>(null);

    // Clone scenes
    const clothing = useMemo(() => {
        if (!clothingScene) return null;
        const clone = clothingScene.clone();
        clone.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [clothingScene]);

    const avatar = useMemo(() => avatarScene?.clone(), [avatarScene]);

    // Physics setup - using kinematic to prevent falling
    const [physicsRef, api] = useBox(() => ({
        type: "Kinematic",
        mass: 0,
        position: [0, 0, 0],
        args: [1, 1.5, 1],
    }));

    useEffect(() => {
        if (!clothing || !avatar || !clothingRef.current) return;

        // Calculate bounding boxes with precise bounds
        const avatarBox = new Box3().setFromObject(avatar);
        const clothingBox = new Box3().setFromObject(clothing);

        const avatarSize = new Vector3();
        const clothingSize = new Vector3();
        avatarBox.getSize(avatarSize);
        clothingBox.getSize(clothingSize);

        // Calculate precise scale factor
        const widthScale = avatarSize.x * 1.05 / clothingSize.x; // 5% larger than avatar
        const heightScale = avatarSize.y * 1.05 / clothingSize.y;
        const depthScale = avatarSize.z * 1.05 / clothingSize.z;

        // Apply uniform scaling based on largest dimension
        const scaleFactor = Math.max(widthScale, heightScale, depthScale);
        clothing.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Calculate center offset
        const avatarCenter = new Vector3();
        const clothingCenter = new Vector3();
        avatarBox.getCenter(avatarCenter);
        clothingBox.getCenter(clothingCenter);

        // Position adjustment
        const position = [
            0,
            avatarCenter.y - clothingCenter.y * scaleFactor,
            0
        ];

        // Apply transformations
        clothing.position.set(...position);
        api.position.set(...position);
        clothingRef.current.position.set(...position);

        // Apply color with better material handling
        clothing.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.color = new Color(color);
                child.material.needsUpdate = true;
            }
        });

    }, [clothing, avatar, color, api]);

    if (!clothing) return null;

    return (
        <group ref={clothingRef}>
            <primitive
                object={clothing}
                ref={physicsRef}
            />
        </group>
    );
}