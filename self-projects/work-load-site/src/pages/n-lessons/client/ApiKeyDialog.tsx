import {
  AlertCircle,
  CheckCircle,
  KeyIcon,
  RefreshCw,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import { setStorageData } from "../../../services/storages";
import { LOCAL_STORAGE } from "../../../types/constant";
import { N_LESSONS_PAGE_CONFIG } from "../../../components/config/PageConfig";

const ApiKeyDialog = ({ isOpen, onClose }: any) => {
  const { setApiKey: setAuthKey } = useGlobalContext();
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!apiKey.trim() || apiKey.trim().length != 128) {
      setError("API key không hợp lệ");
      return;
    }

    setIsValidating(true);
    setError("");

    setTimeout(() => {
      setIsValidating(false);
      setStorageData(LOCAL_STORAGE.N_LESSONS_API_KEY, apiKey);
      setAuthKey(apiKey);
      window.location.href = N_LESSONS_PAGE_CONFIG.LESSON.path;
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <KeyIcon className="mr-2 text-indigo-400" size={20} />
            Xác thực API Key
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nhập API Key của bạn
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Nhập API key..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isValidating}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDialog;
