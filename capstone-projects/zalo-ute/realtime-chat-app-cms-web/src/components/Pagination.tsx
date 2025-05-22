import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const pageNumbers: any = [];
  const maxVisiblePages = 5;
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }
  const renderPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return pageNumbers.map((number: any) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 mx-1 rounded-lg transition-colors duration-200 ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {number + 1}
        </button>
      ));
    }
    const leftSide = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 0);
    const rightSide = Math.min(leftSide + maxVisiblePages - 1, totalPages - 1);
    const items = [];
    if (leftSide > 0) {
      items.push(0);
      if (leftSide > 1) {
        items.push("...");
      }
    }
    for (let i = leftSide; i <= rightSide; i++) {
      items.push(i);
    }
    if (rightSide < totalPages - 1) {
      if (rightSide < totalPages - 2) {
        items.push("...");
      }
      items.push(totalPages - 1);
    }
    return items.map((item: any, index) => {
      if (item === "...") {
        return (
          <span
            key={index}
            className="w-8 h-8 mx-1 text-gray-700 text-center flex items-center justify-center"
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={index}
          onClick={() => onPageChange(item)}
          className={`w-8 h-8 mx-1 rounded-lg transition-colors duration-200 ${
            currentPage === item
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {item + 1}
        </button>
      );
    });
  };
  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`w-8 h-8 rounded bg-gray-100 mr-2 flex items-center justify-center ${
          currentPage === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <ChevronLeftIcon size={20} />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`w-8 h-8 rounded bg-gray-100 ml-2 flex items-center justify-center ${
          currentPage === totalPages - 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
};

export default Pagination;
