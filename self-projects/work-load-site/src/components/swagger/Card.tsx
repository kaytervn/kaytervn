import {
  ArrowLeftRightIcon,
  CalendarFoldIcon,
  CircleChevronUpIcon,
  EditIcon,
  ExternalLinkIcon,
  RepeatIcon,
  Trash2Icon,
} from "lucide-react";
import RadioButtons from "../form/RadioButtons";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { truncateString, updateItemInStorage } from "../../types/utils";
import { GORGEOUS_SWAGGER } from "../../types/pageConfig";

const Card = ({
  item,
  onConvert,
  onUpdate,
  onDelete,
  onExport,
  onClickHeaders,
  onClickRequests,
}: any) => {
  const [initialValue, setInitialValue] = useState<any>(null);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    setInitialValue(item.local?.isInit ? item.local.url : item.remote.url);
    const newOptions = [];
    if (item.local) {
      newOptions.push({
        label: `${item.local.url}/v2/api-docs`,
        value: item.local.url,
      });
    }
    if (item.remote) {
      newOptions.push({
        label: `${item.remote.url}/v2/api-docs`,
        value: item.remote.url,
      });
    }
    setOptions(newOptions);
  }, [item]);
  const handleRadioChange = (value: any) => {
    const updatedItem = { ...item };
    if (value === item.local.url) {
      updatedItem.local = {
        ...updatedItem.local,
        isInit: true,
      };
      updatedItem.remote = {
        ...updatedItem.remote,
        isInit: false,
      };
    } else {
      updatedItem.local = {
        ...updatedItem.local,
        isInit: false,
      };
      updatedItem.remote = {
        ...updatedItem.remote,
        isInit: true,
      };
    }
    updateItemInStorage(GORGEOUS_SWAGGER.name, updatedItem, item.id);
  };
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div
        className="h-40 relative flex flex-col justify-between p-4"
        style={{
          background: `linear-gradient(45deg, ${item.color}99, ${item.color}66)`,
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-200 tracking-tight whitespace-nowrap">
            {truncateString(item.collectionName, 25)}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => onExport(item.id)}
              className="p-2 hover:bg-black/20 rounded-full transition-colors duration-200 text-gray-200"
              title="Export"
            >
              <ExternalLinkIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onUpdate(item.id)}
              className="p-2 hover:bg-black/20 rounded-full transition-colors duration-200 text-gray-200"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-black/20 rounded-full transition-colors duration-200 text-gray-200"
              title="Delete"
            >
              <Trash2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-gray-200 flex items-center space-x-2">
            <CalendarFoldIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {format(new Date(item.createdAt), "dd/MM/yyyy")}
            </span>
          </div>

          <div className="flex space-x-1.5">
            <div
              className="inline-flex bg-blue-600/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-blue-200 
          items-center space-x-2 cursor-pointer hover:bg-blue-400/40 transition text-sm font-medium"
              onClick={() => onClickRequests(item.id)}
            >
              <RepeatIcon className="w-4 h-4" />
              <span className="font-medium">
                {item.requests?.length || 0} Requests
              </span>
            </div>
            <div
              className="inline-flex bg-red-600/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-red-200 
          items-center space-x-2 cursor-pointer hover:bg-red-400/40 transition text-sm font-medium"
              onClick={() => onClickHeaders(item.id)}
            >
              <CircleChevronUpIcon className="w-4 h-4" />
              <span className="font-medium">Headers</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 p-4 flex flex-col flex-grow">
        <RadioButtons
          options={options}
          selectedValue={initialValue}
          onValueChange={handleRadioChange}
        />
        <button
          onClick={() => onConvert(item.id)}
          className="w-full bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-900 hover:to-indigo-900 text-gray-200 font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ArrowLeftRightIcon className="w-5 h-5" />
          <span>CONVERT</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
