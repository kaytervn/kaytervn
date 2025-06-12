import { useEffect, useState } from "react";
import { Copy, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "../../components/main/Sidebar";
import { NODE_CRUD_GENERATOR, TOOLS } from "../../types/pageConfig";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";
import { generateNodeJsCrudOutput } from "../../services/nodeJsCrud";

const NodeCrudGenerator = () => {
  const { setToast } = useGlobalContext();
  const [inputText, setInputText] = useState("");
  const [outputItems, setOutputItems] = useState<any[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    document.title = NODE_CRUD_GENERATOR.label;
  }, []);

  const handleGenerate = () => {
    if (!inputText.trim()) {
      setToast("Please enter your input model", TOAST.ERROR);
      return;
    }
    try {
      const results: any = generateNodeJsCrudOutput(inputText);
      if (!results) {
        setToast("Invalid schema format", TOAST.ERROR);
        return;
      }
      setToast("Generated successfully", TOAST.SUCCESS);
      setOutputItems(results);
    } catch (err) {
      setToast(
        err instanceof Error ? err.message : "An error occurred",
        TOAST.ERROR
      );
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setToast("Copied to clipboard", TOAST.SUCCESS);
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const toggleDetails = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Sidebar
      activeItem={TOOLS.name}
      breadcrumbs={[
        { label: TOOLS.label, path: TOOLS.path },
        { label: NODE_CRUD_GENERATOR.label },
      ]}
      renderContent={
        <>
          <div className="p-4 space-y-4 max-w-6xl w-full mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
              <div className="mb-6">
                <h1 className="text-left text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center">
                  <span className="mr-2">⚡</span>
                  Node.js CRUD Generator
                </h1>
                <p className="text-gray-400 mt-2">
                  This tool generates CRUD operations for MSA Project with
                  Encryption
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>
                <div className="relative bg-gray-800 rounded-xl overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-gray-900 border-b border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-4 text-xs text-gray-400">
                      yourModel.js
                    </span>
                  </div>
                  <textarea
                    className="text-gray-100 placeholder-gray-400 bg-gray-800 h-80 w-full p-6 focus:outline-none font-mono text-sm"
                    rows={6}
                    placeholder="Paste your model input here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                GENERATE CODE
              </button>

              <div className="flex justify-between items-center mt-6 text-gray-400 text-xs">
                <span>Ready to transform your models</span>
                <span>v1.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {outputItems.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="p-4 flex justify-between items-center bg-gray-700">
                    <h2 className="text-lg font-semibold text-gray-100">
                      {item.name}
                    </h2>
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => handleCopy(item.value, `value-${index}`)}
                        className="p-2 text-gray-100 rounded-lg transition-all duration-200 hover:bg-gray-500 flex items-center gap-2"
                      >
                        {copiedStates[`value-${index}`] ? (
                          <CheckCircle2 className="w-4 h-4 text-gray-100" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleDetails(index)}
                        className="m-2 flex items-center text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                      >
                        {openStates[index] ? (
                          <ChevronUp className="w-6 h-6 text-gray-100" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-100" />
                        )}
                      </button>
                    </div>
                  </div>
                  {openStates[index] && (
                    <pre className="p-4 overflow-x-auto text-gray-50 bg-gray-900">
                      {item.value}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      }
    />
  );
};

export default NodeCrudGenerator;
