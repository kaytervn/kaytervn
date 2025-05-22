import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <RefreshCwIcon size={48} className="text-indigo-500 animate-spin mb-4" />
      <h3 className="text-xl font-medium text-gray-300">Đang tải bài học...</h3>
      <p className="text-gray-400 mt-2">Vui lòng đợi trong giây lát</p>
    </div>
  );
};

const EmptyState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-800 rounded-full p-4 mb-4">
        <AlertCircleIcon size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-300 text-center">
        {searchTerm
          ? `Không tìm thấy kết quả cho "${searchTerm}"`
          : "Không có bài học nào"}
      </h3>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        {searchTerm
          ? "Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc"
          : "Bạn cần thêm bài học mới hoặc làm mới danh sách"}
      </p>
    </div>
  );
};

export { LoadingState, EmptyState };
