import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useGlobalContext } from "../config/GlobalProvider";
import { getAvatarInitials } from "../services/utils";
import {
  Avatar,
  Button,
  Drawer,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { TEXT } from "../services/constant";
import { ClearOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIDEBAR_MENUS } from "../config/PageConfigDetails";
import { AppBarProps } from "../services/interfaces";

export const BasicAppBar = (props: AppBarProps) => {
  const navigate = useNavigate();
  const { profile } = useGlobalContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <Avatar>{getAvatarInitials(profile?.fullName)}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Hồ sơ</MenuItem>
            <MenuItem onClick={handleMenuClose}>Lấy mã</MenuItem>
            <MenuItem onClick={handleMenuClose}>Đổi mật khẩu</MenuItem>
            <MenuItem onClick={handleMenuClose}>Đăng xuất</MenuItem>
          </Menu>
        </Toolbar>
        <Box sx={{ px: 2, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              value={props.search.value}
              placeholder={TEXT.SEARCH}
              fullWidth
              sx={{
                bgcolor: "background.paper",
              }}
              onChange={(e) => props.search.onChange(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {props.search.value && (
                      <IconButton
                        onClick={() => {
                          props.search.onChange("");
                          props.search.onClear();
                        }}
                      >
                        <ClearOutlined />
                      </IconButton>
                    )}
                    <IconButton onClick={props.search.onSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={props.create.onClick}>
              <Box sx={{ p: 1 }}>{TEXT.CREATE}</Box>
            </Button>
          </Stack>
        </Box>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerToggle}
        >
          <List>
            {SIDEBAR_MENUS.map((item) => (
              <ListItem key={item.path ?? item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path!);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box>{props.children}</Box>
    </Box>
  );
};
