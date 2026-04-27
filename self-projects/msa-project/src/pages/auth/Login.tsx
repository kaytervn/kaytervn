import React from "react";
import { Box, Button, Link, Stack } from "@mui/material";
import { TEXT } from "@/shared/constants";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import {
  FormPasswordField,
  FormTextField,
} from "@/shared/components/forms/FormFields";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    isMfa,
    qrUrl,
    loginForm,
    totpForm,
    handleVerifyCredential,
    handleLogin,
    handleCancelMfa,
    loading,
  } = useLoginForm();

  return (
    <>
      <LoadingOverlay loading={loading} />
      {!isMfa ? (
        <AuthLayout label={TEXT.LOGIN}>
          <FormTextField
            control={loginForm.control}
            name="username"
            label={TEXT.USERNAME}
            required
          />

          <Box mt={2}>
            <FormPasswordField
              control={loginForm.control}
              name="password"
              label={TEXT.PASSWORD}
              required
            />
          </Box>

          <Box textAlign="right" mt={1} mb={2}>
            <Link
              variant="body2"
              underline="hover"
              onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD.path)}
              sx={{ cursor: "pointer" }}
            >
              {TEXT.FORGOT_PASSWORD}
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            size="large"
            onClick={loginForm.handleSubmit(handleVerifyCredential)}
          >
            {TEXT.CONTINUE}
          </Button>
        </AuthLayout>
      ) : (
        <AuthLayout label={TEXT.VERIFY_MFA}>
          {qrUrl && (
            <Box textAlign="center" mt={2}>
              <Box
                component="img"
                src={qrUrl}
                width="100%"
                bgcolor={"white"}
                sx={{ borderRadius: 2, padding: 2 }}
                alt="QR Code"
              />
            </Box>
          )}

          <FormTextField
            control={totpForm.control}
            name="totp"
            label={TEXT.VERIFY_CODE}
            required
          />

          <Stack spacing={1} direction={"row"} mt={2}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleCancelMfa}
            >
              {TEXT.CANCEL}
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={totpForm.handleSubmit(handleLogin)}
            >
              {TEXT.SEND}
            </Button>
          </Stack>
        </AuthLayout>
      )}
    </>
  );
};
