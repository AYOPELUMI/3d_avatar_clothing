import { Box, CircularProgress, Typography } from "@mui/material";

export function ModelLoadingOverlay({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "white",
            }}
        >
            <CircularProgress color="inherit" size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Loading 3D Model...
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                This may take a few moments
            </Typography>
        </Box>
    );
}