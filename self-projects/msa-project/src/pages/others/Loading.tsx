import { Box, CircularProgress, Stack } from "@mui/material";
import LoadingImg from "../../assets/loading.png";

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
      <Stack spacing={3} alignItems="center">
        <Box
          component="img"
          src={LoadingImg}
          sx={{
            maxWidth: "100%",
            height: "auto",
            width: { xs: "80%", sm: "60%", md: "20%" },
          }}
        />
        <CircularProgress size={48} thickness={4} sx={{ color: "white" }} />
      </Stack>
    </Box>
  );
};

export default Loading;
