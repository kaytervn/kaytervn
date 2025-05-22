import { useState } from "react";

const SearchField = ({
  title,
  isRequire = false,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
}: any) => {
  const [inputValue, setInputValue] = useState("");
  const [customOptions, setCustomOptions] = useState(options);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleAddOption = () => {
    if (inputValue && !customOptions.includes(inputValue)) {
      setCustomOptions([...customOptions, inputValue]);
      onChange(inputValue);
    }
  };

  const handleSelectChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="text-base font-semibold text-gray-300 mb-2 block text-left">
        {title}
        {isRequire && <span className="text-red-500">{" *"}</span>}
      </label>
      <div
        className={`flex flex-col border rounded-md p-2 ${
          error ? "border-red-500 bg-red-900/20" : "border-gray-600 bg-gray-800"
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddOption();
          }}
          disabled={disabled}
          placeholder="Type to add or select an option..."
          className={`flex-1 mb-2 p-2 rounded-md text-base outline-none bg-gray-700 ${
            error ? "text-red-500 bg-red-900/20" : "text-gray-200"
          }`}
        />
        <select
          disabled={disabled}
          value={value}
          onChange={handleSelectChange}
          style={{
            color: "lightblue",
            fontWeight: "bold",
            backgroundColor: "#1f2937",
          }}
          className={`rounded-md flex-1 p-1 text-base outline-none bg-gray-900 ${
            error ? "text-red-500 bg-red-900/20" : "text-gray-200"
          }`}
        >
          {customOptions.map((option: any, index: any) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

export default SearchField;
