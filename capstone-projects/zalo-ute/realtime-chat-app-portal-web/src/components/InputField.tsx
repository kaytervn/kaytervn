import { EyeIcon, EyeOffIcon } from "lucide-react";

const InputField = ({
  title,
  isRequire = false,
  value,
  placeholder,
  onChangeText,
  onPress,
  secureTextEntry = false,
  icon: Icon,
  showPassword,
  togglePassword,
  children,
  error,
  maxLength = 100,
  editable = true,
  multiline = false,
}: any) => {
  return (
    <div className="mb-4">
      <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
        {title}
        {isRequire && <span className="text-red-500">{" *"}</span>}
      </label>
      <div
        onClick={onPress}
        className={`flex items-center border rounded-md p-2 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      >
        {Icon && <Icon size={20} color={error ? "#EF4444" : "#6B7280"} />}
        <input
          className={`flex-1 ml-2 text-base outline-none  ${
            error ? "text-red-500 bg-red-50" : "text-gray-700"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type={secureTextEntry && !showPassword ? "password" : "text"}
          maxLength={maxLength}
          disabled={!editable || !!onPress}
          multiple={multiline}
        />
        {togglePassword && (
          <button onClick={togglePassword} className="ml-2">
            {showPassword ? (
              <EyeIcon size={20} color={error ? "#EF4444" : "#6B7280"} />
            ) : (
              <EyeOffIcon size={20} color={error ? "#EF4444" : "#6B7280"} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
      {children}
    </div>
  );
};

export default InputField;
