import React from 'react';
import { Snackbar, Alert, type SnackbarCloseReason } from '@mui/material';
import { useToastStore } from '@/shared/stores/useToastStore';

/**
 * App-level Toast listener component.
 * Renders a MUI Snackbar that reacts to Zustand toast store changes.
 * Mount once at the app root — no Context Provider needed.
 */
export const ToastListener: React.FC = () => {
  const { open, message, type, hideToast } = useToastStore();

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ): void => {
    if (reason === 'clickaway') return;
    hideToast();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
