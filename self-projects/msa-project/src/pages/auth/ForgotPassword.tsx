import React from "react";
import { Button, Stack } from "@mui/material";
import { TEXT } from "@/shared/constants";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { FormTextField } from "@/shared/components/forms/FormFields";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import { useForgotPasswordForm } from "@/features/auth/hooks/useForgotPasswordForm";

export const ForgotPassword: React.FC = () => {
  const { form, handleSubmit, handleBack, loading } = useForgotPasswordForm();

  return (
    <>
      <LoadingOverlay loading={loading} />
      <AuthLayout label={TEXT.FORGOT_PASSWORD}>
        <FormTextField
          control={form.control}
          name="email"
          label={TEXT.EMAIL}
          required
        />

        <Stack spacing={1} direction={"row"} mt={2}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            sx={{ whiteSpace: "nowrap" }}
            onClick={handleBack}
          >
            {TEXT.BACK}
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={form.handleSubmit(handleSubmit)}
            sx={{ whiteSpace: "nowrap" }}
          >
            {TEXT.CONTINUE}
          </Button>
        </Stack>
      </AuthLayout>
    </>
  );
};
