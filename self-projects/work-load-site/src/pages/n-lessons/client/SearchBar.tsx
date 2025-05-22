import {
  ChevronDownIcon,
  FilterIcon,
  LockIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import { useEffect, useRef, useState } from "react";
import { GORGEOUS_SWAGGER } from "../../../types/pageConfig";
import { useNavigate } from "react-router-dom";
import { N_LESSONS_PAGE_CONFIG } from "../../../components/config/PageConfig";

const DropdownBox = ({ options }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-full md:w-auto" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-100"
      >
        <svg
          className={`w-4 h-4 mr-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <span>Chuyển hướng</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full min-w-[200px] mt-2 bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-10">
          {options.map((option: any) => (
            <div
              key={option.value}
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-gray-100 hover:bg-gray-600 cursor-pointer transition-colors"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  refreshData,
  openApiDialog,
}: any) => {
  const { apiKey } = useGlobalContext();
  const navigate = useNavigate();
  const options: any[] = [
    {
      value: GORGEOUS_SWAGGER.name,
      label: GORGEOUS_SWAGGER.label,
      action: () => navigate(GORGEOUS_SWAGGER.path),
    },
    {
      value: "cms",
      label: "Trang quản lý",
      action: () => navigate(N_LESSONS_PAGE_CONFIG.LESSON.path),
    },
  ];

  const filteredOptions = options.filter((option) => {
    if (option.value === "cms") {
      return apiKey && apiKey.trim() !== "";
    }
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
      <div className="relative w-full md:flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
        />
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      <div className="relative w-full md:w-auto">
        <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 px-3 py-2">
          <FilterIcon size={18} className="text-gray-400 mr-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-gray-100 focus:outline-none appearance-none pr-8 w-full"
          >
            {categories.map((category: string) => (
              <option
                key={category}
                value={category}
                className="bg-gray-900 text-white py-2"
                style={{ lineHeight: "2rem" }}
              >
                {category === "all" ? "Tất cả danh mục" : category}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={16}
            className="text-gray-400 absolute right-3 pointer-events-none"
          />
        </div>
      </div>

      <button
        onClick={refreshData}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center justify-center"
      >
        <RefreshCwIcon size={18} className="mr-2" />
        <span>Làm mới</span>
      </button>

      {!apiKey && (
        <button
          onClick={openApiDialog}
          className={`w-full md:w-auto px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors bg-gray-700 hover:bg-gray-600 border border-gray-600`}
        >
          <LockIcon size={18} className="mr-2" />
          <span>Xác thực</span>
        </button>
      )}
      <DropdownBox options={filteredOptions} />
    </div>
  );
};

export default SearchBar;
