import {
  CalendarIcon,
  ChevronDownIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";
import DocumentItem from "./DocumentItem";
import { useState } from "react";
import { parseDocuments } from "../../../types/utils";

const PostCard = ({ post, openModal }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const documents = parseDocuments(post.document);
  const description = post.description || "";
  const truncatedDescription =
    description.length > 150 ? description.slice(0, 150) + "..." : description;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 mb-5 transition-all border border-gray-700 hover:border-gray-600">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 text-white">{post.title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
            <TagIcon size={12} className="mr-1" />
            {post.category?.name || "N/A"}
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
            <CalendarIcon size={12} className="mr-1" />
            {post.createdAt}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-300">
            {isExpanded ? <p>{description}</p> : <p>{truncatedDescription}</p>}
          </div>
          {description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
              <ChevronDownIcon
                size={16}
                className={`ml-1 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-200 flex items-center">
          <FileTextIcon size={16} className="mr-2 text-indigo-400" />
          Tài liệu ({documents.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {documents.map((file: any, index: number) => (
            <DocumentItem key={index} file={file} openModal={openModal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
