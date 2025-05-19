import { Snackbar, Alert } from "@mui/material";

interface NotificationProps {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
    onClose: () => void;
}

export function Notification({ open, message, severity, onClose }: NotificationProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            sx={{
                mb: { xs: 1, sm: 2 },
                width: { xs: "90%", sm: "auto" },
                left: { xs: "5%", sm: "12%" },
            }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}