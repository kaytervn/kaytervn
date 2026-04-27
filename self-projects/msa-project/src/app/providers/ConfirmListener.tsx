import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useConfirmStore } from '@/shared/stores/useConfirmStore';
import { TEXT } from '@/shared/constants';

/**
 * App-level Confirm dialog listener.
 * Renders the unsaved-changes confirmation dialog driven by Zustand.
 * Mount once at the app root — no Context Provider needed.
 */
export const ConfirmListener: React.FC = () => {
  const { open, handleConfirm, handleCancel } = useConfirmStore();

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>{'Thay đổi chưa được lưu'}</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn có chắc muốn rời đi?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleCancel}>
          {TEXT.CANCEL}
        </Button>
        <Button size="large" onClick={handleConfirm} variant="contained">
          {TEXT.CONFIRM}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
