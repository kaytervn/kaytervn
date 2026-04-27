import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TEXT, TOAST } from "@/shared/constants";
import { useToastStore } from "@/shared/stores/useToastStore";
import type { ApiResponse } from "@/shared/types/api.types";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<ApiResponse | undefined>;
  title: string;
  refreshData?: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = React.memo(
  ({ open, onClose, onDelete, title, refreshData }) => {
    const showToast = useToastStore((s) => s.showToast);

    const handleSubmit = async () => {
      const res = await onDelete();
      onClose();
      if (!res) return;
      if (res.result) {
        await refreshData?.();
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
      } else {
        showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
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
  },
);

DeleteDialog.displayName = "DeleteDialog";
