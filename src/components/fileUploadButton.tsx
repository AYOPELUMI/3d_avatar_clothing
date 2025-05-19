import { CloudUpload } from "@mui/icons-material";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface FileUploadButtonProps {
  onUpload: (files: File[]) => void;
  isLoading: boolean;
  acceptedFileTypes: string[];
  label: string;
  success: boolean;
  color: "primary" | "secondary";
}

export function FileUploadButton({
  onUpload,
  isLoading,
  acceptedFileTypes,
  label,
  success,
  color,
}: FileUploadButtonProps) {
  const theme = useTheme();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
    },
    onDrop: onUpload,
    disabled: isLoading,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: `2px dashed`,
        borderColor: success ? theme.palette.success.main : theme.palette[color].main,
        borderRadius: 1,
        p: { xs: '4px', sm: 1 }, // Further reduced padding on mobile
        textAlign: "center",
        cursor: isLoading ? "wait" : "pointer",
        bgcolor: success ? theme.palette.success.light : theme.palette[color].light,
        color: "white",
        opacity: isLoading ? 0.7 : 1,
        transition: "all 0.3s ease",
        minHeight: { xs: '40px', sm: 'auto' }, // Fixed height on mobile
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        "&:hover": {
          opacity: isLoading ? 0.7 : 0.9,
        },
      }}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <CircularProgress
          size={20} // Smaller spinner on mobile
          color="inherit"
          sx={{ display: { xs: 'none', sm: 'block' } }} // Hide spinner on mobile
        />
      ) : (
        <CloudUpload sx={{
          display: { xs: 'none', sm: 'block' }, // Hide icon on mobile
          fontSize: 40,
          mb: 1
        }} />
      )}
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.7rem', sm: '0.7rem' }, // Even smaller text on mobile
          lineHeight: { xs: 1, sm: 1.5 },
          px: { xs: 0.5, sm: 0 } // Small horizontal padding on mobile
        }}
      >
        {isLoading
          ? "Processing..."
          : isDragActive
            ? "Drop file here"
            : success
              ? `${label} Uploaded! Tap to replace`
              : `Tap to upload ${label}`} {/* Simplified text for mobile */}
      </Typography>
    </Box>
  );
}