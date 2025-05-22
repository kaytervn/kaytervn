import notFoundImage from "../assets/error_404.png"; // Điều chỉnh đường dẫn đến ảnh 404

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <img src={notFoundImage} alt="404 Not Found" className="w-64" />
      <h1 className="text-4xl font-bold text-red-500">Không tìm thấy trang</h1>
      <p className="text-lg text-gray-700 mt-2">
        Úi! Trang bạn yêu cầu không tồn tại.
      </p>
    </div>
  );
};

export default NotFound;
