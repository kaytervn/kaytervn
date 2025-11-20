import {
  Box,
  Button,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TEXT, TINY_TEXT_MAX_LENGTH } from "../services/constant";
import { ClearOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

interface ToolbarContainerProps {
  children: React.ReactNode;
}

export const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return <Box sx={{ px: 2, pb: 2 }}>{children}</Box>;
};

interface SearchBarProps {
  value: string;
  onChange: (value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const SearchBar = ({
  value,
  onChange,
  onClear,
  onSearch,
}: SearchBarProps) => {
  return (
    <TextField
      value={value}
      placeholder={TEXT.SEARCH}
      fullWidth
      sx={{
        bgcolor: "background.paper",
      }}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{
        maxLength: TINY_TEXT_MAX_LENGTH,
      }}
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
  );
};

export const CreateFabButton = ({ onClick }: any) => {
  return (
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
  );
};

interface CommonFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  isDirty: boolean;
}

export const CommonFormActions = ({
  onCancel,
  onSubmit,
  isDirty,
}: CommonFormProps) => {
  return (
    <Stack spacing={1} direction={"row"} mt={4} justifyContent={"end"}>
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
  );
};
