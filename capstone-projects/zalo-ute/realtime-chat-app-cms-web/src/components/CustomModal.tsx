import { XIcon } from "lucide-react";
import { LoadingDialog } from "./Dialog";

const CustomModal = ({
  onClose,
  title = "Sample",
  topComponent,
  bodyComponent,
  buttonText = "OK",
  onButtonClick,
  loading,
  color = "blue",
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`
          bg-white 
          rounded-lg 
          shadow-xl 
          p-4 m-4
          md:p-6 
          relative 
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-hidden
          flex 
          flex-col
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XIcon size={24} className="md:w-8 md:h-8" />
        </button>
        <h2
          className={`
          text-xl 
          md:text-2xl 
          font-bold 
          mb-4 
          md:mb-6 
          text-center 
          text-${color}-500
          pt-2
          px-8
        `}
        >
          {title}
        </h2>
        {topComponent && (
          <div className="flex justify-center mb-4 md:mb-6">{topComponent}</div>
        )}
        <div className="flex-grow overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-4">{bodyComponent}</div>
        </div>
        <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onButtonClick}
            className={`
              text-center 
              text-white 
              font-semibold 
              text-base
              md:text-lg 
              w-full 
              px-4 
              py-2 
              md:py-3
              bg-${color}-600 
              rounded-md 
              hover:bg-${color}-700
              active:bg-${color}-800
              transition-colors
              focus:ring-2 
              focus:ring-${color}-500 
              focus:ring-offset-2
              disabled:opacity-50
              disabled:cursor-not-allowed
            `}
          >
            {buttonText}
          </button>
        </div>
      </div>
      <LoadingDialog isVisible={loading} />
    </div>
  );
};

export default CustomModal;
