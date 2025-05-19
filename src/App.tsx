import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";
import { theme } from "./theme";
import { ModelViewport } from "./components/modelViewPort";
import { ControlsPanel } from "./components/controlPanel";
import { Notification } from "./components/Notification";
import { useFileUpload } from "./hooks/useFileUploader";

export default function App() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [clothingUrl, setClothingUrl] = useState<string | null>(null)
  const [showClothing, setShowClothing] = useState(true)
  const [clothingColor, setClothingColor] = useState("#ffffff")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const { isLoading, handleFileUpload } = useFileUpload();


  const handleAvatarUpload = async (files: File[]) => {
    const result = await handleFileUpload(files, setAvatarUrl, "avatar");
    if (result) {
      setNotification({
        open: true,
        message: result.message,
        severity: result.severity,
      });
    }
  };

  const handleClothingUpload = async (files: File[]) => {
    const result = await handleFileUpload(files, setClothingUrl, "clothing");
    if (result) {
      setNotification({
        open: true,
        message: result.message,
        severity: result.severity,
      });
    }
  };

  const resetScene = () => {
    setAvatarUrl(null);
    setClothingUrl(null);
    setShowClothing(true);
    setClothingColor("#ffffff");
    setShowColorPicker(false);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        disableGutters // Remove default padding
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          p: { xs: 1, md: 2 }, // No padding
          m: 0, // No margin
          width: "100vw", // Full viewport width
          overflow: "hidden", // Prevent scrolling
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1.25rem" },
            py: 2,
            px: 2,
            mb: 0,
          }}
        >
          3D Avatar Fitting App
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
            width: "100%",
            minHeight: { xs: "calc(100vh - 72px)", md: "calc(100vh - 80px)" }, // Account for header
            overflow: "hidden",
            position: "relative",
            gap: 4
          }}
        >


          <ModelViewport
            avatarUrl={avatarUrl}
            clothingUrl={clothingUrl}
            showClothing={showClothing}
            clothingColor={clothingColor}
            isLoading={isLoading}

            sx={{
              position: "relative",
              height: { xs: "60%", md: "calc(100vh - 80px)" },
              width: { xs: "100%", md: "calc(100% - 350px)" },
              flex: 1
            }}
          />


          <ControlsPanel
            avatarUrl={avatarUrl}
            clothingUrl={clothingUrl}
            showClothing={showClothing}
            clothingColor={clothingColor}
            showColorPicker={showColorPicker}
            onAvatarUpload={handleAvatarUpload}
            onClothingUpload={handleClothingUpload}
            onShowClothingChange={setShowClothing}
            onColorChange={setClothingColor}
            onColorPickerToggle={() => setShowColorPicker(!showColorPicker)}
            onReset={resetScene}
            isLoading={isLoading}
            sx={{
              height: { xs: "auto", md: "calc(100vh - 80px)" },
              maxHeight: { xs: "40vh", md: "100%" },
              width: { xs: "100%", md: 350 },
              overflowY: "auto",
            }}
          />
        </Box>

        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={handleCloseNotification}
        />
      </Container>
    </ThemeProvider>

  );
}