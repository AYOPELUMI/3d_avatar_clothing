import { CloudUpload } from "@mui/icons-material";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface FileUploadButtonProps {
  onUpload: (files: File[]) => void;
  isLoading: boolean;
  acceptedFileTypes: string[];
  label: string;
  success: boolean;
  disabled: Boolean;
  color: "primary" | "secondary";
}

export function FileUploadButton({
  onUpload,
  isLoading,
  label,
  success,
  disabled,
  color,
}: FileUploadButtonProps) {
  const theme = useTheme();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
    },
    onDrop: onUpload,
    disabled: isLoading || Boolean(disabled), // Convert to primitive boolean
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: `2px dashed`,
        borderColor: success
          ? theme.palette.success.main
          : disabled
            ? theme.palette.action.disabled
            : theme.palette[color].main,
        borderRadius: 1,
        p: { xs: '4px', sm: 1 },
        textAlign: "center",
        cursor: (isLoading || disabled) ? "default" : "pointer",
        bgcolor: success
          ? theme.palette.success.light
          : disabled
            ? theme.palette.action.disabledBackground
            : theme.palette[color].light,
        color: disabled ? theme.palette.text.disabled : "white",
        opacity: (isLoading || disabled) ? 0.7 : 1,
        transition: "all 0.3s ease",
        minHeight: { xs: '40px', sm: '100px' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        position: 'relative',
        "&:hover": {
          opacity: (isLoading || disabled) ? 0.7 : 0.9,
          bgcolor: (isLoading || disabled)
            ? undefined
            : success
              ? theme.palette.success.light
              : theme.palette[color].light,
        },
        '&:focus-visible, &:focus': {
          outline: 'none',
        },
      }}
    >
      <input
        {...getInputProps()}
        disabled={Boolean(disabled) || isLoading} // Convert disabled to primitive boolean
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: (isLoading || disabled) ? 'default' : 'pointer',
        }}
      />
      <Box sx={{
        pointerEvents: 'none',
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
            mb: 1,
            color: disabled ? theme.palette.text.disabled : "inherit",
          }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.7rem' },
            lineHeight: { xs: 1, sm: 1.5 },
            px: { xs: 0.5, sm: 0 },
            color: disabled ? theme.palette.text.disabled : "inherit",
          }}
        >
          {isLoading
            ? "Processing..."
            : isDragActive
              ? "Drop file here"
              : disabled
                ? "Upload disabled"
                : success
                  ? `${label} Uploaded! Tap to replace`
                  : `Tap to upload ${label}`}
        </Typography>
      </Box>
    </Box>
  );
}