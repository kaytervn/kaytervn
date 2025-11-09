/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete, Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Item {
  name: string;
  note: string;
}

interface JsonListFieldProps {
  control: any;
  name: string;
  label?: string;
}

// Schema cho từng item
const itemSchema = yup.object().shape({
  name: yup.string().required("Tên không được để trống"),
  note: yup.string(),
});

export const JsonListField = ({
  control,
  name,
  label = "Danh sách",
}: JsonListFieldProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    handleSubmit,
    register,
    reset: resetDialog,
    setValue,
    formState: { errors: dialogErrors },
  } = useForm<Item>({
    resolver: yupResolver(itemSchema),
    defaultValues: { name: "", note: "" },
  });

  // Parse JSON string từ form → items
  const parseItems = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Sort items theo name tăng dần
  const sortItems = (arr: Item[]) => {
    return [...arr].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Mở dialog (thêm hoặc sửa)
  const handleOpen = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      const item = items[index];
      setValue("name", item.name);
      setValue("note", item.note);
    } else {
      setEditingIndex(null);
      resetDialog({ name: "", note: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIndex(null);
  };

  // Lưu item
  const onSubmitItem = (data: Item) => {
    let newItems: Item[];
    if (editingIndex !== null) {
      newItems = items.map((item, i) => (i === editingIndex ? data : item));
    } else {
      newItems = [...items, data];
    }
    setItems(sortItems(newItems));
    handleClose();
  };

  // Xóa item
  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(sortItems(newItems));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Đồng bộ items khi field.value thay đổi (từ reset, defaultValues,...)
        useEffect(() => {
          const parsed = parseItems(field.value);
          setItems(sortItems(parsed));
        }, [field.value]);

        // Cập nhật field.value khi items thay đổi
        useEffect(() => {
          field.onChange(JSON.stringify(items));
        }, [items, field]);

        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {label}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
              {items.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name}${item.note ? ` - ${item.note}` : ""}`}
                  onClick={() => handleOpen(index)}
                  onDelete={() => handleDelete(index)}
                  deleteIcon={<Delete />}
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: "pointer" }}
                />
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => handleOpen()}
                size="small"
                variant="outlined"
              >
                Thêm
              </Button>
            </Stack>

            {error && (
              <Typography color="error" variant="caption">
                {error.message}
              </Typography>
            )}

            {/* Dialog CRUD */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle>
                {editingIndex !== null ? "Sửa mục" : "Thêm mục mới"}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{ position: "absolute", right: 8, top: 8 }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <form onSubmit={handleSubmit(onSubmitItem)}>
                <DialogContent>
                  <Stack spacing={2} mt={1}>
                    <TextField
                      label="Tên"
                      fullWidth
                      required
                      error={!!dialogErrors.name}
                      helperText={dialogErrors.name?.message}
                      {...register("name")}
                    />
                    <TextField
                      label="Ghi chú"
                      fullWidth
                      multiline
                      rows={2}
                      {...register("note")}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button type="submit" variant="contained">
                    {editingIndex !== null ? "Cập nhật" : "Thêm"}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        );
      }}
    />
  );
};
