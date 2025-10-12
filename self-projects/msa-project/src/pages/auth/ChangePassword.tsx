/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { PasswordField } from "../../components/CustomTextField";
import { TEXT, TOAST } from "../../services/constant";
import { useEffect } from "react";
import useForm from "../../hooks/useForm";
import { useToast } from "../../config/ToastProvider";

export const ChangePassword = ({ isVisible, onClose, onSubmit }: any) => {
  const { showToast } = useToast();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = "Mật khẩu hiện tại không hợp lệ";
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới không hợp lệ";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { oldPassword: "", newPassword: "", confirmPassword: "" },
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
    <Dialog open={isVisible}>
      <DialogTitle>{TEXT.CHANGE_PASSWORD}</DialogTitle>
      <DialogContent>
        <PasswordField
          label={TEXT.CURRENT_PASSWORD}
          value={form?.oldPassword}
          onChange={(e: any) => handleChange("oldPassword", e.target.value)}
          helperText={errors.oldPassword}
        />
        <PasswordField
          label={TEXT.NEW_PASSWORD}
          value={form?.newPassword}
          onChange={(e: any) => handleChange("newPassword", e.target.value)}
          helperText={errors.newPassword}
        />
        <PasswordField
          label={TEXT.CONFIRM_PASSWORD}
          onChange={(e: any) => handleChange("confirmPassword", e.target.value)}
          helperText={errors.confirmPassword}
        />
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CANCEL}
        </Button>
        <Button size="large" type="submit" onClick={handleSubmit}>
          {TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
