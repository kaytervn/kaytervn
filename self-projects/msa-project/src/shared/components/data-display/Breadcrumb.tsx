import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  id?: string | number;
  label: string;
  path?: string;
  state?: Record<string, unknown>;
  onClick?: () => void;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = React.memo(
  ({ items }) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent, item: BreadcrumbItem) => {
      if (!item.path) {
        e.preventDefault();
      }
      if (item.onClick) {
        item.onClick();
        return;
      }
      if (item.path) {
        const isExternal = /^https?:\/\//i.test(item.path);
        if (isExternal) {
          window.open(item.path, "_blank", "noopener,noreferrer");
        } else {
          e.preventDefault();
          navigate(item.path, { state: item.state });
        }
      }
    };

    return (
      <Breadcrumbs maxItems={2} aria-label="breadcrumb">
        {items.map((item, idx) => {
          const key = item.id ?? item.path ?? idx;
          if (item.path || item.onClick) {
            return (
              <Link
                key={key}
                component="a"
                href={item.path ?? "#"}
                underline="hover"
                color="inherit"
                onClick={(e) => handleClick(e, item)}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="h6" component="span">
                  {item.label}
                </Typography>
              </Link>
            );
          }

          return (
            <Typography key={key} variant="h6" sx={{ color: "text.primary" }}>
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    );
  },
);

CustomBreadcrumb.displayName = "CustomBreadcrumb";
