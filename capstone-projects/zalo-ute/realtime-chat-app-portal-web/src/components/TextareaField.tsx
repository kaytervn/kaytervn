import { useRef, useEffect } from "react";

const TextareaField = ({
  title,
  isRequire = false,
  value,
  placeholder,
  onChangeText,
  onPress,
  children,
  error,
  maxLength = 500,
  editable = true,
  minRows = 3,
  maxHeight = 200,
  errorClass = "text-red-500 bg-red-50 border-red-500",
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
    <div className="mb-4">
      <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
        {title}
        {isRequire && <span className="text-red-500">{" *"}</span>}
      </label>
      <div
        onClick={onPress}
        className={`flex items-start border rounded-md p-2 ${
          error ? errorClass : "border-gray-300"
        }`}
      >
        <textarea
          ref={textareaRef}
          className={`flex-1 ml-2 text-base outline-none resize-none ${
            error ? errorClass : "text-gray-700"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          maxLength={maxLength}
          disabled={!editable || !!onPress}
          rows={minRows}
          style={{
            overflowY: "auto",
            maxHeight: `${maxHeight}px`,
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
      {children}
    </div>
  );
};

export default TextareaField;
