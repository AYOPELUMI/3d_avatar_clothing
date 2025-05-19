import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Object3D, Mesh, Color, BufferGeometry, Vector3, Box3 } from 'three'
import { useBox, usePlane } from '@react-three/cannon'
import { useCloth } from '../hooks/useCloth'
import { detectFemaleBody } from '../hooks/detectFemaleBody'
import { getBodyVertices } from '../hooks/getBodyVertice'

interface ClothPhysicsProps {
    clothingScene: Object3D
    avatarScene: Object3D
    color: string
}

export function ClothPhysics({ clothingScene, avatarScene, color }: ClothPhysicsProps) {
    const groupRef = useRef<Group>(null)
    const [clothReady, setClothReady] = useState(false)
    const scaledClothing = useRef<Object3D | null>(null)

    const [fitSettings, setFitSettings] = useState({
        chest: 1.0,
        arms: 1.05,  // Default slightly larger for arms
        waist: 1.0,
        length: 1.02 // Default slightly longer
    })

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

        // Detect female body proportions
        const isFemale = detectFemaleBody(avatarScene); // Implementation below

        // Apply automatic gender-aware scaling
        clone.traverse((child) => {
            if (child.isMesh) {
                let areaScale = 1.0;
                const childName = child.name.toLowerCase();

                // Chest area expansion for female avatars
                if (isFemale && (childName.includes('chest') || childName.includes('torso'))) {
                    areaScale = 1.15; // 15% larger for bust
                }

                // Hip/buttocks area expansion
                if (isFemale && (childName.includes('hip') || childName.includes('butt') || childName.includes('seat'))) {
                    areaScale = 1.12; // 12% larger for hips
                }

                // Apply scaling with padding to prevent clipping
                child.scale.set(
                    baseScale * areaScale * 1.05, // 5% padding
                    baseScale * areaScale * 1.05,
                    baseScale * areaScale * 1.05
                );
            }
        });

        // Position adjustment with extra clearance
        const avatarFeetY = avatarBox.min.y;
        const clothingFeetY = new Box3().setFromObject(clone).min.y;
        clone.position.y = avatarFeetY - clothingFeetY + 0.05; // Increased lift

        return clone;
    }, [clothingScene, avatarScene]);

    // 2. Apply color to clothing material
    useEffect(() => {
        if (!scaledClothingScene) return

        scaledClothingScene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => {
                        mat.color = new Color(color)
                        mat.needsUpdate = true
                    })
                } else {
                    mesh.material.color = new Color(color)
                    mesh.material.needsUpdate = true
                }
            }
        })
    }, [color, scaledClothingScene])

    // 3. Initialize cloth physics with scaled clothing
    // In your useCloth hook
    const { clothParticles } = useCloth({
        model: scaledClothingScene,
        bodyModel: avatarScene,
        options: {
            segments: 24, // Higher density for better fit
            stiffness: 0.8, // Softer cloth drapes better
            bodyCollisionPadding: 0.03, // Extra space around body
            femaleBody: detectFemaleBody(avatarScene) // Pass gender detection
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
    // Add this to your useFrame loop
    useFrame(() => {
        if (!scaledClothingScene || !avatarScene) return;

        scaledClothingScene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                const geometry = mesh.geometry as BufferGeometry;
                const positionAttribute = geometry.attributes.position;

                // Get body vertices (simplified example)
                const bodyVertices = getBodyVertices(avatarScene);

                for (let i = 0; i < positionAttribute.count; i++) {
                    const vertex = new Vector3().fromBufferAttribute(positionAttribute, i);

                    // Push cloth vertices away from body
                    bodyVertices.forEach(bodyVertex => {
                        const distance = vertex.distanceTo(bodyVertex);
                        if (distance < 0.05) { // If too close to body
                            const direction = vertex.clone().sub(bodyVertex).normalize();
                            vertex.add(direction.multiplyScalar(0.05 - distance));
                        }
                    });

                    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }

                positionAttribute.needsUpdate = true;
            }
        });
    });

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
