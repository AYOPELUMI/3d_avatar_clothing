import { type Object3D, Vector3, type Mesh } from "three";

export function getBodyVertices(avatar: Object3D): Vector3[] {
    const vertices: Vector3[] = [];
    avatar.traverse((child) => {
        if ((child as Mesh).isMesh) {
            const geometry = (child as Mesh).geometry;
            if (geometry?.attributes?.position) {
                const positionAttribute = geometry.attributes.position;
                for (let i = 0; i < positionAttribute.count; i++) {
                    vertices.push(new Vector3().fromBufferAttribute(positionAttribute, i));
                }
            }
        }
    });
    return vertices;
}