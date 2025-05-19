import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { Physics } from '@react-three/cannon';
import { AvatarModel } from "./avatarModel";
import { ClothingModel } from "./ClothingModel";

interface ModelViewportProps {
    avatarUrl: string | null;
    clothingUrl: string | null;
    showClothing: boolean;
    clothingColor: string;
    isLoading: boolean;
}

export function ModelViewport({
    avatarUrl,
    clothingUrl,
    showClothing,
    clothingColor,
    isLoading,
    sx
}: ModelViewportProps & { sx?: SxProps<Theme> }) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            bgcolor: '#f5f5f5',
            ...sx,
            border: isDragging ? '2px dashed #3f51b5' : 'none',
            '& canvas': {
                display: 'block',
                width: '100% !important',
                height: '100% !important',
            }
        }}>
            <Canvas
                camera={{ position: [0, 1.5, 5], fov: 45 }}
                onPointerEnter={() => setIsDragging(true)}
                onPointerLeave={() => setIsDragging(false)}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.75} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />

                <Physics gravity={[0, -5, 0]} defaultContactMaterial={{ restitution: 0.2 }}>
                    <Suspense fallback={null}>
                        {avatarUrl && (
                            <AvatarModel
                                url={avatarUrl}
                                position={[0, 0, 0]}
                            />
                        )}
                        {clothingUrl && showClothing && (
                            <ClothingModel
                                url={clothingUrl}
                                color={clothingColor}
                                avatarUrl={avatarUrl ?? ""}
                            />
                        )}
                    </Suspense>
                </Physics>

                <OrbitControls
                    makeDefault
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75}
                />


            </Canvas>

            {!avatarUrl && !clothingUrl && (
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "text.secondary",
                    width: "80%",
                }}>
                    <Typography variant="body1">
                        Upload an avatar and clothing to get started
                    </Typography>
                </Box>
            )}
        </Box>
    );
}