import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { TEXT, TINY_TEXT_MAX_LENGTH } from "../services/constant";

export const PasswordField = ({
  label = TEXT.PASSWORD,
  value,
  onChange,
  helperText,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      fullWidth
      margin="normal"
      required
      value={value}
      onChange={onChange}
      error={Boolean(helperText)}
      helperText={helperText}
      inputProps={{
        maxLength: TINY_TEXT_MAX_LENGTH,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
