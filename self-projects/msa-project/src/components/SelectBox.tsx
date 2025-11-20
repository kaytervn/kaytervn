import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import useApi from "../hooks/useApi";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  FETCH_INTERVAL,
  TEXT,
  TINY_TEXT_MAX_LENGTH,
} from "../services/constant";
import { PAGE_CONFIG } from "../config/PageConfig";
import { Controller } from "react-hook-form";

interface AutocompleteAsyncProps {
  placeholder?: string;
  fetchOptions: any;
  loading: any;
  labelKey: string;
  valueKey: string;
  value: any;
  onChange: any;
  sx?: any;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const AutocompleteAsync = ({
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
}: AutocompleteAsyncProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const debounceRef = useRef<number | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    (async () => {
      const res = await fetchOptions({});
      const data = res?.data?.content || [];
      setOptions(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => setOpen(false);

  const handleInputChange = async (
    _: any,
    newInput: string,
    reason: string
  ) => {
    if (reason !== "input") return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!newInput.trim()) {
      setOptions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      const res = await fetchOptions({ keyword: newInput });
      const data = res?.data?.content || [];
      setOptions(data);
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
      const res = await fetchOptions({ id: value });
      const data = res?.data?.content || [];
      if (data?.length > 0) {
        setSelected(data[0]);
        setOptions((prev) => [...prev, data[0]]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Autocomplete
      sx={sx}
      fullWidth
      open={open}
      value={selected}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      loading={loading}
      loadingText={TEXT.LOADING}
      noOptionsText={TEXT.NO_DATA}
      isOptionEqualToValue={(option, val) =>
        option?.[valueKey] === val?.[valueKey]
      }
      getOptionLabel={(option: any) => option?.[labelKey] || ""}
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
          sx={{
            "& .MuiInputBase-input::placeholder": error
              ? {
                  color: "#d32f2f",
                  opacity: 1,
                }
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
};

export const SelectPlatform = ({ value, onChange }: any) => {
  const { platform, loading } = useApi();
  return (
    <AutocompleteAsync
      placeholder={PAGE_CONFIG.PLATFORM.label}
      fetchOptions={platform.autoComplete}
      loading={loading}
      labelKey={"name"}
      valueKey={"id"}
      value={value}
      onChange={onChange}
      sx={{
        bgcolor: "background.paper",
      }}
    />
  );
};

export const SelectPlatformField = ({ control }: any) => {
  const { platform, loading } = useApi();

  return (
    <Controller
      name="platformId"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteAsync
          placeholder={PAGE_CONFIG.PLATFORM.label}
          fetchOptions={platform.autoComplete}
          loading={loading}
          labelKey={"name"}
          valueKey={"id"}
          required={true}
          value={field.value}
          onChange={field.onChange}
          error={Boolean(error)}
          helperText={error?.message}
        />
      )}
    />
  );
};

export const SelectTagField = ({ control }: any) => {
  const { tag, loading } = useApi();

  return (
    <Controller
      name="tagId"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteAsync
          placeholder={PAGE_CONFIG.TAG.label}
          fetchOptions={tag.autoComplete}
          loading={loading}
          labelKey={"name"}
          valueKey={"id"}
          required={true}
          value={field.value}
          onChange={field.onChange}
          error={Boolean(error)}
          helperText={error?.message}
        />
      )}
    />
  );
};
