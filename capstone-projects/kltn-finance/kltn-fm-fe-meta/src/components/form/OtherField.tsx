import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatToDDMMYYYY,
  getMediaImage,
  parseToYYYYMMDD,
} from "../../services/utils";
import useApi from "../../hooks/useApi";
import { FILE_TYPES } from "../../services/constant";

const DatePickerField = ({
  title = "",
  isRequired = false,
  value,
  onChange,
  placeholder = "Chọn ngày...",
  error = "",
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const inputValue = value ? parseToYYYYMMDD(value) : "";

  const handleDateChange = (e: any) => {
    const selectedDate = e.target.value;
    const formattedDate = formatToDDMMYYYY(selectedDate);
    onChange(formattedDate);
  };

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
            : isFocused
            ? "border-blue-500 bg-gray-800 ring-2 ring-blue-500/20"
            : "border-gray-600 bg-gray-800 hover:border-gray-500"
        }`}
      >
        <input
          ref={inputRef}
          type="date"
          className={`flex-1 text-base outline-none bg-transparent appearance-none cursor-pointer ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : inputValue
              ? "text-gray-200"
              : "text-transparent"
          }`}
          value={inputValue.split(" ")[0]}
          onChange={handleDateChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={handleInputClick}
          placeholder={error ? undefined : placeholder}
        />
        {!inputValue && !isFocused && (
          <span className="absolute left-2 pointer-events-none text-gray-500">
            {placeholder}
          </span>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const ColorPickerField = ({
  title = "",
  isRequired = false,
  value = "#000000",
  onChange,
  error = "",
}: {
  title?: string;
  isRequired?: boolean;
  value?: string; // Hex color code
  onChange: (color: string) => void;
  error?: string;
}) => {
  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        className={`flex items-center border rounded-md p-2 flex-1 ${
          error ? "border-red-500 bg-red-900/20" : "border-gray-600 bg-gray-800"
        }`}
      >
        <input
          type="color"
          className="flex-1 h-8 bg-transparent border-none outline-none cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const ImageUploadField = ({
  title = "",
  value,
  onChange,
  accept = "image/*",
}: {
  title?: string;
  value?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}) => {
  const { media } = useApi();
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }
    const res = await media.upload({ file, type: FILE_TYPES.AVATAR });
    const filePath = res.data.filePath;
    onChange(filePath);
    if (filePath) {
      setPreview(filePath);
    } else {
      setPreview(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
        </label>
      )}
      <div className="relative w-32 h-32">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="w-full h-full flex items-center justify-center border border-gray-600 rounded-md bg-gray-800 overflow-hidden"
          onClick={handleClick}
        >
          {preview ? (
            <img
              src={getMediaImage(preview)}
              className="w-full h-full object-cover"
            />
          ) : (
            <UploadIcon size={20} className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export { DatePickerField, ColorPickerField, ImageUploadField };
