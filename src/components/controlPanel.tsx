import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress,
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { Popover } from '@mui/material';
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

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const colorButtonRef = useRef<HTMLButtonElement>(null);

    const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleColorPickerClose = () => {
        setAnchorEl(null);
    };

    const handleReset = () => {
        setAvatar(null);
        setClothing(null);
    };

    const colorPickerOpen = Boolean(anchorEl);

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
                    onClick={handleColorButtonClick}
                    disabled={!clothing}
                    fullWidth
                    sx={{ mb: 2 }}
                    ref={colorButtonRef}
                >
                    Change Clothing Color
                    <div style={{
                        width: 20,
                        height: 20,
                        backgroundColor: clothingColor,
                        marginLeft: 10,
                        border: '1px solid #ccc'
                    }} />
                </Button>

                <Popover
                    open={colorPickerOpen}
                    anchorEl={anchorEl}
                    onClose={handleColorPickerClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <HexColorPicker color={clothingColor} onChange={setClothingColor} />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={handleColorPickerClose}
                                size="small"
                            >
                                Apply
                            </Button>
                        </Box>
                    </Box>
                </Popover>
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