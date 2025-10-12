/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../config/GlobalProvider";
import { useToast } from "../../config/ToastProvider";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { PasswordField } from "../../components/CustomTextField";

export const Profile = ({ isVisible, onClose, onSubmit }: any) => {
  const { showToast } = useToast();
  const { profile } = useGlobalContext();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Họ và tên không hợp lệ";
    }
    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = "Mật khẩu không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm({ fullName: "", oldPassword: "" }, validate);

  useEffect(() => {
    const fetchData = () => {
      setForm({
        ...form,
        oldPassword: "",
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
      });
    };

    resetForm();
    fetchData();
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
      <DialogTitle>{TEXT.PROFILE}</DialogTitle>
      <DialogContent>
        <TextField
          label={"Họ và tên"}
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
        />
        <TextField
          label={"Tài khoản"}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
          value={form.username}
        />
        <TextField
          label={"Địa chỉ e-mail"}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
          value={form.email}
        />
        <PasswordField
          label={TEXT.CURRENT_PASSWORD}
          value={form?.oldPassword}
          onChange={(e: any) => handleChange("oldPassword", e.target.value)}
          helperText={errors.oldPassword}
        />
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CLOSE}
        </Button>
        <Button size="large" type="submit" onClick={handleSubmit}>
          {TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
