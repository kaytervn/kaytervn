import { Box, Button, Stack, Typography } from "@mui/material";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

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
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
            color: "white",
          }}
        >
          404 — Không tìm thấy trang
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
            color: "rgba(255,255,255,0.8)",
            maxWidth: 480,
          }}
        >
          Trang bạn yêu cầu không được tìm thấy trên nền tảng này!
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{ mt: 1 }}
        >
          {"Quay lại trang chủ"}
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;
