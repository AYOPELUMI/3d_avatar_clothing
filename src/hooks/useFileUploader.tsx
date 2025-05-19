import { useState } from "react";

export const useFileUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = async (
        files: File[],
        setUrl: (url: string) => void,
        type: "avatar" | "clothing"
    ) => {
        if (files.length === 0) return null;

        const file = files[0];
        if (!file?.name.endsWith(".glb") && !file?.name.endsWith(".gltf")) {
            return {
                severity: "error" as const,
                message: "Please upload a GLB or GLTF file",
            };
        }

        setIsLoading(true);
        setUploadProgress(0);

        // Simulate progress for demo purposes
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                const newProgress = prev + Math.random() * 10;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, 200);

        try {
            // In a real app, you might upload to a server here
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const url = URL.createObjectURL(file);
            setUrl(url);

            clearInterval(interval);
            setUploadProgress(100);

            return {
                severity: "success" as const,
                message: `${type === "avatar" ? "Avatar" : "Clothing"} uploaded successfully!`,
            };
        } catch (error) {
            clearInterval(interval);
            return {
                severity: "error" as const,
                message: "Failed to upload file",
            };
        } finally {
            setIsLoading(false);
        }
    };
    return { isLoading, uploadProgress, handleFileUpload };
};