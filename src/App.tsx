
import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei"
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import ColorLensIcon from "@mui/icons-material/ColorLens"
import { HexColorPicker } from "react-colorful"
import { useDropzone } from "react-dropzone"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

export default function App() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [clothingUrl, setClothingUrl] = useState<string | null>(null)
  const [showClothing, setShowClothing] = useState(true)
  const [clothingColor, setClothingColor] = useState("#ffffff")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info"
  }>({
    open: false,
    message: "",
    severity: "info",
  })

  // Handle file uploads
  const handleFileUpload = (files: File[], setUrl: (url: string) => void, type: "avatar" | "clothing") => {
    if (files.length === 0) return

    const file = files[0]
    if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
      setNotification({
        open: true,
        message: "Please upload a GLB or GLTF file",
        severity: "error",
      })
      return
    }

    setIsLoading(true)
    const url = URL.createObjectURL(file)
    setUrl(url)
    setNotification({
      open: true,
      message: `${type === "avatar" ? "Avatar" : "Clothing"} uploaded successfully!`,
      severity: "success",
    })
    setIsLoading(false)
  }

  // Avatar dropzone
  const avatarDropzone = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
    },
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles, setAvatarUrl, "avatar"),
  })

  // Clothing dropzone
  const clothingDropzone = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
    },
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles, setClothingUrl, "clothing"),
  })

  // Reset the scene
  const resetScene = () => {
    setAvatarUrl(null)
    setClothingUrl(null)
    setShowClothing(true)
    setClothingColor("#ffffff")
    setShowColorPicker(false)
  }

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: "100vw"
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            mb: { xs: 2, sm: 3 },
          }}
        >
          3D Avatar Fitting App
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: { md: "calc(100% - 80px)" },
            width: "calc(100vw - 80px)",
            gap: { xs: 2, md: 2 },
          }}
        >
          {/* 3D Viewport */}
          <Box
            sx={{
              flex: 1,
              width: { xs: "100%" },
              height: { xs: "60vh", sm: "70vh", md: "auto" },
              position: "relative",
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Suspense fallback={null}>
                <Environment preset="studio" />
                {avatarUrl && <AvatarModel url={avatarUrl} />}
                {clothingUrl && showClothing && <ClothingModel url={clothingUrl} color={clothingColor} />}
                <OrbitControls makeDefault />
              </Suspense>
            </Canvas>

            {!avatarUrl && !clothingUrl && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "text.secondary",
                  width: "80%",
                }}
              >
                <Typography variant="body1">Upload an avatar and clothing to get started</Typography>
              </Box>
            )}
          </Box>

          {/* Controls Panel */}
          <Paper
            elevation={3}
            sx={{
              width: { xs: "100%", md: 300 },
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Controls
            </Typography>

            {/* Avatar Upload */}
            <Box
              {...avatarDropzone.getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: avatarUrl ? "success.main" : "primary.main",
                borderRadius: 1,
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                cursor: "pointer",
                bgcolor: avatarUrl ? "success.light" : "primary.light",
                color: "white",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <input {...avatarDropzone.getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: { xs: 30, sm: 40 }, mb: 1 }} />
              <Typography variant="body2">
                {avatarUrl ? "Avatar Uploaded! Click to replace" : "Drag & drop or click to upload Avatar"}
              </Typography>
            </Box>

            {/* Clothing Upload */}
            <Box
              {...clothingDropzone.getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: clothingUrl ? "success.main" : "secondary.main",
                borderRadius: 1,
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                cursor: "pointer",
                bgcolor: clothingUrl ? "success.light" : "secondary.light",
                color: "white",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <input {...clothingDropzone.getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: { xs: 30, sm: 40 }, mb: 1 }} />
              <Typography variant="body2">
                {clothingUrl ? "Clothing Uploaded! Click to replace" : "Drag & drop or click to upload Clothing"}
              </Typography>
            </Box>

            {/* Toggle Clothing Visibility */}
            <FormControlLabel
              control={
                <Switch
                  checked={showClothing}
                  onChange={(e) => setShowClothing(e.target.checked)}
                  disabled={!clothingUrl}
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  {showClothing ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  <Typography variant="body2">{showClothing ? "Hide Clothing" : "Show Clothing"}</Typography>
                </Stack>
              }
            />

            {/* Color Picker */}
            <Box>
              <Button
                variant="outlined"
                startIcon={<ColorLensIcon />}
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={!clothingUrl}
                fullWidth
                sx={{ mb: 1 }}
              >
                Change Clothing Color
              </Button>
              {showColorPicker && (
                <Box sx={{ mb: 2, maxWidth: "100%", overflow: "hidden" }}>
                  <HexColorPicker color={clothingColor} onChange={setClothingColor} style={{ width: "100%" }} />
                </Box>
              )}
            </Box>

            {/* Reset Scene */}
            <Button
              variant="contained"
              color="error"
              startIcon={<RestartAltIcon />}
              onClick={resetScene}
              disabled={!avatarUrl && !clothingUrl}
            >
              Reset Scene
            </Button>
          </Paper>
        </Box>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleCloseNotification}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          sx={{
            mb: { xs: 1, sm: 2 },
            width: { xs: "90%", sm: "auto" },
            left: { xs: "5%", sm: "auto" },
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

// Avatar Model Component
function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  return (
    <Center>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </Center>
  )
}

// Clothing Model Component
function ClothingModel({ url, color }: { url: string; color: string }) {
  const { scene } = useGLTF(url)

  // Apply color to all meshes in the clothing model
  scene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material.color.set(color)
    }
  })

  return (
    <Center>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </Center>
  )
}
