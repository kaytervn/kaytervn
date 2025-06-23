import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const InputField = ({
  title = "",
  isRequired = false,
  value = "",
  placeholder = "",
  onChangeText,
  error = "",
  type = "text",
  maxLength = 100,
  disabled = false,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        className={`flex items-center border rounded-md p-2 flex-1 relative ${
          error
            ? "border-red-500 bg-red-900/20"
            : disabled
            ? "border-gray-700 bg-gray-700/50"
            : "border-gray-600 bg-gray-800"
        }`}
      >
        <input
          disabled={disabled}
          className={`flex-1 text-base outline-none bg-transparent pr-10 ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : disabled
              ? "text-gray-400 placeholder-gray-500/50 cursor-not-allowed opacity-70"
              : "text-gray-200 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type={inputType}
          maxLength={maxLength}
          step={type === "number" ? "1" : undefined}
          min={type === "number" ? "0" : undefined}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const TextAreaField = ({
  title = "",
  isRequired = false,
  value = "",
  placeholder = "",
  onChangeText,
  error = "",
  maxLength = 1000,
}: any) => {
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
        <textarea
          className={`flex-1 text-base outline-none bg-transparent resize-y min-h-[100px] ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : "text-gray-200 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          maxLength={maxLength}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const ToggleField = ({
  title = "",
  isRequired = false,
  checked = false,
  onChange,
  error = "",
  disabled = false,
}: any) => {
  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-10 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 ${
            error
              ? "border border-red-500"
              : disabled
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        ></div>
      </label>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const CheckboxField = ({
  title = "",
  subTitle = "",
  isRequired = false,
  checked = false,
  onChange,
  error = "",
  disabled = false,
}: any) => {
  return (
    <div className="flex-1 items-center">
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div
            className={`w-8 h-4 bg-gray-600 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-1.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500 ${
              error
                ? "border border-red-500"
                : disabled
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          ></div>
          <div className="ml-2 flex flex-row items-center space-x-1">
            {title && (
              <span className="text-gray-200 flex items-center">
                {title}
                {isRequired && <span className="ml-1 text-red-400">*</span>}
              </span>
            )}
            {subTitle && (
              <span
                className={`text-xs ${
                  disabled ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {subTitle}
              </span>
            )}
          </div>
        </label>

        {error && <p className="text-red-400 text-sm ml-2">{error}</p>}
      </div>
    </div>
  );
};

const RadioField = ({
  title = "",
  isRequired = false,
  value = "",
  options,
  onChange,
  error = "",
}: any) => {
  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option: any) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={`h-5 w-5 rounded-full border ${
                error ? "border-red-500" : "border-gray-600"
              } text-blue-500 focus:ring-blue-500 bg-gray-800`}
            />
            <span className="ml-2 text-gray-200">{option.label}</span>
          </label>
        ))}
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export { InputField, TextAreaField, CheckboxField, RadioField, ToggleField };
