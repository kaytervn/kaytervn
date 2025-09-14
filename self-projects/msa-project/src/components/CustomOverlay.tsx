import { Backdrop, CircularProgress } from "@mui/material";

export const LoadingOverlay = ({ loading }: any) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
