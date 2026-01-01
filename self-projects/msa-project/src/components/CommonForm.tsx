import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { BasicAppBar } from "./BasicAppBar";
import { LoadingOverlay } from "./CustomOverlay";
import { Controller, type Control, type FieldValues } from "react-hook-form";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TEXT_MAX_LENGTH, TINY_TEXT_MAX_LENGTH } from "../services/constant";

interface CommonDisplayFieldProps {
  label: string;
  value: string | number | null | undefined;
}

export const CommonDisplayField = ({
  label,
  value,
}: CommonDisplayFieldProps) => {
  return (
    <TextField
      label={label}
      value={value ?? ""}
      fullWidth
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
    />
  );
};

interface CommonFormContainerProps {
  loading: boolean;
  children: React.ReactNode;
  isDirty?: boolean;
}

interface FieldsContainerProps {
  children: React.ReactNode;
}

export const CommonFormContainer = ({
  loading,
  children,
  isDirty,
}: CommonFormContainerProps) => {
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

export const FieldsContainer = ({ children }: FieldsContainerProps) => {
  return (
    <Stack direction={{ xs: "column", md: "row" }} columnGap={1} rowGap={3}>
      {children}
    </Stack>
  );
};

interface CommonTextFieldProps {
  control: Control<FieldValues, any, FieldValues> | undefined;
  name: string;
  label: string;
  required: boolean;
}

export const CommonTextField = ({
  control,
  name,
  required,
  label,
}: CommonTextFieldProps) => {
  return (
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
          inputProps={{
            maxLength: TINY_TEXT_MAX_LENGTH,
          }}
        />
      )}
    />
  );
};

export const CommonTextAreaField = ({
  control,
  name,
  required,
  label,
}: CommonTextFieldProps) => {
  return (
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
          inputProps={{
            maxLength: TEXT_MAX_LENGTH,
          }}
        />
      )}
    />
  );
};

export const CommonPasswordField = ({
  control,
  name,
  label,
  required,
}: CommonTextFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
          inputProps={{
            maxLength: TINY_TEXT_MAX_LENGTH,
          }}
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
