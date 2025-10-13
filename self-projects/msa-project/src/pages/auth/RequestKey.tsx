/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TEXT, TOAST, VALID_PATTERN } from "../../services/constant";
import { useToast } from "../../config/ToastProvider";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { PasswordField } from "../../components/CustomTextField";

export const RequestKey = ({ isVisible, onClose, onSubmit }: any) => {
  const { showToast } = useToast();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Mật khẩu không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { password: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      await onSubmit(form);
    } else {
      showToast(TEXT.INVALID_FORM, TOAST.ERROR);
    }
  };
  return (
    <Dialog open={isVisible} onClose={onClose}>
      <DialogTitle>{TEXT.REQUEST_KEY}</DialogTitle>
      <DialogContent>
        <PasswordField
          value={form?.password}
          onChange={(e: any) => handleChange("password", e.target.value)}
          helperText={errors.password}
        />
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CANCEL}
        </Button>
        <Button size="large" onClick={handleSubmit}>
          {TEXT.SEND}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
