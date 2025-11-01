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
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { useToast } from "../../config/ToastProvider";
import { isValidURL } from "../../services/utils";

export const CreatePlatform = ({ isVisible, onClose, onSubmit }: any) => {
  const { showToast } = useToast();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên không hợp lệ";
    }
    if (form.url && !isValidURL(form.url)) {
      newErrors.url = "Đường dẫn không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { name: "", url: "" },
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
      <DialogTitle>{TEXT.CREATE_PLATFORM}</DialogTitle>
      <DialogContent>
        <TextField
          label={"Tên"}
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label={"Đường dẫn"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={form.url}
          onChange={(e) => handleChange("url", e.target.value)}
          error={Boolean(errors.url)}
          helperText={errors.url}
        />
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CLOSE}
        </Button>
        <Button size="large" onClick={handleSubmit}>
          {TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
