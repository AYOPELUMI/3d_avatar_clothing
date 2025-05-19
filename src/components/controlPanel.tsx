import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    Switch,
    FormControlLabel,
    type SxProps,
    type Theme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { HexColorPicker } from "react-colorful";
import { FileUploadButton } from "./fileUploadButton";

interface ControlsPanelProps {
    avatarUrl: string | null;
    clothingUrl: string | null;
    showClothing: boolean;
    clothingColor: string;
    showColorPicker: boolean;
    isLoading: boolean;
    onAvatarUpload: (files: File[]) => void;
    onClothingUpload: (files: File[]) => void;
    onShowClothingChange: (show: boolean) => void;
    onColorChange: (color: string) => void;
    onColorPickerToggle: () => void;
    onReset: () => void;
}

export function ControlsPanel({
    avatarUrl,
    clothingUrl,
    showClothing,
    clothingColor,
    showColorPicker,
    isLoading,
    onAvatarUpload,
    onClothingUpload,
    onShowClothingChange,
    onColorChange,
    onColorPickerToggle,
    onReset,
    sx,
}: ControlsPanelProps & { sx?: SxProps<Theme> }) {
    return (
        <Paper
            elevation={3}
            sx={{
                width: { xs: "100%", md: 350 },
                p: { xs: 1, sm: 1 }, // Reduced mobile padding
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflowY: "auto",
                maxHeight: { xs: "35vh", md: "100%" },
                boxSizing: 'border-box',
                ...sx,
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ px: { xs: 0.5, sm: 0 } }}>
                Controls
            </Typography>

            {/* Upload Buttons - Row on mobile */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                gap: 1, // Tighter gap on mobile
                width: '100%',
                "& > *": { flex: 1 }, // Equal width for both buttons
            }}>
                <FileUploadButton
                    onUpload={onAvatarUpload}
                    isLoading={isLoading && !avatarUrl}
                    acceptedFileTypes={[".glb", ".gltf"]}
                    label="Avatar"
                    success={!!avatarUrl}
                    color="primary"
                    disabled={false}
                />
                <FileUploadButton
                    disabled={!avatarUrl}
                    onUpload={onClothingUpload}
                    isLoading={isLoading && !clothingUrl}
                    acceptedFileTypes={[".glb", ".gltf"]}
                    label="Clothing"
                    success={!!clothingUrl}
                    color="secondary"
                />
            </Box>

            {/* Control Buttons - Row on mobile */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                gap: 1,
                alignItems: "center",
                width: '100%',
            }}>
                {/* Toggle - Shrink to fit */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={showClothing}
                            onChange={(e) => onShowClothingChange(e.target.checked)}
                            disabled={!clothingUrl}
                            size="small"
                        />
                    }
                    label={
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            {showClothing ?
                                <VisibilityIcon fontSize="small" /> :
                                <VisibilityOffIcon fontSize="small" />}
                            <Typography variant="body2" sx={{
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                display: { xs: 'none', sm: 'block' } // Hide text on mobile
                            }}>
                                {showClothing ? "Hide" : "Show"}
                            </Typography>
                        </Stack>
                    }
                    sx={{
                        flexShrink: 1,
                        m: 0, // Remove default margin
                    }}
                />

                {/* Color Picker - Flexible width */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ColorLensIcon sx={{
                            fontSize: { xs: '1rem', sm: '1.5rem' }
                        }} />}
                        onClick={onColorPickerToggle}
                        disabled={!clothingUrl}
                        size="small"
                        sx={{
                            width: '100%',
                            py: 0.5,
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        }}
                    >
                        <Box component="span" sx={{
                            display: { xs: 'none', sm: 'inline' }
                        }}>
                            Change Color
                        </Box>
                        <Box component="span" sx={{
                            display: { xs: 'inline', sm: 'none' }
                        }}>
                            Color
                        </Box>
                    </Button>
                    {showColorPicker && (
                        <Box sx={{
                            mt: 1,
                            "& .react-colorful": {
                                width: "100% !important",
                                height: "80px !important", // Compact on mobile
                            }
                        }}>
                            <HexColorPicker color={clothingColor} onChange={onColorChange} />
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Reset Button */}
            <Button
                variant="contained"
                color="error"
                startIcon={<RestartAltIcon />}
                onClick={onReset}
                disabled={!avatarUrl && !clothingUrl}
                size="small"
                sx={{
                    mt: "auto",
                    py: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                }}
            >
                Reset
            </Button>
        </Paper>
    );
}