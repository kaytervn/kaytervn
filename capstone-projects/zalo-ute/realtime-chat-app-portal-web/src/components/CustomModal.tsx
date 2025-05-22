import { XIcon } from "lucide-react";
import { LoadingDialog } from "./Dialog";

// Định nghĩa kiểu cho `color`
type ColorType = "blue" | "red" | "green" | "yellow";

const CustomModal = ({
  onClose,
  title = "Sample",
  topComponent,
  bodyComponent,
  buttonText = "OK",
  onButtonClick,
  loading,
  color = "blue",
}: {
  onClose: () => void;
  title?: string;
  topComponent?: JSX.Element;
  bodyComponent?: JSX.Element;
  buttonText?: string;
  onButtonClick: () => void;
  loading?: boolean;
  color?: ColorType; // Khai báo kiểu rõ ràng cho color
}) => {
  const colorClass: Record<ColorType, string> = {
    blue: "text-blue-500 bg-blue-600 hover:bg-blue-800 focus:ring-blue-500",
    red: "text-red-500 bg-red-600 hover:bg-red-800 focus:ring-red-500",
    green:
      "text-green-500 bg-green-600 hover:bg-green-800 focus:ring-green-500",
    yellow:
      "text-yellow-500 bg-yellow-600 hover:bg-yellow-800 focus:ring-yellow-500",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[40rem] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <XIcon size={30} />
        </button>
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            colorClass[color].split(" ")[0]
          }`}
        >
          {title}
        </h2>
        {topComponent && (
          <div className="flex justify-center mb-6">{topComponent}</div>
        )}
        <div className="max-h-96 overflow-y-auto pr-2">{bodyComponent}</div>
        <div className="mt-6">
          <button
            onClick={onButtonClick}
            className={`text-center text-white font-semibold text-lg w-full px-4 py-2 rounded-md ${colorClass[color]}`}
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
