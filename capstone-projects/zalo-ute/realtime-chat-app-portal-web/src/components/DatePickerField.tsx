import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({
  title,
  isRequire = false,
  value,
  placeholder,
  onChangeDate,
  editable = true,
  maxDate = new Date(),
}: any) => {
  const handleDateChange = (date: any) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      onChangeDate(formattedDate);
    }
  };

  const parsedDate = value ? parse(value, "dd/MM/yyyy", new Date()) : null;

  return (
    <div className="mb-4">
      <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
        {title}
        {isRequire && <span className="text-red-500">{" *"}</span>}
      </label>
      <div className="flex items-center border rounded-md p-2 border-gray-300">
        <CalendarIcon size={20} color={"#6B7280"} />
        <DatePicker
          selected={parsedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          maxDate={maxDate}
          placeholderText={placeholder}
          className="flex-1 ml-2 text-base outline-none bg-transparent text-gray-700"
          disabled={!editable}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
      </div>
    </div>
  );
};

export default DatePickerField;
