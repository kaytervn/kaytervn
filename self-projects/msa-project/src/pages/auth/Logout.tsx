import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TEXT } from "@/shared/constants";
import { removeSessionCache } from "@/shared/services/storage";

interface LogoutProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Logout: React.FC<LogoutProps> = ({ isVisible, onClose }) => {
  const handleSubmit = () => {
    removeSessionCache();
    window.location.href = "/";
  };

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{TEXT.LOGOUT}</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn có chắc muốn đăng xuất?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CANCEL}
        </Button>
        <Button size="large" onClick={handleSubmit} variant="contained">
          {TEXT.EXIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
