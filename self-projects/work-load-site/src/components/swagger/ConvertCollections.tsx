import CopyToClipboard from "react-copy-to-clipboard";
import CustomModal from "../form/CustomModal";
import { toast } from "react-toastify";
import { CheckCircleIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

const ConvertCollection = ({
  isVisible,
  setVisible,
  json,
  onButtonClick,
}: any) => {
  if (!isVisible) return null;
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    toast.success("Content copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  const handleButtonClick = () => {
    navigator.clipboard.writeText(json).then(() => {
      toast.success("Content copied to clipboard");
      onButtonClick();
    });
  };
  return (
    <CustomModal
      color="blue"
      onClose={() => setVisible(false)}
      title="Gorgeous Swagger Converter"
      bodyComponent={
        <div className="relative font-mono text-sm text-gray-200">
          <div className="absolute top-2 right-2">
            <CopyToClipboard text={json} onCopy={handleCopy}>
              <button
                className={`flex items-center px-3 py-1 rounded transition-all duration-200 ease-in-out ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-gray-200 hover:bg-blue-500"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircleIcon size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </CopyToClipboard>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg break-words text-gray-200">
            {json}
          </div>
        </div>
      }
      buttonText="COPY"
      onButtonClick={handleButtonClick}
    />
  );
};

export default ConvertCollection;
