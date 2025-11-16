import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TEXT } from "../../services/constant";
import { removeSessionCache } from "../../services/storages";

export const Logout = ({ isVisible, onClose }: any) => {
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
