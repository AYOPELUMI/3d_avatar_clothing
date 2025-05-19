import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { Color, Mesh, Object3D, Material } from "three"
import { ClothPhysics } from "./clothPhysics"

export function ClothingModel({
    url,
    color,
    avatarUrl,
}: {
    url: string
    color: string
    avatarUrl: string
}) {
    const { scene: clothingScene } = useGLTF(url)
    const { scene: avatarScene } = useGLTF(avatarUrl)

    const coloredClothing = useMemo(() => {
        const clone = clothingScene.clone()
        clone.traverse((child: Object3D) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh

                // Handle both single material and material array cases
                if (Array.isArray(mesh.material)) {
                    // Clone each material in the array
                    mesh.material = mesh.material.map(mat => mat.clone())
                    // Apply color to each material that supports it
                    mesh.material.forEach(mat => {
                        if ('color' in mat) {
                            (mat as Material & { color: Color }).color = new Color(color)
                        }
                    })
                } else {
                    // Handle single material case
                    mesh.material = mesh.material.clone()
                    if ('color' in mesh.material) {
                        (mesh.material as Material & { color: Color }).color = new Color(color)
                    }
                }
            }
        })
        return clone
    }, [clothingScene, color])

    if (!coloredClothing || !avatarScene) return null

    return (
        <ClothPhysics
            clothingScene={coloredClothing}
            avatarScene={avatarScene}
            color={color}
        />
    )
}