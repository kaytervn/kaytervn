/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";

const TextareaField = ({
  title,
  isRequire = false,
  value,
  placeholder,
  onChangeText,
  error,
  minRows = 3,
  maxHeight = 200,
  errorClass = "text-red-400 bg-red-900/20 border-red-400",
}: any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: any) => {
    onChangeText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [value]);

  return (
    <div className="flex-1 items-center mb-4">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequire && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        className={`flex items-start border rounded-md p-2 flex-1 ${
          error ? errorClass : "border-gray-600 bg-gray-800"
        }`}
      >
        <textarea
          ref={textareaRef}
          className={`flex-1 ml-2 text-base outline-none bg-transparent resize-none ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : "text-gray-200 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          rows={minRows}
          style={{
            overflowY: "auto",
            maxHeight: `${maxHeight}px`,
          }}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const TextAreaWithCheckbox = ({
  title,
  value,
  onChangeText,
  placeholder,
  error,
  isChecked = false,
  onCheckboxChange,
  maxLength,
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
              isChecked ? "bg-blue-600" : "bg-gray-300"
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
              isChecked ? "text-gray-800" : "text-gray-400"
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
                error ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <textarea
                className={`flex-1 ml-2 text-base outline-none resize-none ${
                  error ? "text-red-500 bg-red-50" : "text-gray-700"
                }`}
                placeholder={placeholder}
                value={value}
                maxLength={maxLength}
                onChange={(e) => onChangeText(e.target.value)}
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

const TextAreaField2 = ({
  title = "",
  isRequired = false,
  value = "",
  placeholder = "",
  onChangeText,
  error = "",
  maxLength = 1000,
  disabled = false,
  height = "100",
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
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <textarea
          style={{ minHeight: `${height}px` }}
          className={`flex-1 text-base outline-none bg-transparent resize-y ${
            error
              ? "text-red-400 placeholder-red-400/50"
              : "text-gray-200 placeholder-gray-500"
          } ${disabled ? "cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          maxLength={maxLength}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

export { TextareaField, TextAreaWithCheckbox, TextAreaField2 };
