import { Box, CircularProgress, Stack, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={2}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            color: "white",
          }}
        >
          Đang xử lý
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Vui lòng chờ trong giây lát...
        </Typography>

        <CircularProgress size={48} thickness={4} sx={{ color: "white" }} />
      </Stack>
    </Box>
  );
};

export default Loading;
