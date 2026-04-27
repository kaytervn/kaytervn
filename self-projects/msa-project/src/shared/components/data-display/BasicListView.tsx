import React, { useState, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import type { BaseEntity } from "@/shared/types/common.types";
import { NoDataView } from "@/shared/components/feedback/StateViews";
import { StickyPagination } from "./StickyPagination";

// ─── Types ───────────────────────────────────────────────

export interface ListMenuItem<T> {
  label: string;
  onClick: (id: number | null) => void;
  visible?: (item: T, selectedId: number) => boolean;
}

export interface ListPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface BasicListViewProps<T extends BaseEntity> {
  data: T[];
  renderContent: (item: T) => React.ReactNode;
  menu: ListMenuItem<T>[];
  pagination: ListPaginationProps;
  onItemClick?: (item: T) => void;
}

// ─── Memoized List Item ──────────────────────────────────

interface ListItemCardProps<T extends BaseEntity> {
  item: T;
  renderContent: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  onMenuOpen: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    item: T,
  ) => void;
}

const ListItemCardInner = <T extends BaseEntity>({
  item,
  renderContent,
  onItemClick,
  onMenuOpen,
}: ListItemCardProps<T>) => (
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
              onMenuOpen(e, item.id, item);
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
);

/**
 * Memoized list item card.
 * Only re-renders when its own item reference changes.
 */
const ListItemCard = React.memo(ListItemCardInner) as typeof ListItemCardInner;

// ─── Main Component ──────────────────────────────────────

export const BasicListView = <T extends BaseEntity>({
  data,
  renderContent,
  menu,
  pagination,
  onItemClick,
}: BasicListViewProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, id: number, item: T) => {
      setAnchorEl(event.currentTarget);
      setSelectedId(id);
      setSelectedItem(item);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedItem(null);
  }, []);

  return (
    <>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={0} sx={{ width: "100%", borderRadius: 2 }}>
          {!data || data.length === 0 ? (
            <NoDataView />
          ) : (
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
              {data.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  renderContent={renderContent}
                  onItemClick={onItemClick}
                  onMenuOpen={handleOpen}
                />
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

      <StickyPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onChange={pagination.onChange}
      />
    </>
  );
};

export interface GroupedListViewProps<T extends BaseEntity> {
  data: T[];
  groupBy: (item: T) => string | number | undefined;
  getGroupLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
  menu: ListMenuItem<T>[];
  pagination: ListPaginationProps;
  onItemClick?: (item: T) => void;
}

export const GroupedListView = <T extends BaseEntity>({
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

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, id: number, item: T) => {
      setAnchorEl(event.currentTarget);
      setSelectedId(id);
      setSelectedItem(item);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedItem(null);
  }, []);

  const grouped = React.useMemo(() => {
    const map = new Map<string, T[]>();
    for (const item of data) {
      const key = String(groupBy(item) ?? "undefined");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [data, groupBy]);

  return (
    <>
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={0} sx={{ width: "100%", borderRadius: 2 }}>
          {!data || data.length === 0 ? (
            <NoDataView />
          ) : (
            <Stack spacing={4}>
              {grouped.map(([key, groupData]) => (
                <Box key={key}>
                  <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
                    {getGroupLabel(groupData[0])}
                  </Typography>
                  <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {groupData.map((item) => (
                      <ListItemCard
                        key={item.id}
                        item={item}
                        renderContent={renderContent}
                        onItemClick={onItemClick}
                        onMenuOpen={handleOpen}
                      />
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
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

      <StickyPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onChange={pagination.onChange}
      />
    </>
  );
};
