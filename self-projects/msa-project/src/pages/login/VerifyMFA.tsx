import { Box, Button, Stack, TextField } from "@mui/material";
import { TEXT } from "../../services/constant";
import { BasicPaper } from "../../components/BasicPaper";

export const VerifyMFA = () => {
  return (
    <BasicPaper label={TEXT.VERIFY_MFA}>
      <Box textAlign="center" mt={2}>
        <Box
          component="img"
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
          width="100%"
          bgcolor={"white"}
          sx={{ borderRadius: 2, padding: 2 }}
        />
      </Box>

      <TextField
        label={TEXT.VERIFY_CODE}
        variant="outlined"
        fullWidth
        margin="normal"
        required
      />

      <Stack spacing={1} direction={"row"} mt={2}>
        <Button variant="outlined" fullWidth size="large">
          {TEXT.CANCEL}
        </Button>
        <Button variant="contained" fullWidth size="large">
          {TEXT.CONTINUE}
        </Button>
      </Stack>
    </BasicPaper>
  );
};
