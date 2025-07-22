const Checkbox = ({ onCheckboxChange, isChecked, title = "SAMPLE" }: any) => {
  return (
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
      </span>
    </button>
  );
};

export const CheckboxField = ({
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

export default Checkbox;
