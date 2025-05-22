import NoDataImage from "../assets/no_content.png";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <img src={NoDataImage} className="w-64 h-64 opacity-75" />
      <h1 className="text-2xl font-light text-gray-400">Không có dữ liệu</h1>
    </div>
  );
};

export default NoData;
