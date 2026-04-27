import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormTextAreaField } from "@/shared/components/forms/FormFields";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { TEXT } from "@/shared/constants";
import { inputKeySchema } from "@/features/encryption/types";
import { useInputKeyForm } from "@/features/encryption/hooks/useInputKeyForm";

const InputKeyDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { handleSubmit, loading } = useInputKeyForm(onClose);

  return (
    <>
      <LoadingOverlay loading={loading} />
      <FormDialog
        open={open}
        title={"Nhập khoá giải mã"}
        schema={inputKeySchema}
        defaultValues={{ sessionKey: "" }}
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={[
          {
            name: "sessionKey",
            render: ({ control }) => (
              <FormTextAreaField
                control={control}
                name="sessionKey"
                label={"Khoá giải mã"}
                required
              />
            ),
          },
        ]}
      />
    </>
  );
};

const InputKey: React.FC = () => {
  const { visible, open, close } = useDialogManager();
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <InputKeyDialog open={visible} onClose={close} />
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
            color: "white",
          }}
        >
          Phiên giải mã hết hạn
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
            color: "rgba(255,255,255,0.8)",
            maxWidth: 480,
          }}
        >
          Vui lòng nhập lại mã để tiếp tục
        </Typography>

        <Button variant="contained" size="large" onClick={() => open()} sx={{ mt: 1 }}>
          {TEXT.SUBMIT}
        </Button>
      </Stack>
    </Box>
  );
};

export default InputKey;
