import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useApi from "../../hooks/useApi";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { useDialogManager } from "../../hooks/useDialog";
import useEncryption from "../../hooks/useEncryption";
import { useGlobalContext } from "../../config/GlobalProvider";
import { useToast } from "../../config/ToastProvider";
import { useEffect, useState } from "react";
import { decryptRSA } from "../../services/utils";
import { TEXT, TOAST } from "../../services/constant";
import useForm from "../../hooks/useForm";

const InputKeyDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { showToast } = useToast();
  const { clientDecryptIgnoreNonce } = useEncryption();
  const { user, loading } = useApi();
  const { setSessionKey, refreshSessionTimeout } = useGlobalContext();
  const [mySecretKey, setMySecretKey] = useState<any>(null);
  const validate = (form: any) => {
    const newErrors: any = {};
    const decryptedKey = decryptRSA(
      clientDecryptIgnoreNonce(form.sessionKey),
      mySecretKey
    );
    if (!decryptedKey) {
      newErrors.sessionKey = "Khoá giải mã không hợp lệ";
    } else {
      setSessionKey(decryptedKey);
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { sessionKey: "" },
    validate
  );

  useEffect(() => {
    const getKey = async () => {
      if (!open) {
        return;
      }
      const res = await user.getMyKey();
      if (!res.result) {
        onClose();
      }
      const secretKey = res?.data?.secretKey;
      setMySecretKey(secretKey);
    };
    getKey();
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      onClose();
      refreshSessionTimeout();
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogTitle>{"Nhập khoá giải mã"}</DialogTitle>
        <DialogContent>
          <TextField
            label={"Khoá giải mã"}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
            value={form?.sessionKey}
            maxRows={10}
            onChange={(e) => handleChange("sessionKey", e.target.value)}
            error={Boolean(errors.sessionKey)}
            helperText={errors.sessionKey}
          />
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={onClose}>
            {TEXT.CANCEL}
          </Button>
          <Button size="large" onClick={handleSubmit} variant="contained">
            {TEXT.SUBMIT}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const InputKey = () => {
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

        <Button variant="contained" size="large" onClick={open} sx={{ mt: 1 }}>
          {"Nhập mã"}
        </Button>
      </Stack>
    </Box>
  );
};

export default InputKey;
