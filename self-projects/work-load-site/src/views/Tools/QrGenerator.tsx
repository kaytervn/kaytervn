import { useState, useEffect, useRef } from "react";
import { getCurrentDate_2 } from "../../types/utils";
import { TOOLS, QR_GENERATOR } from "../../types/pageConfig";
import Sidebar from "../../components/main/Sidebar";
import { QRCodeCanvas } from "qrcode.react";

const QrCodeGenerator = () => {
  const [text, setText] = useState<string>("");
  const [size, setSize] = useState<number>(200);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = QR_GENERATOR.label;
  }, []);

  const handleDownload = () => {
    const canvas = hiddenCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpg");
    link.download = `qrcode_${getCurrentDate_2()}.jpg`;
    link.click();
  };

  return (
    <Sidebar
      activeItem={TOOLS.name}
      breadcrumbs={[
        { label: TOOLS.label, path: TOOLS.path },
        { label: QR_GENERATOR.label },
      ]}
      renderContent={
        <>
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-2xl mx-auto">
            <div className="mb-4 text-center">
              <div className="inline-block p-2 bg-blue-500 bg-opacity-20 rounded-xl mb-3">
                <svg
                  className="w-8 h-8 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                QR Code Generator
              </h1>
              <p className="text-gray-400 mt-2">
                Create and download custom QR codes instantly
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Content
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 border rounded-xl focus:ring-2 focus:outline-none transition-all bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 shadow-inner"
                    rows={3}
                    placeholder="Enter text or URL to generate QR code"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Size (px)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full p-4 border rounded-xl text-center focus:ring-2 focus:outline-none transition-all bg-gray-800 border-gray-600 text-white focus:ring-blue-500 shadow-inner"
                    placeholder="Width (min 100px)"
                    min={100}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="p-6 rounded-2xl bg-white flex justify-center items-center shadow-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <QRCodeCanvas
                    value={text || "https://example.com"}
                    size={200}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Download QR Code</span>
            </button>

            <div className="mt-6 text-center text-gray-500 text-xs">
              Scan with any QR reader app to test
            </div>

            <div ref={hiddenCanvasRef} className="hidden">
              <QRCodeCanvas value={text} size={size < 100 ? 100 : size} />
            </div>
          </div>
        </>
      }
    />
  );
};

export default QrCodeGenerator;
