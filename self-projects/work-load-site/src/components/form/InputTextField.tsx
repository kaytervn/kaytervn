import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useState } from "react";

const InputBox = ({ value, placeholder, onChangeText, icon: Icon }: any) => {
  const handleClear = () => {
    onChangeText("");
  };

  return (
    <div className="w-full md:w-[20rem] flex items-center p-3 rounded-md bg-gray-600">
      <input
        className="flex-1 text-base outline-none text-gray-100 placeholder-gray-300 bg-gray-600"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
      />
      {value ? (
        <button
          onClick={handleClear}
          className="p-1 text-gray-300 hover:text-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <XIcon size={16} />
        </button>
      ) : (
        Icon && <Icon size={16} className="text-gray-100" />
      )}
    </div>
  );
};

const InputBox2 = ({ value, placeholder, onChangeText }: any) => {
  const handleClear = () => {
    onChangeText("");
  };

  return (
    <div className="w-full md:w-[15rem] flex items-center p-2 rounded-md bg-gray-600">
      <input
        className="flex-1 text-sm outline-none text-gray-100 placeholder-gray-300 bg-gray-600"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
      />
      {value && (
        <button
          onClick={handleClear}
          className="p-1 text-gray-300 hover:text-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
};

const InputField = ({
  title = "",
  isRequire = false,
  value = "",
  placeholder = "",
  onChangeText,
  icon: Icon,
  error = "",
  prepend,
  type = "text",
  maxLength = 100,
}: any) => {
  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequire && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        className={`flex items-center border rounded-md p-2 flex-1 ${
          error ? "border-red-500 bg-red-900/20" : "border-gray-600 bg-gray-800"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`}
          />
        )}
        {prepend && (
          <div className="ml-2 font-semibold text-gray-300">{prepend}</div>
        )}
        <input
          className={`flex-1 ml-2 text-base outline-none bg-transparent ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : "text-gray-200 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type={type}
          maxLength={maxLength}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const InputFieldWithCheckbox = ({
  title,
  value,
  placeholder,
  onChangeText,
  icon: Icon,
  error,
  prepend,
  type = "text",
  isChecked = false,
  onCheckboxChange,
  maxLength = 100,
}: any) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={onCheckboxChange}
        >
          <div
            className={`w-10 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${
              isChecked ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                isChecked ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span
            className={`text-base font-semibold ${
              isChecked ? "text-gray-200" : "text-gray-400"
            }`}
          >
            {title}
            {isChecked && <span className="ml-1 text-red-500">*</span>}
          </span>
        </button>
      </div>
      {isChecked && (
        <>
          <div className="flex items-center">
            <div
              className={`flex items-center border rounded-md p-2 flex-1 ${
                error
                  ? "border-red-500 bg-red-900/20"
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-5 h-5 ${
                    error ? "text-red-500" : "text-gray-400"
                  }`}
                />
              )}
              {prepend && (
                <div className="ml-2 font-semibold text-gray-300">
                  {prepend}
                </div>
              )}
              <input
                className={`flex-1 ml-2 text-base outline-none bg-transparent ${
                  error
                    ? "text-red-500 placeholder-red-400/50"
                    : "text-gray-200 placeholder-gray-500"
                }`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChangeText(e.target.value)}
                type={type}
                maxLength={maxLength}
                {...(type === "number" && {
                  min: 1,
                  max: 65535,
                })}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1 text-left">{error}</p>
          )}
        </>
      )}
    </div>
  );
};

const InputFieldWithoutTitle = ({
  value = "",
  placeholder = "",
  onChangeText,
  icon: Icon,
  error = "",
  prepend,
  type = "text",
  maxLength = 500,
}: any) => {
  return (
    <div className="flex-1 items-center">
      <div
        className={`flex items-center border rounded-md p-2 flex-1 ${
          error ? "border-red-500 bg-red-900/20" : "border-gray-600 bg-gray-800"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`}
          />
        )}
        {prepend && (
          <div className="ml-2 font-semibold text-gray-300">{prepend}</div>
        )}
        <input
          className={`flex-1 ml-2 text-base outline-none bg-transparent ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : "text-gray-200 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type={type}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

const InputField2 = ({
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
          } ${type === "number" ? "no-arrows" : ""}`}
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

export {
  InputBox,
  InputField,
  InputFieldWithCheckbox,
  InputFieldWithoutTitle,
  InputField2,
  InputBox2,
};
