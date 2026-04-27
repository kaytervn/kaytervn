import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useSessionStore } from "@/shared/stores/useSessionStore";
import { useConfirmStore } from "@/shared/stores/useConfirmStore";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { TEXT, SIDEBAR_MENUS, ENCRYPT_PATH } from "@/shared/constants";
import { getAvatarInitials } from "@/shared/utils/format";
import { comparePath } from "@/shared/utils/validation";
import { usePageLabel } from "@/shared/hooks/usePageLabel";

// Auth Dialogs (Refactored)
import { RequestKey } from "@/pages/auth/RequestKey";
import { Logout } from "@/pages/auth/Logout";
import { ChangePassword } from "@/pages/auth/ChangePassword";
import { Profile } from "@/pages/auth/Profile";
import InputKey from "@/pages/others/InputKey";

interface BasicAppBarProps {
  children?: React.ReactNode;
  renderToolbar?: React.ReactNode;
  isDirty?: boolean;
}

export const BasicAppBar: React.FC<BasicAppBarProps> = ({
  children,
  renderToolbar,
  isDirty,
}) => {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const sessionKey = useSessionStore((s) => s.sessionKey);
  const confirm = useConfirmStore((s) => s.confirm);
  
  const label = usePageLabel();
  const pathname = window.location.pathname;
  const isEncryptPath = ENCRYPT_PATH.some((path) => comparePath(pathname, path));
  const isSessionTimeout = isEncryptPath && !sessionKey;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rkDialog = useDialogManager();
  const loDialog = useDialogManager();
  const cpDialog = useDialogManager();
  const pfDialog = useDialogManager();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const validateDirty = async (): Promise<boolean> => {
    if (!isDirty) return true;
    return await confirm();
  };

  const handleNavigation = async (path: string) => {
    setDrawerOpen(false);
    if (await validateDirty()) {
      navigate(path);
    }
  };

  return (
    <>
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
              {label}
            </Typography>
            <IconButton onClick={handleMenuClick} size="small">
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {getAvatarInitials(profile?.fullName)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => { pfDialog.open(); handleMenuClose(); }}>
                {TEXT.PROFILE}
              </MenuItem>
              <MenuItem onClick={() => { rkDialog.open(); handleMenuClose(); }}>
                {TEXT.REQUEST_KEY}
              </MenuItem>
              <MenuItem onClick={() => { cpDialog.open(); handleMenuClose(); }}>
                {TEXT.CHANGE_PASSWORD}
              </MenuItem>
              <MenuItem onClick={() => { loDialog.open(); handleMenuClose(); }}>
                {TEXT.LOGOUT}
              </MenuItem>
            </Menu>
          </Toolbar>
          {!isSessionTimeout && renderToolbar}
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              {Object.entries(SIDEBAR_MENUS).map(([key, item]) => (
                <ListItem key={key} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Dialogs */}
        <RequestKey isVisible={rkDialog.visible} onClose={rkDialog.close} />
        <ChangePassword isVisible={cpDialog.visible} onClose={cpDialog.close} />
        <Profile isVisible={pfDialog.visible} onClose={pfDialog.close} />
        <Logout isVisible={loDialog.visible} onClose={loDialog.close} />

        <Box sx={{ p: 0 }}>
          {isSessionTimeout ? <InputKey /> : children}
        </Box>
      </Box>
    </>
  );
};
