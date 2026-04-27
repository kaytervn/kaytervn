import React, { useEffect, type JSX } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import {
  useForm,
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { useConfirmStore } from "@/shared/stores/useConfirmStore";
import { TEXT, TINY_TEXT_MAX_LENGTH } from "@/shared/constants";

// ─── Types ───────────────────────────────────────────────

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  type?: string;
  component?: React.ComponentType<{
    value: unknown;
    onChange: (value: unknown) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
  }>;
  render?: (props: {
    field: { value: unknown; onChange: (value: unknown) => void };
    error?: string;
    control: Control<T>;
  }) => JSX.Element;
}

interface FormDialogProps<T extends FieldValues> {
  open: boolean;
  title: string;
  fields: FieldConfig<T>[];
  schema: ZodType<T>;
  defaultValues: Partial<T>;
  onClose: () => void;
  onSubmit: (values: T) => Promise<void> | void;
}

// ─── Component ───────────────────────────────────────────

export function FormDialog<T extends FieldValues>({
  open,
  title,
  fields,
  schema,
  defaultValues,
  onClose,
  onSubmit,
}: FormDialogProps<T>) {
  const confirm = useConfirmStore((s) => s.confirm);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  /** Close with unsaved-changes guard */
  const handleGuardedClose = async () => {
    if (!isDirty) {
      onClose();
      return;
    }
    const confirmed = await confirm();
    if (confirmed) onClose();
  };

  useEffect(() => {
    if (open) {
      reset(defaultValues as DefaultValues<T>);
    } else {
      reset(getValues());
    }
  }, [open, defaultValues, reset, getValues]);

  const handleSave = async (data: T) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={handleGuardedClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((f) => (
          <Controller
            key={f.name}
            name={f.name}
            control={control}
            render={({ field }) => {
              const errorMsg = errors[f.name]?.message as string | undefined;

              if (f.render) {
                return f.render({ field, error: errorMsg, control: control as unknown as Control<T> });
              }

              if (f.component) {
                const Cmp = f.component;
                return (
                  <Cmp
                    {...field}
                    label={f.label}
                    error={Boolean(errors[f.name])}
                    helperText={errorMsg || ""}
                  />
                );
              }

              return (
                <TextField
                  {...field}
                  label={f.label}
                  fullWidth
                  margin="normal"
                  required={f.required}
                  type={f.type || "text"}
                  error={Boolean(errors[f.name])}
                  helperText={errorMsg || ""}
                  inputProps={{ maxLength: TINY_TEXT_MAX_LENGTH }}
                />
              );
            }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleGuardedClose}>
          {TEXT.CLOSE}
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={handleSubmit(handleSave as any)}
          disabled={!isDirty}
        >
          {TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
