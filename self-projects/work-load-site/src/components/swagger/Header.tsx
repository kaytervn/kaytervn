import { CircleX, DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";

const Header = ({
  SearchBoxes,
  onCreate,
  onImport,
  onExport,
  onDeleteAll,
}: any) => (
  <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
    <div className="flex items-center w-full md:w-auto">{SearchBoxes}</div>
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
      {onDeleteAll && (
        <button
          onClick={onDeleteAll}
          className="border-2 border-red-500 hover:border-gray-100 border-dashed text-red-500 hover:text-gray-100 transition duration-200 ease-in-out p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
        >
          <CircleX size={20} className="mr-2" />
          <span className="font-semibold text-lg text-center whitespace-nowrap">
            Delete All
          </span>
        </button>
      )}
      {onExport && (
        <button
          onClick={onExport}
          className="border-2 border-dashed border-blue-500 hover:border-gray-100 text-blue-500 hover:text-gray-100 transition duration-200 ease-in-out p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
        >
          <DownloadIcon size={20} className="mr-2" />
          <span className="font-semibold text-lg text-center">Export</span>
        </button>
      )}
      {onImport && (
        <button
          onClick={onImport}
          className="border-2 border-dashed border-blue-500 hover:border-gray-100 text-blue-500 hover:text-gray-100 transition duration-200 ease-in-out p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
        >
          <UploadIcon size={20} className="mr-2" />
          <span className="font-semibold text-lg text-center">Import</span>
        </button>
      )}
      {onCreate && (
        <button
          onClick={onCreate}
          className="bg-gray-500 hover:bg-gray-600 text-gray-50 hover:text-gray-100 p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
        >
          <PlusIcon size={20} className="mr-2" />
          <span className="font-semibold text-lg text-center">New</span>
        </button>
      )}
    </div>
  </div>
);

export default Header;
