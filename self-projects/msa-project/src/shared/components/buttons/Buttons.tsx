import React from "react";
import { Box, Button, Fab, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TEXT } from "@/shared/constants";

// ─── FAB Button ──────────────────────────────────────────

interface CreateFabButtonProps {
  onClick: () => void;
}

export const CreateFabButton: React.FC<CreateFabButtonProps> = React.memo(
  ({ onClick }) => (
    <Box
      sx={{
        position: "fixed",
        bottom: 75,
        right: 16,
        zIndex: 12,
      }}
    >
      <Fab color="primary" onClick={onClick}>
        <AddIcon />
      </Fab>
    </Box>
  ),
);

CreateFabButton.displayName = "CreateFabButton";

// ─── Form Actions ────────────────────────────────────────

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isDirty: boolean;
}

export const FormActions: React.FC<FormActionsProps> = React.memo(
  ({ onCancel, onSubmit, isDirty }) => (
    <Stack spacing={1} direction="row" mt={4} justifyContent="end">
      <Button variant="outlined" size="large" onClick={onCancel}>
        {TEXT.CANCEL}
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={onSubmit}
        disabled={!isDirty}
      >
        {TEXT.SAVE}
      </Button>
    </Stack>
  ),
);

FormActions.displayName = "FormActions";

// ─── Toolbar Container ──────────────────────────────────

interface ToolbarContainerProps {
  children: React.ReactNode;
}

export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  children,
}) => <Box sx={{ px: 2, pb: 2 }}>{children}</Box>;
