import { Button, Stack, TextField } from "@mui/material";
import { TEXT, TOAST, VALID_PATTERN } from "../../services/constant";
import { BasicPaper } from "../../components/BasicPaper";
import { useNavigate } from "react-router-dom";
import { AUTH_CONFIG } from "../../config/PageConfig";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { LoadingOverlay } from "../../components/CustomOverlay";

export const ForgotPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Địa chỉ e-mail không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.requestForgetPassword(form);
      if (res.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        navigate(AUTH_CONFIG.RESET_PASSWORD.path, {
          state: {
            userId: res.data.userId,
          },
        });
      } else {
        showToast(TEXT.INVALID_EMAIL, TOAST.ERROR);
      }
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <BasicPaper label={TEXT.FORGOT_PASSWORD.toUpperCase()}>
        <TextField
          label={TEXT.EMAIL}
          variant="outlined"
          fullWidth
          margin="normal"
          required
          onChange={(e) => handleChange("email", e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />

        <Stack spacing={1} direction={"row"} mt={2}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            sx={{ whiteSpace: "nowrap" }}
            onClick={() => navigate(AUTH_CONFIG.LOGIN.path)}
          >
            {TEXT.BACK}
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{ whiteSpace: "nowrap" }}
          >
            {TEXT.CONTINUE}
          </Button>
        </Stack>
      </BasicPaper>
    </>
  );
};
