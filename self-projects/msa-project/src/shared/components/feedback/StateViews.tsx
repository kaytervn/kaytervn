import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Inbox } from "@mui/icons-material";
import { TEXT } from "@/shared/constants";

export const LoadingView: React.FC = React.memo(() => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 200,
      color: "text.secondary",
      gap: 1.5,
    }}
  >
    <CircularProgress color="primary" />
    <Typography variant="body1">{TEXT.LOADING}</Typography>
  </Box>
));

LoadingView.displayName = "LoadingView";

export const NoDataView: React.FC = React.memo(() => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 200,
      color: "text.disabled",
      gap: 1.5,
    }}
  >
    <Inbox sx={{ fontSize: 60 }} />
    <Typography variant="body1">{TEXT.NO_DATA}</Typography>
  </Box>
));

NoDataView.displayName = "NoDataView";
