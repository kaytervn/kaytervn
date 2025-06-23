import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { FETCH_INTERVAL } from "../../services/constant";

const SelectField = ({
  title = "",
  isRequired = false,
  placeholder = "",
  onChange,
  fetchListApi,
  queryParams,
  value,
  valueKey = "id",
  labelKey = "name",
  error = "",
  disabled = false,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setTimeout(async () => {
      const res = await fetchListApi({
        [labelKey]: searchTerm,
        ...queryParams,
      });
      setItems(res?.data?.content || []);
    }, FETCH_INTERVAL);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm || isOpen) {
      fetchData();
    }
  }, [searchTerm, isOpen]);

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
    } else if (items.length > 0) {
      const foundItem = items.find((item) => item[valueKey] === value);
      setSelectedItem(foundItem || null);
    }
  }, [value, items, valueKey]);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    onChange(item[valueKey]);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    setSelectedItem(null);
    onChange(null);
    setSearchTerm("");
  };

  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        ref={wrapperRef}
        className={`relative w-full ${
          error ? "border border-red-500 rounded-md" : ""
        }`}
      >
        <div
          className={`w-full flex items-center p-2 rounded-md ${
            error
              ? "bg-red-900/20"
              : disabled
              ? "bg-gray-700/50 border border-gray-700 cursor-not-allowed"
              : "bg-gray-800 border border-gray-600"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {isOpen && !disabled ? (
            <input
              className="flex-1 text-base outline-none text-gray-200 placeholder:text-gray-500 bg-transparent cursor-pointer"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            />
          ) : (
            <div
              className={`flex-1 text-base truncate ${
                selectedItem
                  ? "text-gray-200"
                  : disabled
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {selectedItem ? selectedItem[labelKey] : placeholder}
            </div>
          )}
          {selectedItem && !isOpen && !disabled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 text-gray-300 hover:text-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <XIcon size={16} />
            </button>
          ) : (
            <ChevronDownIcon
              size={20}
              className={disabled ? "text-gray-400" : "text-gray-200"}
            />
          )}
        </div>
        {isOpen && !disabled && (
          <div className="absolute w-full mt-1 max-h-60 overflow-y-auto rounded-md bg-gray-800 border border-gray-600 shadow-lg z-10">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-700 text-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSelect(item)}
                >
                  {item[labelKey]}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const StaticSelectField = ({
  title = "",
  isRequired = false,
  placeholder = "",
  onChange,
  dataMap,
  value,
  error = "",
  disabled = false,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const items = Object.values(dataMap);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value && value !== 0) {
      setSelectedItem(null);
    } else if (items.length > 0) {
      const foundItem = items.find((item: any) => item.value === value);
      setSelectedItem(foundItem || null);
    }
  }, [value, items]);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    onChange(item.value);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedItem(null);
    onChange(null);
  };

  return (
    <div className="flex-1 items-center">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div
        ref={wrapperRef}
        className={`relative w-full ${
          error ? "border border-red-500 rounded-md" : ""
        }`}
      >
        <div
          className={`w-full flex items-center p-2 rounded-md ${
            error
              ? "bg-red-900/20"
              : disabled
              ? "bg-gray-700/50 border border-gray-700 cursor-not-allowed"
              : "bg-gray-800 border border-gray-600"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div
            className={`flex-1 text-base truncate ${
              selectedItem
                ? "text-gray-200"
                : disabled
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {selectedItem ? selectedItem.label : placeholder}
          </div>
          {selectedItem && !disabled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 text-gray-300 hover:text-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <XIcon size={16} />
            </button>
          ) : (
            <ChevronDownIcon
              size={20}
              className={disabled ? "text-gray-400" : "text-gray-200"}
            />
          )}
        </div>
        {isOpen && !disabled && (
          <div className="absolute w-full mt-1 max-h-60 overflow-y-auto rounded-md bg-gray-800 border border-gray-600 shadow-lg z-10">
            {items.length > 0 ? (
              items.map((item: any, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-700 text-gray-200 cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <span
                    className={`px-2 py-1 rounded-md font-semibold text-sm whitespace-nowrap ${item.className}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

export { SelectField, StaticSelectField };
