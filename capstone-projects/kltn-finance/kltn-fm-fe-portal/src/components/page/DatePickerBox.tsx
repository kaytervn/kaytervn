import { useRef } from "react";
import { parseToYYYYMMDD, formatToDDMMYYYY } from "../../services/utils";

const DatePickerBox = ({
  value,
  onChange,
  placeholder = "Chọn ngày...",
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValue = value ? parseToYYYYMMDD(value).split(" ")[0] : "";

  return (
    <div className="w-full md:w-[10rem] flex items-center p-2 rounded-md bg-gray-600 relative">
      {!inputValue && (
        <span className="absolute left-3 text-sm text-gray-300 pointer-events-none">
          {placeholder}
        </span>
      )}

      <input
        ref={inputRef}
        type="date"
        className={`flex-1 text-sm outline-none bg-gray-600 appearance-none cursor-pointer ${
          inputValue ? "text-gray-100" : "text-transparent"
        }`}
        value={inputValue}
        onChange={(e) => onChange(formatToDDMMYYYY(e.target.value))}
        onFocus={() => inputRef.current?.showPicker()}
      />
    </div>
  );
};

export default DatePickerBox;
