import { useState, useRef, type ChangeEvent, useCallback } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useAppContext } from '../context/appContext';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelUploaderProps {
    type: 'avatar' | 'clothing';
}

const ModelUploader = ({ type }: ModelUploaderProps) => {
    const { setAvatar, setClothing, setIsLoading } = useAppContext();
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            setFileName(file.name);
            setIsLoading(true);

            try {
                const loader = new GLTFLoader();
                const arrayBuffer = await file.arrayBuffer();
                const data = await new Promise<THREE.Group>((resolve, reject) => {
                    loader.parse(
                        arrayBuffer,
                        '',
                        (gltf) => resolve(gltf.scene),
                        (error) => reject(error)
                    );
                });

                if (type === 'avatar') {
                    setAvatar(data);
                } else {
                    setClothing(data);
                }
            } catch (error) {
                console.error('Error loading model:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [setAvatar, setClothing, setIsLoading, type]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (fileInputRef.current) {
                // Create a new FileList and DataTransfer to simulate file input
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;

                // Trigger change event
                const event = new Event('change', { bubbles: true });
                fileInputRef.current.dispatchEvent(event);
            }
        }
    };

    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                border: '1px dashed #ccc',
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                },
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".glb,.gltf"
                style={{ display: 'none' }}
            />
            <Typography variant="body1">
                {fileName || `Drag & drop ${type} or click to browse`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                (GLB/GLTF format)
            </Typography>
        </Box>
    );
};

export default ModelUploader;