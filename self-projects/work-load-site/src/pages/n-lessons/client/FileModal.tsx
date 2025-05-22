import { XIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import { getMediaImage, getMimeType } from "../../../types/utils";

const FileModal = ({ file, onClose }: any) => {
  if (!file) return null;
  const fileUrl = getMediaImage(file.url);
  const mimeType = getMimeType(file.name);
  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");
  const isAudio = mimeType.startsWith("audio/");
  let content;

  if (isImage) {
    content = (
      <Zoom>
        <img
          src={fileUrl}
          alt={file.name}
          className="w-full h-[70vh] object-contain rounded-lg"
        />
      </Zoom>
    );
  } else if (isVideo) {
    content = (
      <video
        src={fileUrl}
        controls
        className="w-full max-h-[80vh] rounded-lg"
      />
    );
  } else if (isAudio) {
    content = <audio src={fileUrl} controls className="w-full" />;
  } else {
    content = (
      <iframe
        src={fileUrl}
        className="w-full h-[70vh] rounded-lg"
        title={file.name}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 p-4 rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white truncate max-w-[80%]">
            {file.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <XIcon size={24} />
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 min-w-[70vw] flex justify-center items-center">
          {content}
        </div>
      </div>
    </div>
  );
};

export default FileModal;
