/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Stack, TextField } from "@mui/material";
import { TEXT, TOAST, VALID_PATTERN } from "../../services/constant";
import { BasicPaper } from "../../components/BasicPaper";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_CONFIG } from "../../config/PageConfig";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { useEffect } from "react";
import { PasswordField } from "../../components/CustomTextField";

export const ResetPassword = () => {
  const { showToast } = useToast();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useApi();

  useEffect(() => {
    if (!state?.userId) {
      navigate(AUTH_CONFIG.FORGOT_PASSWORD.path);
    }
  }, [state]);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Mã xác thực không hợp lệ";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.newPassword)) {
      newErrors.newPassword = "Mật khẩu không hợp lệ";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "", newPassword: "", confirmPassword: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.resetPassword({ userId: state.userId, ...form });
      if (res.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        navigate(AUTH_CONFIG.LOGIN.path);
      } else {
        showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
      }
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <BasicPaper label={TEXT.RESET_PASSWORD.toUpperCase()}>
        <TextField
          label={TEXT.VERIFY_CODE}
          variant="outlined"
          fullWidth
          margin="normal"
          required
          onChange={(e) => handleChange("otp", e.target.value)}
          error={Boolean(errors.otp)}
          helperText={errors.otp}
        />

        <PasswordField
          label={TEXT.NEW_PASSWORD}
          value={form.newPassword}
          onChange={(e: any) => handleChange("newPassword", e.target.value)}
          helperText={errors.newPassword}
        />

        <PasswordField
          label={TEXT.CONFIRM_PASSWORD}
          value={form.confirmPassword}
          onChange={(e: any) => handleChange("confirmPassword", e.target.value)}
          helperText={errors.confirmPassword}
        />

        <Stack spacing={1} direction={"row"} mt={2}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => navigate(AUTH_CONFIG.LOGIN.path)}
          >
            {TEXT.BACK}
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
          >
            {TEXT.CONTINUE}
          </Button>
        </Stack>
      </BasicPaper>
    </>
  );
};
