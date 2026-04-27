import React, { Fragment, useEffect, useRef, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { FETCH_INTERVAL, TINY_TEXT_MAX_LENGTH, TEXT } from "@/shared/constants";
import type { ApiResponse, PaginatedData } from "@/shared/types/api.types";
import type { BaseEntity } from "@/shared/types/common.types";

// ─── Types ───────────────────────────────────────────────

interface AutocompleteOption extends BaseEntity {
  [key: string]: unknown;
}

interface AutocompleteAsyncProps {
  placeholder?: string;
  fetchOptions: (
    params: Record<string, unknown>,
  ) => Promise<ApiResponse<PaginatedData<AutocompleteOption>>>;
  loading: boolean;
  labelKey: string;
  valueKey: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  sx?: Record<string, unknown>;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

// ─── Base Component ──────────────────────────────────────

export const AutocompleteAsync: React.FC<AutocompleteAsyncProps> = React.memo(
  ({
    placeholder,
    fetchOptions,
    labelKey,
    valueKey,
    value,
    onChange,
    loading,
    sx,
    error,
    helperText,
    required,
  }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [selected, setSelected] = useState<AutocompleteOption | null>(null);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
      (async () => {
        const res = await fetchOptions({});
        const data = res?.data?.content ?? [];
        setOptions(data);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        const res = await fetchOptions({ id: value });
        const data = res?.data?.content ?? [];
        if (data.length > 0) {
          setSelected(data[0]);
          setOptions((prev) => [...prev, data[0]]);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleInputChange = async (
      _: React.SyntheticEvent,
      newInput: string,
      reason: string,
    ) => {
      if (reason !== "input") return;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (!newInput.trim()) {
        setOptions([]);
        return;
      }
      debounceRef.current = window.setTimeout(async () => {
        const res = await fetchOptions({ keyword: newInput });
        const data = res?.data?.content ?? [];
        setOptions(data);
      }, FETCH_INTERVAL);
    };

    return (
      <Autocomplete
        sx={sx}
        fullWidth
        open={open}
        value={selected}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        loadingText={TEXT.LOADING}
        noOptionsText={TEXT.NO_DATA}
        isOptionEqualToValue={(option, val) =>
          option?.[valueKey] === val?.[valueKey]
        }
        getOptionLabel={(option: AutocompleteOption) =>
          (option?.[labelKey] as string) || ""
        }
        onChange={(_, newValue) => {
          setSelected(newValue);
          onChange(newValue ? (newValue[valueKey] as number) : null);
        }}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            required={required}
            helperText={helperText}
            placeholder={placeholder}
            sx={{
              "& .MuiInputBase-input::placeholder": error
                ? { color: "#d32f2f", opacity: 1 }
                : {},
            }}
            inputProps={{
              ...params.inputProps,
              maxLength: TINY_TEXT_MAX_LENGTH,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    );
  },
);

AutocompleteAsync.displayName = "AutocompleteAsync";

// ─── Controlled Autocomplete for react-hook-form ─────────

interface ControlledAutocompleteProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  fetchOptions: AutocompleteAsyncProps["fetchOptions"];
  loading: boolean;
  labelKey: string;
  valueKey: string;
}

export const ControlledAutocomplete = <T extends FieldValues>({
  control,
  name,
  placeholder,
  fetchOptions,
  loading,
  labelKey,
  valueKey,
}: ControlledAutocompleteProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <AutocompleteAsync
        placeholder={placeholder}
        fetchOptions={fetchOptions}
        loading={loading}
        labelKey={labelKey}
        valueKey={valueKey}
        required
        value={field.value as number | null}
        onChange={field.onChange}
        error={Boolean(error)}
        helperText={error?.message}
      />
    )}
  />
);
