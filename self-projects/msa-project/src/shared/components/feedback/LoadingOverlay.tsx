import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = React.memo(
  ({ loading }) => (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 10 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ),
);

LoadingOverlay.displayName = "LoadingOverlay";
