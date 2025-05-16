import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppContext } from '../context/appContext';

const SceneManager = () => {
    const { avatar, clothing, clothingVisible, clothingColor } = useAppContext();
    const { camera, scene } = useThree();
    const controlsRef = useRef<any>(null);
    const boundingBoxRef = useRef<THREE.Box3>(new THREE.Box3());

    // Center and scale models
    useEffect(() => {
        if (avatar) {
            // Center avatar
            boundingBoxRef.current.setFromObject(avatar);
            const center = boundingBoxRef.current.getCenter(new THREE.Vector3());
            avatar.position.sub(center);

            // Adjust camera
            const size = boundingBoxRef.current.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
            let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 1.5;
            camera.position.z = cameraZ;

            if (controlsRef.current) {
                controlsRef.current.target.copy(center);
                controlsRef.current.update();
            }
        }
    }, [avatar, camera]);
    // Position clothing
    useEffect(() => {
        if (clothing && avatar) {
            // Basic fitting - scale clothing to match avatar size
            const avatarBox = new THREE.Box3().setFromObject(avatar);
            const clothingBox = new THREE.Box3().setFromObject(clothing);

            const avatarSize = avatarBox.getSize(new THREE.Vector3());
            const clothingSize = clothingBox.getSize(new THREE.Vector3());

            const scale = Math.min(
                avatarSize.x / clothingSize.x,
                avatarSize.y / clothingSize.y,
                avatarSize.z / clothingSize.z
            ) * 0.8; // Slightly smaller than avatar

            clothing.scale.set(scale, scale, scale);

            // Position clothing at torso level
            const avatarCenter = avatarBox.getCenter(new THREE.Vector3());
            clothing.position.copy(avatarCenter);
            clothing.position.y += avatarSize.y * 0.2;
        }
    }, [clothing, avatar]);

    // Update clothing material color
    useEffect(() => {
        if (clothing) {
            clothing.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.color.set(clothingColor);
                    }
                }
            });
        }
    }, [clothing, clothingColor]);

    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {avatar && <primitive object={avatar} />}
            {clothing && clothingVisible && <primitive object={clothing} />}
            <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
            />
        </>
    );
};

export default SceneManager;