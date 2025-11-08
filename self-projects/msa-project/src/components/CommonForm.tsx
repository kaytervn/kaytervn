import { Box, Button, Grid, Paper, Stack, TextField } from "@mui/material";
import { BasicAppBar } from "./BasicAppBar";
import { TEXT } from "../services/constant";
import type { FieldConfig } from "./CommonDialog";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormGuard } from "../hooks/usePageBlocker";
import { useEffect } from "react";

export interface FormFieldConfig extends FieldConfig {
  size?: number;
}

interface FormDialogProps {
  title: string;
  fields: FormFieldConfig[];
  schema: any;
  defaultValues: any;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
}

export const CommonForm = ({
  title,
  fields,
  schema,
  defaultValues,
  onClose,
  onSubmit,
}: FormDialogProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const handleGuardedClose = useFormGuard(isDirty, onClose);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleSave = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <BasicAppBar title={title}>
      <Box display="flex" sx={{ m: 2 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            flex: { xs: 1, sm: 1, md: 0.75, lg: 0.5 },
          }}
        >
          <>
            <Grid
              container
              columnSpacing={1}
              rowSpacing={3}
              columns={{ xs: 4, sm: 6, md: 12 }}
            >
              {fields.map((f: FormFieldConfig) => (
                <Grid key={f.name} size={f.size ?? 6}>
                  <Controller
                    name={f.name as any}
                    control={control}
                    render={({ field }) => {
                      if (f.render) {
                        return f.render({
                          field,
                          error: errors[f.name]?.message as string | undefined,
                          control,
                        });
                      }
                      if (f.component) {
                        const Cmp = f.component;
                        return (
                          <Cmp
                            {...field}
                            label={f.label}
                            error={Boolean(errors[f.name])}
                            helperText={
                              (errors[f.name]?.message as string) || ""
                            }
                          />
                        );
                      }
                      return (
                        <TextField
                          {...field}
                          label={f.label}
                          fullWidth
                          required={f.required}
                          type={f.type || "text"}
                          error={Boolean(errors[f.name])}
                          helperText={(errors[f.name]?.message as string) || ""}
                        />
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Stack spacing={1} direction={"row"} mt={4} justifyContent={"end"}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleGuardedClose}
              >
                {TEXT.CANCEL}
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit(handleSave)}
                disabled={!isDirty}
              >
                {TEXT.SAVE}
              </Button>
            </Stack>
          </>
        </Paper>
      </Box>
    </BasicAppBar>
  );
};
