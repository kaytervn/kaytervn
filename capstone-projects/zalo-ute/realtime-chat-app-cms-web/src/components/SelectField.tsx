const SelectField = ({
  title,
  isRequire = false,
  value,
  onChange,
  icon: Icon,
  options,
  error,
  disabled = false,
  labelKey,
  valueKey,
  renderLabel,
}: any) => {
  return (
    <div className="mb-4">
      <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
        {title}
        {isRequire && <span className="text-red-500">{" *"}</span>}
      </label>
      <div
        className={`flex items-center border rounded-md p-2 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      >
        {Icon && <Icon size={20} color={error ? "#EF4444" : "#6B7280"} />}
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 ml-2 text-base outline-none  ${
            error ? "text-red-500 bg-red-50" : "text-gray-700"
          }`}
        >
          <option value=""></option>
          {options.map((item: any) => (
            <option key={item[valueKey]} value={item[valueKey]}>
              {renderLabel ? renderLabel(item) : item[labelKey]}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

export default SelectField;
