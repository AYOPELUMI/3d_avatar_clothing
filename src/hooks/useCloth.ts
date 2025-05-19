import { useRef, useEffect } from 'react'
import { Vector3, Mesh, BufferGeometry, BufferAttribute, Object3D } from 'three'

interface UseClothOptions {
  segments?: number
  stiffness?: number
  collisionMargin?: number
  femaleBody?: boolean
  bodyInfluence?: number
}

export function useCloth({
  model,
  bodyModel,
  options
}: {
  model: Object3D | null,
  bodyModel: Object3D | null,
  options: UseClothOptions
}) {
  const clothParticles = useRef<Vector3[]>([])
  const constraints = useRef<any[]>([])

  useEffect(() => {
    if (!model?.children?.length) return

    const mesh = model.children[0] as Mesh
    if (!mesh?.isMesh || !mesh.geometry) return

    const geometry = mesh.geometry as BufferGeometry

    // Check if position attribute exists and is a BufferAttribute
    if (!geometry.attributes.position || !(geometry.attributes.position instanceof BufferAttribute)) {
      console.warn('Mesh geometry does not contain valid position attributes')
      return
    }

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