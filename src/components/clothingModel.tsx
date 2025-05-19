import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { Color } from "three"
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
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone()
                child.material.color = new Color(color)
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