import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { TEXT } from "../../services/constant";
import { useState } from "react";
import { Description } from "@mui/icons-material";
import { CustomBreadcrumb } from "../../components/Breadcrumb";

export default function AutoFitListView() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  return (
    <Box
      p={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          {[{ id: 1, name: "", description: "" }].map((item) => (
            <Grid size={4}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: "100%",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box flex={1} minWidth={0}>
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                  <Box display="flex" flexShrink={0}>
                    <IconButton
                      size="large"
                      onClick={(e) => handleOpen(e, item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            console.log("Edit", selectedId);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Delete", selectedId);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("View", selectedId);
            handleClose();
          }}
        >
          View
        </MenuItem>
      </Menu>
    </Box>
  );
}

export const Account = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>

          <Avatar>H</Avatar>
        </Toolbar>

        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Ô nhập tự co giãn */}
            {/* <Box bgcolor="background.paper" display={"flex"}> */}
            <TextField
              placeholder={TEXT.SEARCH}
              fullWidth
              sx={{
                bgcolor: "background.paper",
              }}
              // Nếu muốn nút search nằm trong luôn thì có thể dùng InputAdornment
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <ClearIcon />
                    </IconButton>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained">
              <Box sx={{ p: 1 }}>{TEXT.CREATE}</Box>
            </Button>
          </Stack>
        </Box>
      </AppBar>
      <Box
        position={"sticky"}
        top={64}
        zIndex={10}
        bgcolor={"background.paper"}
      ></Box>
      <Box mx={2} mt={2}>
        <CustomBreadcrumb items={[{ label: "TEST" }]} />
      </Box>
      <AutoFitListView />
      <Box
        position={"sticky"}
        bottom={0}
        zIndex={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={"background.paper"}
      >
        <Box sx={{ py: 2 }}>
          <Pagination
            count={1000}
            size="large"
            color="primary"
            shape="rounded"
            siblingCount={0}
          />
        </Box>
      </Box>
    </Box>
  );
};
