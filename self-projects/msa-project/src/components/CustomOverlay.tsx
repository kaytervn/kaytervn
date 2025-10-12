import { Backdrop, CircularProgress } from "@mui/material";

export const LoadingOverlay = ({ loading }: any) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 10 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
