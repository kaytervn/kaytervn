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

export default Checkbox;
