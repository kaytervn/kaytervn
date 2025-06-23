import notFoundImage from "../assets/error_404.png";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800 space-y-4">
      <img src={notFoundImage} alt="404 Not Found" className="w-64" />
      <h1 className="text-4xl font-semibold text-blue-600">
        Không tìm thấy trang
      </h1>
      <p className="text-lg text-gray-100 mt-2">Úi! Trang này không tồn tại</p>
      <button
        onClick={handleGoHome}
        className="group relative px-6 py-2 bg-blue-600 text-white font-medium rounded-lg 
                  hover:bg-blue-700 transition-all duration-300 ease-in-out
                  overflow-hidden shadow-lg hover:shadow-xl"
      >
        <span className="relative z-10">Về trang chủ</span>
        <span
          className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 
                       origin-left transition-transform duration-300 ease-in-out"
        />
      </button>
    </div>
  );
};

export default NotFound;
