import logo from "../assets/finance_logo.png";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-700">
      <div className="flex flex-col items-center mb-5">
        <img src={logo} alt="Cookiedu Logo" className="w-36 h-36" />
        <h1 className="text-3xl font-bold text-white mt-3">META</h1>
      </div>
      <div className="w-12 h-12 border-4 border-t-white border-white/30 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
