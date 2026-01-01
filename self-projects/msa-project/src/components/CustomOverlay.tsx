import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TEXT, TOAST } from "../services/constant";
import { useToast } from "../config/ToastProvider";

export const LoadingOverlay = ({ loading }: any) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 10 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export const DeleteDialog = ({
  open,
  onClose,
  onDelete,
  title,
  refreshData,
}: any) => {
  const { showToast } = useToast();

  const handleSubmit = async () => {
    const res = await onDelete();
    onClose();
    if (!res) return;
    if (res?.result) {
      await refreshData();
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(res?.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn có chắc muốn xoá?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          {TEXT.CANCEL}
        </Button>
        <Button size="large" onClick={handleSubmit} variant="contained">
          {TEXT.DELETE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
