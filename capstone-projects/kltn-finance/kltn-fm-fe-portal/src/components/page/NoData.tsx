import { PackageIcon } from "lucide-react";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <PackageIcon size={45} className="text-white opacity-15" />
      <h1 className="text-xl font-bold text-gray-600">Không có dữ liệu</h1>
    </div>
  );
};

export default NoData;
