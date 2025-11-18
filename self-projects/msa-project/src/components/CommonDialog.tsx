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
  type Resolver,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, type JSX } from "react";
import { useFormGuard } from "../hooks/usePageBlocker";
import { TEXT } from "../services/constant";

export interface FieldConfig {
  name: string;
  label?: string;
  required?: boolean;
  type?: string;
  component?: React.ComponentType<any>;
  render?: (props: { field: any; error?: string; control: any }) => JSX.Element;
}

interface CommonFormDialogProps<T> {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  schema: any;
  defaultValues: Partial<T>;
  onClose: () => void;
  onSubmit: (values: T) => Promise<void> | void;
}

export function CommonFormDialog<T extends Record<string, any>>({
  open,
  title,
  fields,
  schema,
  defaultValues,
  onClose,
  onSubmit,
}: CommonFormDialogProps<T>) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<T>({
    resolver: yupResolver(schema) as unknown as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const handleGuardedClose = useFormGuard(isDirty, onClose);

  useEffect(() => {
    if (open) {
      reset(defaultValues as T);
    }
  }, [defaultValues, open, reset]);

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
            name={f.name as any}
            control={control}
            render={({ field }) => {
              if (f.render) {
                const rendered = f.render({
                  field,
                  error: errors[f.name]?.message as string | undefined,
                  control,
                });
                return rendered;
              }
              if (f.component) {
                const Cmp = f.component;
                return (
                  <Cmp
                    {...field}
                    label={f.label}
                    error={Boolean(errors[f.name])}
                    helperText={(errors[f.name]?.message as string) || ""}
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
                  helperText={(errors[f.name]?.message as string) || ""}
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
          onClick={handleSubmit(handleSave)}
          disabled={!isDirty}
        >
          {TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
