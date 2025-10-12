import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { TEXT } from "../services/constant";

export const PasswordField = ({ label = TEXT.PASSWORD, value, onChange, helperText }: any) => {
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
