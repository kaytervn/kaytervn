import { Box, Button, Link, Stack, TextField } from "@mui/material";
import {
  GRANT_TYPE,
  LOCAL_STORAGE,
  TEXT,
  TOAST,
} from "../../services/constant";
import { BasicPaper } from "../../components/BasicPaper";
import { LoadingOverlay } from "../../components/CustomOverlay";
import useApi from "../../hooks/useApi";
import { useState } from "react";
import { useToast } from "../../config/ToastProvider";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { setStorageData } from "../../services/storages";
import { PasswordField } from "../../components/CustomTextField";
import { AUTH_CONFIG } from "../../config/PageConfig";

export const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const [isMfa, setIsMfa] = useState(false);
  const [qrUrl, setQrUrl] = useState<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!isMfa) {
      if (!form.username.trim()) {
        newErrors.username = "Tài khoản là bắt buộc";
      }
      if (!form.password) {
        newErrors.password = "Mật khẩu là bắt buộc";
      }
    } else {
      if (!form.totp) {
        newErrors.totp = "Mã xác thực là bắt buộc";
      }
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { username: "", password: "", totp: "" },
    validate
  );

  const handleSubmitLogin = async () => {
    if (isValidForm()) {
      const verify = await user.verifyCreditial({
        username: form.username,
        password: form.password,
      });
      if (!verify?.result) {
        showToast(TEXT.LOGIN_FAILED, TOAST.ERROR);
        return;
      }
      const data = verify.data;
      setIsMfa(true);
      if (data?.qrCodeUrl) {
        setQrUrl(data.qrCodeUrl);
      }
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleSubmitTOTP = async () => {
    if (isValidForm()) {
      const res = await user.login({
        username: form.username,
        password: form.password,
        totp: form.totp,
        grant_type: GRANT_TYPE.PASSWORD,
      });
      const accessToken = res?.access_token;
      if (accessToken) {
        showToast(TEXT.LOGGED_IN, TOAST.SUCCESS);
        setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
        window.location.href = "/";
      } else {
        showToast(TEXT.INVALID_TOTP, TOAST.ERROR);
      }
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleCancelSubmitOTP = () => {
    setIsMfa(false);
    setQrUrl(null);
    resetForm();
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      {!isMfa ? (
        <BasicPaper label={TEXT.LOGIN}>
          <TextField
            label={TEXT.USERNAME}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />

          <PasswordField
            value={form.password}
            onChange={(e: any) => handleChange("password", e.target.value)}
            helperText={errors.password}
          />

          <Box textAlign="right" mt={1} mb={2}>
            <Link
              variant="body2"
              underline="hover"
              onClick={() => navigate(AUTH_CONFIG.FORGOT_PASSWORD.path)}
            >
              {TEXT.FORGOT_PASSWORD}
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            size="large"
            onClick={handleSubmitLogin}
          >
            {TEXT.CONTINUE}
          </Button>
        </BasicPaper>
      ) : (
        <BasicPaper label={TEXT.VERIFY_MFA}>
          {qrUrl && (
            <Box textAlign="center" mt={2}>
              <Box
                component="img"
                src={qrUrl}
                width="100%"
                bgcolor={"white"}
                sx={{ borderRadius: 2, padding: 2 }}
              />
            </Box>
          )}

          <TextField
            label={TEXT.VERIFY_CODE}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={form.totp}
            onChange={(e) => handleChange("totp", e.target.value)}
            error={Boolean(errors.totp)}
            helperText={errors.totp}
          />

          <Stack spacing={1} direction={"row"} mt={2}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleCancelSubmitOTP}
            >
              {TEXT.CANCEL}
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmitTOTP}
            >
              {TEXT.SEND}
            </Button>
          </Stack>
        </BasicPaper>
      )}
    </>
  );
};
