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
import React, { useMemo, useState } from "react";
import { TEXT } from "../services/constant";

interface MenuItemProps<T> {
  label: string;
  onClick: (id: number | null) => void;
  visible?: (item: T, selectedId: number) => boolean;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface ListViewProps<T extends { id: number }> {
  data: T[];
  renderContent: (item: T) => React.ReactNode;
  menu: MenuItemProps<T>[];
  pagination: PaginationProps;
  onItemClick?: (item: T) => void;
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
  onItemClick,
}: ListViewProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    item: T
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedItem(null);
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
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => onItemClick?.(item)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(e, item.id, item);
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                      <Box flex={1} minWidth={0}>
                        {renderContent(item)}
                      </Box>
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
          {menu
            .filter((menuItem) => {
              if (!selectedItem) return false;
              if (typeof menuItem.visible === "function") {
                return menuItem.visible(selectedItem, selectedId!);
              }
              return true;
            })
            .map((item, index) => (
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

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface GroupedListViewProps<T extends { id: number }> {
  data: T[];
  groupBy: (item: T) => string | number | undefined;
  getGroupLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
  menu: MenuItemProps<T>[];
  pagination: PaginationProps;
  onItemClick?: (item: T) => void;
}

export const GroupedListView = <T extends { id: number }>({
  data,
  groupBy,
  getGroupLabel,
  renderContent,
  menu,
  pagination,
  onItemClick,
}: GroupedListViewProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    item: T
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedItem(null);
  };
  const grouped = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const item of data) {
      const key = String(groupBy(item) ?? "undefined");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [data, groupBy]);

  if (!data || data.length === 0) {
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
  }

  return (
    <>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={0} sx={{ width: "100%", borderRadius: 2 }}>
          {grouped.map(([groupKey, items]) => (
            <Box key={groupKey} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                }}
              >
                {getGroupLabel(items[0])}
              </Typography>

              <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {items.map((item) => (
                  <Grid key={item.id} size={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: "action.hover" },
                        cursor: "pointer",
                      }}
                      onClick={() => onItemClick?.(item)}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems={"center"}
                        spacing={1}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpen(e, item.id, item);
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                        <Box flex={1} minWidth={0}>
                          {renderContent(item)}
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menu
            .filter((menuItem) => {
              if (!selectedItem) return false;
              if (typeof menuItem.visible === "function") {
                return menuItem.visible(selectedItem, selectedId!);
              }
              return true;
            })
            .map((item, index) => (
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
        <Box
          position="sticky"
          bottom={0}
          zIndex={10}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="background.paper"
          sx={{ py: 2 }}
        >
          <Pagination
            count={pagination.totalPages}
            page={pagination.page + 1}
            onChange={(_, value) => pagination.onChange(value - 1)}
            size="large"
            color="primary"
            shape="rounded"
            siblingCount={0}
          />
        </Box>
      )}
    </>
  );
};
