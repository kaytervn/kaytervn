import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { TEXT, FETCH_INTERVAL, TINY_TEXT_MAX_LENGTH, PAGE_CONFIG } from "@/shared/constants";
import { fetchPlatformAutoComplete } from "@/features/platform/services/platform.service";
import { fetchTagAutoComplete } from "@/features/tag/services/tag.service";

// ─── Types ───────────────────────────────────────────────

interface AutocompleteAsyncProps {
  placeholder?: string;
  fetchOptions: (params: { keyword?: string; id?: number }) => Promise<any>;
  loading?: boolean;
  labelKey: string;
  valueKey: string;
  value: any;
  onChange: (value: any) => void;
  sx?: any;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

// ─── Base Async Autocomplete ─────────────────────────────

export const AutocompleteAsync: React.FC<AutocompleteAsyncProps> = ({
  placeholder,
  fetchOptions,
  labelKey,
  valueKey,
  value,
  onChange,
  loading: externalLoading,
  sx,
  error,
  helperText,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const loadOptions = async (keyword?: string) => {
    setLoading(true);
    try {
      const res = await fetchOptions({ keyword });
      const data = res?.data?.content || [];
      setOptions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleInputChange = async (_: any, newInput: string, reason: string) => {
    if (reason !== "input") return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    
    if (!newInput.trim()) {
      setOptions([]);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      loadOptions(newInput);
    }, FETCH_INTERVAL);
  };

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const found = options.find((o) => o[valueKey] === value);
    if (found) {
      setSelected(found);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetchOptions({ id: value });
        const data = res?.data?.content || [];
        if (data?.length > 0) {
          setSelected(data[0]);
          setOptions((prev) => [...prev, data[0]]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [value]);

  const isLoading = loading || externalLoading;

  return (
    <Autocomplete
      sx={sx}
      fullWidth
      open={open}
      value={selected}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={isLoading}
      loadingText={TEXT.LOADING}
      noOptionsText={TEXT.NO_DATA}
      isOptionEqualToValue={(option, val) => option?.[valueKey] === val?.[valueKey]}
      getOptionLabel={(option) => option?.[labelKey] || ""}
      onChange={(_, newValue) => {
        setSelected(newValue);
        onChange(newValue ? newValue[valueKey] : null);
      }}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          required={required}
          helperText={helperText}
          placeholder={placeholder}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
          }}
          inputProps={{
            ...params.inputProps,
            maxLength: TINY_TEXT_MAX_LENGTH,
          }}
        />
      )}
    />
  );
};

// ─── Platform Select ─────────────────────────────────────

export const SelectPlatform: React.FC<{
  value?: number;
  onChange: (value: number | null) => void;
}> = ({ value, onChange }) => (
  <AutocompleteAsync
    placeholder={PAGE_CONFIG.PLATFORM.label}
    fetchOptions={fetchPlatformAutoComplete}
    labelKey="name"
    valueKey="id"
    value={value}
    onChange={onChange}
    sx={{ bgcolor: "background.paper" }}
  />
);

// ─── Form Field Hooks ────────────────────────────────────

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export const SelectPlatformField = <T extends FieldValues>({
  control,
  name,
}: SelectFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <AutocompleteAsync
        placeholder={PAGE_CONFIG.PLATFORM.label}
        fetchOptions={fetchPlatformAutoComplete}
        labelKey="name"
        valueKey="id"
        required
        value={field.value}
        onChange={field.onChange}
        error={Boolean(error)}
        helperText={error?.message}
      />
    )}
  />
);

export const SelectTagField = <T extends FieldValues>({
  control,
  name,
}: SelectFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <AutocompleteAsync
        placeholder={PAGE_CONFIG.TAG.label}
        fetchOptions={fetchTagAutoComplete}
        labelKey="name"
        valueKey="id"
        required
        value={field.value}
        onChange={field.onChange}
        error={Boolean(error)}
        helperText={error?.message}
      />
    )}
  />
);
