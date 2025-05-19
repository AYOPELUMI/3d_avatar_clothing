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
        p: { xs: '4px', sm: 1 },
        textAlign: "center",
        cursor: isLoading ? "wait" : "pointer",
        bgcolor: success ? theme.palette.success.light : theme.palette[color].light,
        color: "white",
        opacity: isLoading ? 0.7 : 1,
        transition: "all 0.3s ease",
        minHeight: { xs: '40px', sm: '100px' }, // Increased min-height for better drop area
        width: '100%', // Ensure full width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        position: 'relative',
        "&:hover": {
          opacity: isLoading ? 0.7 : 0.9,
        },
        // Explicit dropzone area styling
        '&:focus-visible, &:focus': {
          outline: 'none',
        },
      }}
    >
      <input
        {...getInputProps()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
      />
      <Box sx={{
        pointerEvents: 'none', // Make content non-interactive so clicks pass through
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {isLoading ? (
          <CircularProgress
            size={20}
            color="inherit"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          />
        ) : (
          <CloudUpload sx={{
            display: { xs: 'none', sm: 'block' },
            fontSize: 40,
            mb: 1
          }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.7rem' },
            lineHeight: { xs: 1, sm: 1.5 },
            px: { xs: 0.5, sm: 0 }
          }}
        >
          {isLoading
            ? "Processing..."
            : isDragActive
              ? "Drop file here"
              : success
                ? `${label} Uploaded! Tap to replace`
                : `Tap to upload ${label}`}
        </Typography>
      </Box>
    </Box>
  );
}