// types.ts
import type { Object3D, Mesh, Vector3 } from 'three';

export interface ClothOptions {
    width: number;
    height: number;
    segments: number;
    stiffness: number;
    restLength?: number;
}

export interface ClothModel extends Object3D {
    children: Mesh[];
}

export interface UseClothResult {
    clothParticles: React.RefObject<Vector3[]>;
    updateCloth?: (delta: number) => void;
    clothReady: boolean;
}