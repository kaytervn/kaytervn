import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { TINY_TEXT_MAX_LENGTH, TEXT_MAX_LENGTH } from "@/shared/constants";

// ─── Display Field (read-only) ───────────────────────────

interface DisplayFieldProps {
  label: string;
  value: string | number | null | undefined;
}

export const DisplayField: React.FC<DisplayFieldProps> = React.memo(
  ({ label, value }) => (
    <TextField
      label={label}
      value={value ?? ""}
      fullWidth
      slotProps={{ input: { readOnly: true } }}
    />
  ),
);

DisplayField.displayName = "DisplayField";

// ─── Controlled Text Field ──────────────────────────────

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}

export const FormTextField = <T extends FieldValues>({
  control,
  name,
  required = false,
  label,
}: FormTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        label={label}
        fullWidth
        required={required}
        error={Boolean(error)}
        helperText={error?.message ?? ""}
        inputProps={{ maxLength: TINY_TEXT_MAX_LENGTH }}
      />
    )}
  />
);

// ─── Controlled TextArea Field ──────────────────────────

export const FormTextAreaField = <T extends FieldValues>({
  control,
  name,
  required = false,
  label,
}: FormTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        label={label}
        fullWidth
        multiline
        rows={10}
        required={required}
        error={Boolean(error)}
        helperText={error?.message ?? ""}
        inputProps={{ maxLength: TEXT_MAX_LENGTH }}
      />
    )}
  />
);

// ─── Controlled Password Field ──────────────────────────

export const FormPasswordField = <T extends FieldValues>({
  control,
  name,
  label,
  required = false,
}: FormTextFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? "text" : "password"}
          fullWidth
          required={required}
          error={Boolean(error)}
          helperText={error?.message ?? ""}
          inputProps={{ maxLength: TINY_TEXT_MAX_LENGTH }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

// ─── Form Container (page-level form wrapper) ───────────

interface FormContainerProps {
  children: React.ReactNode;
}

export const FieldsContainer: React.FC<FormContainerProps> = ({ children }) => (
  <Stack direction={{ xs: "column", md: "row" }} columnGap={1} rowGap={3}>
    {children}
  </Stack>
);

// ─── Form Page Wrapper (with AppBar + Paper) ────────────

import { BasicAppBar } from "@/shared/components/layout/BasicAppBar";

interface FormPageContainerProps {
  loading: boolean;
  isDirty?: boolean;
  children: React.ReactNode;
}

export const FormPageContainer: React.FC<FormPageContainerProps> = ({
  loading,
  isDirty,
  children,
}) => {
  return (
    <BasicAppBar isDirty={isDirty}>
      <LoadingOverlay loading={loading} />
      <Box display="flex" sx={{ m: 2 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            flex: { xs: 1, sm: 1, md: 0.75, lg: 0.5 },
          }}
        >
          {children}
        </Paper>
      </Box>
    </BasicAppBar>
  );
};
