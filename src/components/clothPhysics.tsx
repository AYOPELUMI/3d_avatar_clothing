import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Object3D, Mesh, Color, BufferGeometry, Vector3, Box3, Material, MeshStandardMaterial, BufferAttribute } from 'three'
import { useBox, usePlane } from '@react-three/cannon'
import { useCloth } from '../hooks/useCloth'

interface ClothPhysicsProps {
    clothingScene: Object3D
    avatarScene: Object3D
    color: string
}

export function ClothPhysics({ clothingScene, avatarScene, color }: ClothPhysicsProps) {
    const groupRef = useRef<Group>(null)
    const [clothReady, setClothReady] = useState(false)



    const scaledClothingScene = useMemo(() => {
        if (!clothingScene || !avatarScene) return null;

        const clone = clothingScene.clone();
        const avatarBox = new Box3().setFromObject(avatarScene);
        const clothingBox = new Box3().setFromObject(clone);

        // Base scaling
        const avatarSize = new Vector3();
        const clothingSize = new Vector3();
        avatarBox.getSize(avatarSize);
        clothingBox.getSize(clothingSize);
        const baseScale = avatarSize.y / clothingSize.y;

        // Apply zone-specific scaling
        clone.traverse((child) => {
            if ((child as Mesh).isMesh) {
                // Default scaling
                child.scale.set(baseScale, baseScale, baseScale);

                // Area-specific adjustments
                if (child.name.toLowerCase().includes('chest') ||
                    child.name.toLowerCase().includes('torso')) {
                    // Expand chest/torso area
                    child.scale.multiplyScalar(1.1);
                }
                if (child.name.toLowerCase().includes('sleeve') ||
                    child.name.toLowerCase().includes('arm')) {
                    // Expand arms slightly
                    child.scale.multiplyScalar(1.05);
                }
                if (child.name.toLowerCase().includes('collar') ||
                    child.name.toLowerCase().includes('neck')) {
                    // Tighten neck area
                    child.scale.multiplyScalar(0.95);
                }
            }
        });

        // Position adjustment
        const avatarFeetY = avatarBox.min.y;
        const clothingFeetY = new Box3().setFromObject(clone).min.y;
        clone.position.y = avatarFeetY - clothingFeetY + 0.02; // Slight lift

        return clone;
    }, [clothingScene, avatarScene]);

    // 2. Apply color to clothing material

    function isColorMaterial(material: Material): material is MeshStandardMaterial {
        return 'color' in material;
    }
    useEffect(() => {
        if (!scaledClothingScene) return

        scaledClothingScene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => {
                        if (isColorMaterial(mat)) {
                            mat.color = new Color(color);
                            mat.needsUpdate = true;
                        }
                    });
                } else {
                    if (isColorMaterial(mesh.material)) {
                        mesh.material.color = new Color(color);
                        mesh.material.needsUpdate = true;
                    }
                }
            }
        })
    }, [color, scaledClothingScene])

    // 3. Initialize cloth physics with scaled clothing
    const { clothParticles } = useCloth({
        model: scaledClothingScene,
        bodyModel: avatarScene,
        options: {
            segments: 20,
            stiffness: 0.85, // Slightly reduced stiffness for better draping
            collisionMargin: 0.02, // Added margin for better coverage
            bodyInfluence: 0.3 // How much the body affects the cloth
        }
    });

    // 4. Avatar collision body
    const [avatarRef] = useBox(() => ({
        type: 'Static',
        args: [0.5, 1.7, 0.3], // Adjusted to match scaled avatar
        position: [0, 0, 0],
    }))

    // 5. Ground plane
    usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -1, 0],
    }))

    // 6. Animation frame for cloth simulation
    useFrame(() => {
        if (!groupRef.current || !clothReady || !scaledClothingScene || !clothParticles.current) return

        scaledClothingScene.traverse((child) => {
            const mesh = child as Mesh
            if (mesh.isMesh) {
                const geometry = mesh.geometry as BufferGeometry
                const positionAttribute = geometry.attributes.position as BufferAttribute

                for (let i = 0; i < Math.min(clothParticles.current.length, positionAttribute.count); i++) {
                    const particle = clothParticles.current[i]
                    if (particle) {
                        positionAttribute.setXYZ(i, particle.x, particle.y, particle.z)
                    }
                }

                positionAttribute.needsUpdate = true
                geometry.computeVertexNormals()
            }
        })
    })

    useEffect(() => {
        if (clothParticles.current && clothParticles.current.length > 0) {
            setClothReady(true)
        }
    }, [clothParticles])

    if (!scaledClothingScene) return null

    return (
        <group ref={groupRef}>
            <primitive object={avatarScene} ref={avatarRef} />
            <primitive object={scaledClothingScene} />
        </group>
    )
}
