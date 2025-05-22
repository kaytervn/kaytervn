import Sidebar from "../../components/main/Sidebar";
import { TOOLS, SEQUENCE_ACTIVATOR } from "../../types/pageConfig";
import { useEffect, useState } from "react";
import { processPUML } from "../../types/sequence";
import { CheckCircleIcon, CopyIcon } from "lucide-react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";

const SequenceActivator = () => {
  const { setToast } = useGlobalContext();
  const [inputPUML, setInputPUML] = useState<string>("");
  const [outputPUML, setOutputPUML] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = SEQUENCE_ACTIVATOR.label;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputPUML);
    setCopied(true);
    setToast("Output copied to clipboard", TOAST.SUCCESS);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Sidebar
      activeItem={TOOLS.name}
      breadcrumbs={[
        { label: TOOLS.label, path: TOOLS.path },
        { label: SEQUENCE_ACTIVATOR.label },
      ]}
      renderContent={
        <>
          <div className="bg-gray-900 p-6 rounded-3xl shadow-xl w-full max-w-7xl mx-auto border border-gray-800">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">
                Sequence UML Activator
              </h1>
              <p className="text-gray-400">
                Transform and process your PlantUML sequence diagrams
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
                  1
                </span>
                Input
              </h2>
              <textarea
                value={inputPUML}
                onChange={(e) => {
                  setOutputPUML("");
                  setInputPUML(e.target.value);
                }}
                placeholder="Enter PlantUML sequence diagram code here"
                className="w-full h-64 lg:h-96 p-4 rounded-xl resize-none bg-gray-700 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm shadow-inner border border-gray-600"
              />
            </div>

            <button
              onClick={() => {
                setOutputPUML(processPUML(inputPUML));
              }}
              className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center shadow-lg"
            >
              <span className="mr-2">✨</span>
              <span className="font-bold">PROCESS</span>
            </button>

            <div className="mt-8 bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg relative">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
                  2
                </span>
                Output
              </h2>
              <textarea
                value={outputPUML}
                readOnly
                placeholder="Processed output will appear here"
                className="w-full h-64 lg:h-96 p-4 rounded-xl resize-none bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none font-mono text-sm shadow-inner border border-gray-600"
              />
              <button
                onClick={handleCopy}
                className={`mt-2 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-white hover:bg-gray-500"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircleIcon size={16} className="mr-1" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={16} className="mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
              Process your PlantUML code with a single click
            </div>
          </div>
        </>
      }
    />
  );
};

export default SequenceActivator;
