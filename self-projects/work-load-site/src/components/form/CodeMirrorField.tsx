import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

const CodeMirrorInput = ({
  title,
  value,
  onChangeText,
  error,
  isRequire = false,
  maxHeight = "100px",
}: any) => {
  return (
    <div className="mb-4">
      {title && (
        <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
          {title}
          {isRequire && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="flex items-center">
        <div
          className={`flex items-center border rounded-md p-2 flex-1 ${
            error
              ? "border-red-500 bg-red-900/20"
              : "border-gray-600 bg-gray-800"
          }`}
        >
          <CodeMirror
            value={value}
            height={maxHeight}
            extensions={[javascript()]}
            theme="dark"
            onChange={(value) => onChangeText(value)}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
    </div>
  );
};

const CodeMirrorWithCheckbox = ({
  title,
  value,
  onChangeText,
  error,
  isChecked = false,
  onCheckboxChange,
  maxHeight = "100px",
}: any) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={onCheckboxChange}
        >
          <div
            className={`w-10 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${
              isChecked ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                isChecked ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span
            className={`text-base font-semibold ${
              isChecked ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {title}
            {isChecked && <span className="ml-1 text-red-500">*</span>}
          </span>
        </button>
      </div>
      {isChecked && (
        <>
          <div className="flex items-center">
            <div
              className={`flex items-center border rounded-md p-2 flex-1 ${
                error
                  ? "border-red-500 bg-red-900/20"
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              <CodeMirror
                value={value}
                height={maxHeight}
                extensions={[javascript()]}
                theme="dark"
                onChange={(value) => onChangeText(value)}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1 text-left">{error}</p>
          )}
        </>
      )}
    </div>
  );
};

export { CodeMirrorInput, CodeMirrorWithCheckbox };
