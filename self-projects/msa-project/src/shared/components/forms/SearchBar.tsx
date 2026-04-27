import React from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { ClearOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { TEXT, TINY_TEXT_MAX_LENGTH } from "@/shared/constants";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({ value, onChange, onClear, onSearch }) => (
    <TextField
      value={value}
      placeholder={TEXT.SEARCH}
      fullWidth
      sx={{ bgcolor: "background.paper" }}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{ maxLength: TINY_TEXT_MAX_LENGTH }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {value.trim() && (
              <IconButton
                onClick={() => {
                  onChange("");
                  onClear();
                }}
              >
                <ClearOutlined />
              </IconButton>
            )}
            <IconButton onClick={onSearch}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  ),
);

SearchBar.displayName = "SearchBar";
