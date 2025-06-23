import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import {
  getMediaImage,
  getMimeType,
  truncateString,
} from "../../services/utils";
import { motion } from "framer-motion";

const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType.startsWith("image/"))
    return <ImageIcon size={30} className="text-blue-400" />;
  if (mimeType.startsWith("video/"))
    return <VideoIcon size={30} className="text-purple-400" />;
  if (mimeType.startsWith("audio/"))
    return <MusicIcon size={30} className="text-green-400" />;
  if (mimeType === "application/pdf")
    return <FileTextIcon size={30} className="text-red-400" />;
  return <FileIcon size={30} className="text-gray-400" />;
};

const DocumentItem = ({ file, openModal }: any) => {
  const mimeType = getMimeType(file.name);
  const isImage = mimeType.startsWith("image/");

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => openModal(file)}
      className="flex flex-col items-center bg-gray-700/50 backdrop-blur-sm p-2 rounded-lg hover:bg-gray-600/70 transition-all cursor-pointer group shadow-md border border-gray-600/30"
    >
      <div className="relative w-14 h-14 flex items-center justify-center mb-2 overflow-hidden rounded-md">
        {isImage ? (
          <img
            src={getMediaImage(file.url)}
            alt={file.name}
            className="max-w-full max-h-full object-cover rounded group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-800/70 w-full h-full rounded">
            <FileTypeIcon mimeType={mimeType} />
          </div>
        )}
      </div>
      <span className="text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">
        {truncateString(file.name, 20)}
      </span>
    </motion.div>
  );
};

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
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        src={fileUrl}
        alt={file.name}
        className="w-full h-[70vh] object-contain rounded-lg shadow-xl"
      />
    );
  } else if (isVideo) {
    content = (
      <motion.video
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        src={fileUrl}
        controls
        className="w-full max-h-[80vh] rounded-lg shadow-xl"
      />
    );
  } else if (isAudio) {
    content = (
      <motion.audio
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        src={fileUrl}
        controls
        className="w-full"
      />
    );
  } else {
    content = (
      <motion.iframe
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        src={fileUrl}
        className="w-full h-[70vh] rounded-lg shadow-xl"
        title={file.name}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-gray-900/90 p-6 rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto border border-gray-700/50 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white truncate max-w-[80%] flex items-center">
            <FileTypeIcon mimeType={getMimeType(file.name)} />
            <span className="ml-2">{file.name}</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/70 transition-all"
          >
            <XIcon size={24} />
          </motion.button>
        </div>
        <div className="bg-gray-800/70 rounded-xl p-4 min-w-[70vw] flex justify-center items-center backdrop-blur-sm">
          {content}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { DocumentItem, FileModal, FileTypeIcon };
