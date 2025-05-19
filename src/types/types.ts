// types.ts
import type { Object3D, Mesh, BufferGeometry, Vector3 } from 'three';
import type { PublicApi } from '@react-three/cannon';

export interface ClothOptions {
    width: number;
    height: number;
    segments: number;
    stiffness: number;
    restLength?: number;
}

export interface ParticleApi extends PublicApi {
    position: { set: (x: number, y: number, z: number) => void };
}

export interface ClothModel extends Object3D {
    children: Mesh[];
}

export interface UseClothResult {
    clothParticles: React.RefObject<Vector3[]>;
    updateCloth?: (delta: number) => void;
    clothReady: boolean;
}