// useCloth.ts
import { useRef, useEffect } from 'react'
import { Vector3, Object3D, Mesh } from 'three'
import { useSphere } from '@react-three/cannon'

interface UseClothParams {
  model: Object3D
  bodyModel: Object3D  // Now properly used
  options: {
    width: number
    height: number
    segments: number
    stiffness: number
  }
}

export function useCloth({ model, bodyModel, options }: {
  model: Object3D | null
  bodyModel: Object3D
  options: { segments: number; stiffness: number }
}) {
  const clothParticles = useRef<Vector3[]>([])
  const constraints = useRef<any[]>([])

  useEffect(() => {
    if (!model?.children?.length) return

    const mesh = model.children[0] as Mesh
    if (!mesh?.isMesh || !mesh.geometry) return

    const geometry = mesh.geometry
    const positions = geometry.attributes.position.array
    const particles: Vector3[] = []

    // Initialize particles from model geometry
    for (let i = 0; i < positions.length; i += 3) {
      particles.push(new Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      ))
    }

    clothParticles.current = particles

    // Body model collision implementation would go here
    // Using bodyModel to create collision volumes

    return () => {
      clothParticles.current = []
    }
  }, [model, bodyModel, options])

  return { clothParticles, constraints }
}