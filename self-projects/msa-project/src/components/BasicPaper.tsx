import { Box, Paper, Typography } from "@mui/material";
import { TEXT } from "../services/constant";

export const BasicPaper = ({ label, children }: any) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ p: 2 }}
    >
      <Paper
        sx={{ p: 4, borderRadius: 2, width: "100%", maxWidth: 500, mx: "auto" }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {(label || TEXT.SAMPLE_TEXT).toUpperCase()}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};
