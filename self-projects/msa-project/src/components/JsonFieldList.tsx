/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import * as yup from "yup";
import { CommonFormDialog } from "./CommonDialog";
import { DIALOG_TYPE, useDialogManager } from "../hooks/useDialog";
import { DeleteDialog } from "./CustomOverlay";
import { TEXT, TOAST } from "../services/constant";
import { isExists, normalizeVietnamese } from "../services/utils";
import { useToast } from "../config/ToastProvider";

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
  const isUpdate = isExists(data?.index);
  const title = isUpdate
    ? `${TEXT.UPDATE} ${label.toLowerCase()}`
    : `${TEXT.CREATE} ${label.toLowerCase()}`;
  const handleSubmit = async (formData: any) => {
    onClose();
    const payload = isUpdate ? { ...formData, index: data?.index } : formData;
    onSubmitItem(payload);
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
  label = TEXT.SAMPLE_TEXT,
}: JsonListFieldProps) => {
  const { showToast } = useToast();
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
    if (isExists(index)) {
      const item = items[index!];
      open({ index, ...item });
    } else {
      open();
    }
  };

  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      const nameA = normalizeVietnamese(a.name || "");
      const nameB = normalizeVietnamese(b.name || "");
      return nameA.localeCompare(nameB);
    });
  };

  const onSubmitItem = (data: Item) => {
    showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    let newItems: Item[];
    const index = data.index;
    delete data.index;
    if (isExists(index)) {
      newItems = items.map((item, i) => (i === index ? data : item));
    } else {
      newItems = [...items, data];
    }
    setItems(sortItems(newItems));
  };

  const handleDelete = (index: number) => {
    showToast(TEXT.DELETED, TOAST.SUCCESS);
    const newItems = items.filter((_, i) => i !== index);
    setItems(sortItems(newItems));
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
                onDelete={() => handleDelete(formData?.index)}
                title={`${TEXT.DELETE} ${label.toLowerCase()}`}
              />
            )}
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyItems={"center"}
              alignContent={"center"}
            >
              <Link component="button" onClick={() => handleOpen()}>
                {`${TEXT.CREATE} ${label.toLowerCase()}`}
              </Link>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
              {items.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name}${item.note ? ` - ${item.note}` : ""}`}
                  onClick={() => handleOpen(index)}
                  onDelete={() => open({ index }, DIALOG_TYPE.DELETE)}
                  variant="outlined"
                />
              ))}
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
