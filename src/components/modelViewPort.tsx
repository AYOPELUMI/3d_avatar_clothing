import { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { AvatarModel } from "./avatarModel";
import { ClothingModel } from "./clothingModel";
import { ModelLoadingOverlay } from "./modelLoadingOverlay";

interface ModelViewportProps {
    avatarUrl: string | null;
    clothingUrl: string | null;
    showClothing: boolean;
    clothingColor: string;
    isLoading: boolean;
}


function ResizeHandler() {
    const { camera, size } = useThree();

    useEffect(() => {
        if ('aspect' in camera) {
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
        }
    }, [size, camera]);
    return null;
}
export function ModelViewport({
    avatarUrl,
    clothingUrl,
    showClothing,
    clothingColor,
    isLoading,
    sx,
}: ModelViewportProps & { sx?: SxProps<Theme> }) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                bgcolor: '#f5f5f5',
                ...sx,
                '& canvas': {
                    display: 'block !important',
                    width: '100% !important',
                    height: '100% !important',
                }
            }}
        >
            <ModelLoadingOverlay isLoading={isLoading} />

            <Canvas
                camera={{ position: [0, 1, 5], fov: 50 }}
                onPointerEnter={() => setIsDragging(true)}
                onPointerLeave={() => setIsDragging(false)}
                gl={{ antialias: true }}
                frameloop="demand" // Better for responsive behavior
            >
                <ResizeHandler /> {/* Add this component */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />
                {avatarUrl && <AvatarModel url={avatarUrl} />}
                {clothingUrl && showClothing && (
                    <ClothingModel url={clothingUrl} color={clothingColor} />
                )}
                <OrbitControls makeDefault />
            </Canvas>

            {!avatarUrl && !clothingUrl && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        color: "text.secondary",
                        width: "80%",
                    }}
                >
                    <Box
                        component="img"
                        src="/placeholder-image.svg"
                        alt="Upload models to get started"
                        sx={{ width: 100, height: 100, mb: 2, opacity: 0.6 }}
                    />
                    <Typography variant="body1">
                        Upload an avatar and clothing to get started
                    </Typography>
                </Box>
            )}
        </Box>
    );
}