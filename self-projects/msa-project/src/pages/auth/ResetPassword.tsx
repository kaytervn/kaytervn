import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { TEXT } from "@/shared/constants";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import {
  FormPasswordField,
  FormTextField,
} from "@/shared/components/forms/FormFields";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";

export const ResetPassword: React.FC = () => {
  const { form, handleSubmit, handleBack, loading } = useResetPasswordForm();

  return (
    <>
      <LoadingOverlay loading={loading} />
      <AuthLayout label={TEXT.RESET_PASSWORD}>
        <FormTextField
          control={form.control}
          name="code"
          label={TEXT.VERIFY_CODE}
          required
        />

        <Box mt={2}>
          <FormPasswordField
            control={form.control}
            name="newPassword"
            label={TEXT.NEW_PASSWORD}
            required
          />
        </Box>

        <Box mt={2}>
          <FormPasswordField
            control={form.control}
            name="confirmPassword"
            label={TEXT.CONFIRM_PASSWORD}
            required
          />
        </Box>

        <Stack spacing={1} direction={"row"} mt={3}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleBack}
          >
            {TEXT.BACK}
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={form.handleSubmit(handleSubmit)}
          >
            {TEXT.CONTINUE}
          </Button>
        </Stack>
      </AuthLayout>
    </>
  );
};
