/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useCallback, useMemo } from "react";
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

const lowerCaseFirstLetter = (str: any) => {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

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
  const lowerLabel = lowerCaseFirstLetter(label);
  const isUpdate = isExists(data?.index);
  const title = isUpdate
    ? `${TEXT.UPDATE} ${lowerLabel}`
    : `${TEXT.CREATE} ${lowerLabel}`;
  const handleSubmit = async (formData: any) => {
    onClose();
    const payload = isUpdate ? { ...formData, index: data?.index } : formData;
    onSubmitItem(payload);
  };

  const defaultValues = useMemo(
    () => ({ name: data?.name ?? "", note: data?.note ?? "" }),
    [data?.name, data?.note]
  );

  return (
    <CommonFormDialog
      open={open}
      title={title}
      schema={schema}
      defaultValues={defaultValues}
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

  const parseItems = (json: string) => {
    try {
      const p = JSON.parse(json || "[]");
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  };

  const syncFromField = useCallback(
    (value: string) => setItems(parseItems(value)),
    [] // không phụ thuộc
  );

  const pushToField = useCallback(
    (onChange: (v: string) => void) => onChange(JSON.stringify(items)),
    [items]
  );

  const sortItems = (arr: Item[]) =>
    [...arr].sort((a, b) =>
      normalizeVietnamese(a.name ?? "").localeCompare(
        normalizeVietnamese(b.name ?? "")
      )
    );

  const handleOpen = (index?: number) => {
    if (isExists(index)) open({ index, ...items[index!] });
    else open();
  };

  const onSubmitItem = (data: Item) => {
    showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    const idx = data.index;
    delete (data as any).index;

    const newItems = isExists(idx)
      ? items.map((it, i) => (i === idx ? data : it))
      : [...items, data];

    setItems(sortItems(newItems));
  };

  const handleDelete = (idx: number) => {
    showToast(TEXT.DELETED, TOAST.SUCCESS);
    setItems(sortItems(items.filter((_, i) => i !== idx)));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          syncFromField(field.value ?? "[]");
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [field.value, syncFromField]);

        useEffect(() => {
          pushToField(field.onChange);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [pushToField]);

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
                title={`${TEXT.DELETE} ${lowerCaseFirstLetter(label)}`}
              />
            )}

            <Stack direction="row" alignItems="center">
              <Link component="button" onClick={() => handleOpen()}>
                {label}
              </Link>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
              {items.map((it, i) => (
                <Chip
                  key={i}
                  label={`${it.name}${it.note ? ` - ${it.note}` : ""}`}
                  onClick={() => handleOpen(i)}
                  onDelete={() => open({ index: i }, DIALOG_TYPE.DELETE)}
                  variant="outlined"
                  sx={{
                    maxWidth: 300,
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
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
