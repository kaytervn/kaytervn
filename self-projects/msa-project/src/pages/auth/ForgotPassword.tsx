import { Button, Stack, TextField } from "@mui/material";
import { TEXT } from "../../services/constant";
import { BasicPaper } from "../../components/BasicPaper";

export const ForgotPassword = () => {
  return (
    <BasicPaper label={TEXT.FORGOT_PASSWORD.toUpperCase()}>
      <TextField
        label={TEXT.EMAIL}
        variant="outlined"
        fullWidth
        margin="normal"
        required
      />

      <Stack spacing={1} direction={"row"} mt={2}>
        <Button variant="outlined" fullWidth size="large">
          {TEXT.BACK}
        </Button>
        <Button variant="contained" fullWidth size="large">
          {TEXT.CONTINUE}
        </Button>
      </Stack>
    </BasicPaper>
  );
};
