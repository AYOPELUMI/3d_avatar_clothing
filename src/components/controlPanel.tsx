import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress,
    TextField,
    InputAdornment,
} from '@mui/material';
import ColorPicker from 'mui-color-picker'
import ModelUploader from './modelUploader';
import { useAppContext } from '../context/appContext';

const ControlPanel = () => {
    const {
        clothingVisible,
        setClothingVisible,
        clothingColor,
        setClothingColor,
        isLoading,
        avatar,
        clothing,
        setAvatar,
        setClothing,
    } = useAppContext();
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const handleReset = () => {
        setAvatar(null);
        setClothing(null);
    };

    return (
        <Box
            sx={{
                p: 3,
                height: '100vh',
                overflowY: 'auto',
                backgroundColor: 'background.paper',
                boxShadow: 1,
            }}
        >
            <Typography variant="h5" gutterBottom>
                3D Avatar Fitting
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
                Upload Models
            </Typography>

            <ModelUploader type="avatar" />
            <ModelUploader type="clothing" />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
                Clothing Controls
            </Typography>

            <FormControlLabel
                control={
                    <Switch
                        checked={clothingVisible}
                        onChange={(e) => setClothingVisible(e.target.checked)}
                        disabled={!clothing}
                    />
                }
                label="Show Clothing"
            />

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => setColorPickerOpen(true)}
                    disabled={!clothing}
                    fullWidth
                >
                    Change Clothing Color
                </Button>

                {colorPickerOpen && (
                    <ColorPicker
                        open={colorPickerOpen}
                        onClose={() => setColorPickerOpen(false)}
                        value={clothingColor}
                        onChange={(newValue) => setClothingColor(newValue)}
                    />
                )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
                Scene Controls
            </Typography>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleReset}
                disabled={!avatar && !clothing}
                fullWidth
            >
                Reset Scene
            </Button>
        </Box>
    );
};

export default ControlPanel;