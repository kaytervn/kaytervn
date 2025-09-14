import { Box, Paper, Typography } from "@mui/material";
import { TEXT } from "../services/constant";

export const BasicPaper = ({ label, children }: any) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 350, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {(label || TEXT.SAMPLE_TEXT).toUpperCase()}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};
