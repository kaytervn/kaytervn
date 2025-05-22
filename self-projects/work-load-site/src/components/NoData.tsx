import { PackageIcon } from "lucide-react";
import NoDataImage from "../assets/no_content.png";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <img src={NoDataImage} className="w-64 h-64 opacity-50" />
      <h1 className="text-2xl font-semibold text-gray-600">No Data</h1>
    </div>
  );
};

const NoData2 = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <PackageIcon size={45} className="text-white opacity-15" />
      <h1 className="text-xl font-bold text-gray-600">No data</h1>
    </div>
  );
};

export { NoData, NoData2 };
