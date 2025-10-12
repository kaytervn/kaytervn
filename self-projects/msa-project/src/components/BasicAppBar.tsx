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
import { TEXT, TOAST } from "../services/constant";
import { ClearOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBarProps } from "../services/interfaces";
import { PAGE_CONFIG } from "../config/PageConfig";
import { useDialog } from "../hooks/useDialog";
import { RequestKey } from "../pages/auth/RequestKey";
import useApi from "../hooks/useApi";
import { LoadingOverlay } from "./CustomOverlay";
import { useToast } from "../config/ToastProvider";
import { Logout } from "../pages/auth/Logout";
import { ChangePassword } from "../pages/auth/ChangePassword";
import { Profile } from "../pages/auth/Profile";

export const BasicAppBar = (props: AppBarProps) => {
  const { showToast } = useToast();
  const { user, loading } = useApi();
  const {
    isVisible: rkVisible,
    onOpen: rkOpen,
    onClose: rkClose,
  } = useDialog();
  const navigate = useNavigate();
  const {
    isVisible: loVisible,
    onOpen: loOpen,
    onClose: loClose,
  } = useDialog();
  const {
    isVisible: cpVisible,
    onOpen: cpOpen,
    onClose: cpClose,
  } = useDialog();
  const {
    isVisible: pfVisible,
    onOpen: pfOpen,
    onClose: pfClose,
  } = useDialog();
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

  const handleRequestKey = async (form: any) => {
    const res = await user.requestKey(form);
    if (res.result) {
      rkClose();
      showToast(TEXT.REQUEST_KEY_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(TEXT.INVALID_PASSWORD, TOAST.ERROR);
    }
  };

  const handleChangePassword = async (form: any) => {
    const res = await user.changePassword(form);
    if (res.result) {
      cpClose();
      showToast(TEXT.CHANGE_PASSWORD_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  const handleUpdateProfile = async (form: any) => {
    const res = await user.updateProfile(form);
    if (res.result) {
      pfClose();
      showToast(TEXT.UPDATED, TOAST.SUCCESS);
      window.location.reload();
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
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
              <MenuItem
                onClick={() => {
                  pfOpen();
                  handleMenuClose();
                }}
              >
                {TEXT.PROFILE}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  rkOpen();
                  handleMenuClose();
                }}
              >
                {TEXT.REQUEST_KEY}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  cpOpen();
                  handleMenuClose();
                }}
              >
                {TEXT.CHANGE_PASSWORD}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  loOpen();
                  handleMenuClose();
                }}
              >
                {TEXT.LOGOUT}
              </MenuItem>
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
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerToggle}
          >
            <List>
              {Object.entries(PAGE_CONFIG).map(([key, item]: any) => {
                return (
                  <ListItem key={key} disablePadding>
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
                );
              })}
            </List>
          </Box>
        </Drawer>
        <RequestKey
          isVisible={rkVisible}
          onClose={rkClose}
          onSubmit={handleRequestKey}
        />
        <ChangePassword
          isVisible={cpVisible}
          onClose={cpClose}
          onSubmit={handleChangePassword}
        />
        <Profile
          isVisible={pfVisible}
          onClose={pfClose}
          onSubmit={handleUpdateProfile}
        />
        <Logout isVisible={loVisible} onClose={loClose} />
        <Box>{props.children}</Box>
      </Box>
    </>
  );
};
