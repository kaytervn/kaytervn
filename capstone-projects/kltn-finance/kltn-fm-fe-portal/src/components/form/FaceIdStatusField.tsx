import {
  CheckCircle2Icon,
  XCircleIcon,
  ScanFaceIcon,
  Trash2Icon,
} from "lucide-react";
import { BUTTON_TEXT } from "../../services/constant";

const FaceIdStatusField = ({
  isRegistered = false,
  onRegister = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="flex-1">
      <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
        Trạng thái FaceID
      </label>
      <div
        className={`flex items-center justify-between border rounded-md p-2 ${
          isRegistered
            ? "border-green-600 bg-green-900/10"
            : "border-gray-600 bg-gray-800"
        }`}
      >
        <div className="flex items-center">
          {isRegistered ? (
            <CheckCircle2Icon size={16} className="text-green-400 mr-2" />
          ) : (
            <XCircleIcon size={16} className="text-gray-400 mr-2" />
          )}
          <span
            className={`text-base ${
              isRegistered ? "text-green-400" : "text-gray-400"
            }`}
          >
            {isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
          </span>
        </div>

        <div className="flex space-x-2">
          {!isRegistered && (
            <button
              onClick={onRegister}
              title={BUTTON_TEXT.REGISTER_FACEID}
              className="text-gray-400 hover:text-blue-400 transition duration-200"
            >
              <ScanFaceIcon size={20} />
            </button>
          )}
          {isRegistered && (
            <button
              onClick={onDelete}
              title={BUTTON_TEXT.DELETE_FACEID}
              className="text-gray-400 hover:text-red-400 transition duration-200"
            >
              <Trash2Icon size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceIdStatusField;
