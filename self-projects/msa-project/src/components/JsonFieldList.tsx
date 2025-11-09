/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import * as yup from "yup";
import { CommonFormDialog } from "./CommonDialog";
import { DIALOG_TYPE, useDialogManager } from "../hooks/useDialog";
import { DeleteDialog } from "./CustomOverlay";
import { TEXT } from "../services/constant";

interface Item {
  index?: number;
  name: string;
  note: string;
}

interface JsonListFieldProps {
  control: any;
  name: string;
  label?: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Tên không hợp lệ"),
});

export const JsonListForm = ({
  open,
  data,
  onClose,
  onSubmitItem,
  label,
}: {
  open: boolean;
  data?: any;
  onClose: () => void;
  onSubmitItem: (data: any) => void;
  label: string;
}) => {
  const isUpdate = Boolean(data?.index);
  const title = isUpdate
    ? `${TEXT.UPDATE} ${label.toLowerCase()}`
    : `${TEXT.CREATE} ${label.toLowerCase()}`;
  const handleSubmit = async (formData: any) => {
    const payload = isUpdate ? { ...formData, index: data?.index } : formData;
    onSubmitItem(payload);
    onClose();
  };
  return (
    <CommonFormDialog
      open={open}
      title={title}
      schema={schema}
      defaultValues={{ name: data?.name ?? "", note: data?.note ?? "" }}
      fields={[
        { name: "name", label: "Tiêu đề", required: true },
        { name: "note", label: "Ghi chú" },
      ]}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};

export const CommonJsonListField = ({
  control,
  name,
  label = "Danh sách",
}: JsonListFieldProps) => {
  const { visible, type, data: formData, open, close } = useDialogManager();
  const [items, setItems] = useState<Item[]>([]);

  const parseItems = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleOpen = (index?: number) => {
    if (index !== undefined) {
      const item = items[index];
      open({ index, ...item });
    } else {
      open();
    }
  };

  const onSubmitItem = (data: Item) => {
    let newItems: Item[];
    const index = data.index;
    if (index) {
      delete data.index;
      newItems = items.map((item, i) => (i === index ? data : item));
    } else {
      newItems = [...items, data];
    }
    setItems(newItems);
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          const parsed = parseItems(field.value);
          setItems(parsed);
        }, [field.value]);

        useEffect(() => {
          field.onChange(JSON.stringify(items));
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [items, field]);

        return (
          <Box>
            {type === DIALOG_TYPE.FORM && (
              <JsonListForm
                open={visible}
                data={formData}
                onClose={close}
                label={label}
                onSubmitItem={onSubmitItem}
              />
            )}
            {type === DIALOG_TYPE.DELETE && (
              <DeleteDialog
                open={visible}
                onClose={close}
                onDelete={() => handleDelete(formData?.id)}
                title={`${TEXT.DELETE} ${label.toLowerCase()}`}
              />
            )}
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyItems={"center"}
              alignContent={"center"}
            >
              <Typography>{`${label}:`}</Typography>
              {/* <IconButton color="primary" size="medium" onClick={handleOpen}>
                <Add />
              </IconButton> */}
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
              {items.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name}${item.note ? ` - ${item.note}` : ""}`}
                  onClick={() => handleOpen(index)}
                  onDelete={() => handleDelete(index)}
                  deleteIcon={<Delete />}
                  variant="outlined"
                  sx={{ cursor: "pointer" }}
                />
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => handleOpen()}
                size="large"
                variant="outlined"
              ></Button>
            </Stack>
            {error && (
              <Typography color="error" variant="caption">
                {error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};
