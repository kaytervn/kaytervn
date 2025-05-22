import { useEffect, useState } from "react";
import { truncateString } from "../../types/utils";

const RadioButtons = ({ options, selectedValue, onValueChange }: any) => {
  const [selectedOption, setSelectedOption] = useState(selectedValue);
  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue, options]);
  const handleOptionChange = (value: any) => {
    setSelectedOption(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };
  return (
    <div className="mb-2">
      {options.map((option: any, index: any) => (
        <label
          key={index}
          className="flex items-center mb-2 whitespace-nowrap text-gray-200 text-md"
        >
          <input
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleOptionChange(option.value)}
            className="hidden peer"
          />
          <span className="mr-2 h-4 w-4 border-2 border-gray-500 rounded-full flex items-center justify-center peer-checked:border-blue-400 peer-checked:bg-blue-400">
            {selectedOption === option.value && (
              <span className="h-2 w-2 bg-blue-50 rounded-full"></span>
            )}
          </span>
          {truncateString(option.label, 100)}
        </label>
      ))}
      {options.length < 2 && <div className="my-10"></div>}
    </div>
  );
};

export default RadioButtons;
