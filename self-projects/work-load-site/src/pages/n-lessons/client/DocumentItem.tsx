import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
} from "lucide-react";
import { getMediaImage, getMimeType } from "../../../types/utils";

const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType.startsWith("image/"))
    return <ImageIcon size={36} className="text-blue-400" />;
  if (mimeType.startsWith("video/"))
    return <VideoIcon size={36} className="text-purple-400" />;
  if (mimeType.startsWith("audio/"))
    return <MusicIcon size={36} className="text-green-400" />;
  if (mimeType === "application/pdf")
    return <FileTextIcon size={36} className="text-red-400" />;
  return <FileIcon size={36} className="text-gray-400" />;
};

const DocumentItem = ({ file, openModal }: any) => {
  const mimeType = getMimeType(file.name);
  const isImage = mimeType.startsWith("image/");

  return (
    <div
      onClick={() => openModal(file)}
      className="flex flex-col items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer group"
    >
      <div className="relative w-12 h-12 flex items-center justify-center mb-1">
        {isImage ? (
          <img
            src={getMediaImage(file.url)}
            alt={file.name}
            className="max-w-full max-h-full object-cover rounded group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-800 w-full h-full rounded">
            <FileTypeIcon mimeType={mimeType} />
          </div>
        )}
      </div>
      <span className="text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">
        {file.name}
      </span>
    </div>
  );
};

export default DocumentItem;
