import { Box, Button, Stack } from "@mui/material";
import { TEXT } from "../../services/constant";
import NotFoundImg from "../../assets/404.png";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack spacing={1} alignItems="center" textAlign="center">
        <Box
          component="img"
          src={NotFoundImg}
          sx={{
            maxWidth: "100%",
            height: "auto",
            width: { xs: "80%", sm: "60%", md: "20%" },
          }}
        />
        <Button variant="contained" size="large" onClick={handleGoHome}>
          {TEXT.BACK}
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;
