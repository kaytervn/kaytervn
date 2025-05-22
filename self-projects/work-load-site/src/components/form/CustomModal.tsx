import { XIcon } from "lucide-react";

const CustomModal = ({
  onClose,
  title = "Sample",
  topComponent,
  bodyComponent,
  buttonText = "OK",
  onButtonClick,
  color = "blue",
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl p-4 m-4 md:p-6 relative w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl md:text-2xl font-bold text-center text-${color}-400`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-200 text-2xl hover:bg-gray-800 rounded-full"
          >
            <XIcon size={30} />
          </button>
        </div>
        {topComponent && (
          <div className="flex justify-center mb-4 md:mb-6">{topComponent}</div>
        )}
        <div className="flex-grow overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          <div className="space-y-4">{bodyComponent}</div>
        </div>
        <div className="mt-4 md:mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={onButtonClick}
            className={`text-center text-gray-200 font-semibold text-base md:text-lg w-full px-4 py-2 md:py-3 bg-${color}-700 rounded-md hover:bg-${color}-800 active:bg-${color}-900 transition-colors focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
