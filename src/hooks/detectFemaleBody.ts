import { Box3, Vector3, type Object3D } from "three";

export function detectFemaleBody(avatar: Object3D): boolean {
    const avatarBox = new Box3().setFromObject(avatar);
    const size = new Vector3();
    avatarBox.getSize(size);

    // Calculate body proportions
    const bustToWaistRatio = size.x / (size.z * 0.8); // Approximate waist from depth
    const hipToWaistRatio = (size.x * 0.9) / size.z; // Hips are usually wider

    // Typical female proportions have:
    // - Higher bust-to-waist ratio
    // - Higher hip-to-waist ratio
    return bustToWaistRatio > 1.2 && hipToWaistRatio > 1.3;
}