import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { parse, format, isValid } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { XIcon } from "lucide-react";
import {
  DATE_FORMAT,
  DAY_MONTH_FORMAT,
  SCHEDULE_KIND_MAP,
} from "../../types/constant";

export const CustomDatePickerField = ({
  title = "",
  isRequired = false,
  value,
  onChange,
  placeholder = "Select date",
  error = "",
  disabled = false,
  kind,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const datePickerRef = useRef<any>(null);

  const getDateFormat = () => {
    return kind === SCHEDULE_KIND_MAP.DAY_MONTH.value
      ? DAY_MONTH_FORMAT
      : DATE_FORMAT;
  };

  const parseInputValue = (input: string): Date | null => {
    if (!input) return null;
    try {
      const formatToUse = getDateFormat();
      const referenceDate = new Date();
      const parsedDate = parse(
        input,
        formatToUse,
        kind === SCHEDULE_KIND_MAP.DAY_MONTH.value
          ? new Date(referenceDate.getFullYear(), 0, 1)
          : referenceDate
      );
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  const formatOutputValue = (date: Date): string => {
    return format(date, getDateFormat());
  };

  const handleDateChange = (date: Date | null) => {
    if (disabled) return;
    if (date && isValid(date)) {
      const formattedDate = formatOutputValue(date);
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsedDate = parseInputValue(value);
    if (parsedDate && isValid(parsedDate)) {
      const formattedDate = formatOutputValue(parsedDate);
      onChange(formattedDate);
    } else if (value) {
      onChange("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const selectedDate = parseInputValue(value);

  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        className={`flex items-center border rounded-md p-2 flex-1 relative transition-all duration-200 ${
          error
            ? "border-red-500 bg-red-900/20"
            : disabled
            ? "border-gray-700 bg-gray-700/50 cursor-not-allowed"
            : isFocused
            ? "border-blue-500 bg-gray-800 ring-2 ring-blue-500/20"
            : "border-gray-600 bg-gray-800 hover:border-gray-500"
        }`}
      >
        <DatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={handleBlur}
          dateFormat={getDateFormat()}
          placeholderText={error ? undefined : placeholder}
          disabled={disabled}
          customInput={
            <input
              className={`flex-1 text-base outline-none bg-transparent appearance-none pr-6 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                error
                  ? "text-red-400 placeholder-red-400/50"
                  : value
                  ? "text-gray-200"
                  : "text-gray-500"
              }`}
              value={value}
              onChange={handleInputChange}
            />
          }
        />
        {value && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-2 p-1 text-gray-300 hover:text-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
          >
            <XIcon size={12} />
          </button>
        )}
        {!value && !isFocused && (
          <span
            className={`absolute left-2 pointer-events-none ${
              disabled ? "text-gray-500/50" : "text-gray-500"
            }`}
          >
            {placeholder}
          </span>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};
