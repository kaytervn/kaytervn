import { EraserIcon, PlusIcon, RefreshCcwIcon, SearchIcon } from "lucide-react";
import { BUTTON_TEXT } from "../../types/constant";

const CreateButton = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="ml-2 whitespace-nowrap bg-gray-600 hover:bg-gray-700 text-gray-100 text-sm p-2 rounded-lg flex items-center transition-colors duration-200"
    >
      <PlusIcon size={16} className="mr-1" />
      {BUTTON_TEXT.CREATE}
    </button>
  );
};

const ToolBar = ({
  searchBoxes,
  onSearch,
  onClear,
  onRefresh,
  actionButtons,
  actionButtons2,
}: any) => (
  <div className="flex space-y-2 flex-col mb-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {searchBoxes}
        {onSearch && (
          <button
            onClick={onSearch}
            className="bg-blue-800 hover:bg-blue-900 text-gray-100 text-sm p-2 rounded-lg flex items-center mr-2 whitespace-nowrap transition-colors duration-200"
          >
            <SearchIcon size={16} />
            <span className="ml-1">{BUTTON_TEXT.SEARCH}</span>
          </button>
        )}
        {onClear && (
          <button
            onClick={onClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm p-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <EraserIcon size={16} />
            <span className="ml-1">{BUTTON_TEXT.DELETE}</span>
          </button>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-blue-800 hover:bg-blue-900 text-gray-100 text-sm p-2 rounded-lg flex items-center mr-2 whitespace-nowrap transition-colors duration-200"
          >
            <RefreshCcwIcon size={16} />
            <span className="ml-1">{BUTTON_TEXT.REFRESH}</span>
          </button>
        )}
      </div>
      {actionButtons}
    </div>
    {actionButtons2}
  </div>
);

export { CreateButton, ToolBar };
