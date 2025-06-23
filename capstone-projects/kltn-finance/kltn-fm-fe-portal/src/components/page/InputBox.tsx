import { XIcon } from "lucide-react";

const InputBox = ({ value, placeholder, onChangeText }: any) => {
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

export default InputBox;
