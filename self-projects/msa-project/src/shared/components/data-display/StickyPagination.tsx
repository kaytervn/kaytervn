import React from "react";
import { Box, Pagination } from "@mui/material";

interface StickyPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const StickyPagination: React.FC<StickyPaginationProps> = React.memo(
  ({ page, totalPages, onChange }) => {
    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      onChange(value - 1);
    };

    if (totalPages <= 1) return null;

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
            count={totalPages}
            page={page + 1}
            onChange={handleChange}
            size="large"
            color="primary"
            shape="rounded"
            siblingCount={0}
          />
        </Box>
      </Box>
    );
  },
);

StickyPagination.displayName = "StickyPagination";
