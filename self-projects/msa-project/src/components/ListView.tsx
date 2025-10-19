import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Inbox, MoreVert } from "@mui/icons-material";
import React, { useState } from "react";
import { TEXT } from "../services/constant";

interface MenuItemProps {
  label: string;
  onClick: (id: number | null) => void;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface ListViewProps<T> {
  data: T[];
  renderContent: (item: T) => React.ReactNode;
  menu: MenuItemProps[];
  pagination: PaginationProps;
}

export const StickyPagination: React.FC<{ pagination: PaginationProps }> = ({
  pagination,
}) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    pagination.onChange(value - 1);
  };
  return (
    <Box
      position="sticky"
      bottom={0}
      zIndex={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.paper"
    >
      <Box sx={{ py: 2 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page + 1}
          onChange={handleChange}
          size="large"
          color="primary"
          shape="rounded"
          siblingCount={0}
        />
      </Box>
    </Box>
  );
};

export const LoadingView: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        color: "text.secondary",
        gap: 1.5,
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1">{TEXT.LOADING}</Typography>
    </Box>
  );
};

export const NoDataView: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        color: "text.disabled",
        gap: 1.5,
      }}
    >
      <Inbox sx={{ fontSize: 60 }} />
      <Typography variant="body1">{TEXT.NO_DATA}</Typography>
    </Box>
  );
};

export const BasicListView = <T extends { id: number }>({
  data,
  renderContent,
  menu,
  pagination,
}: ListViewProps<T>) => {
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
    <>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {!data || data.length === 0 ? (
            <NoDataView />
          ) : (
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
              {data.map((item) => (
                <Grid key={item.id} size={4}>
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
                        {renderContent(item)}
                      </Box>
                      <IconButton
                        size="large"
                        onClick={(e) => handleOpen(e, item.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menu.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose();
                item.onClick(selectedId);
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {pagination.totalPages > 1 && (
        <StickyPagination pagination={pagination} />
      )}
    </>
  );
};
