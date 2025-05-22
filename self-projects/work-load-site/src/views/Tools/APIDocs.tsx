import { useEffect, useState } from "react";
import { API_DOCS, TOOLS } from "../../types/pageConfig";
import Sidebar from "../../components/main/Sidebar";
import { convertJson } from "../../types/apidocs";
import { LoadingDialog } from "../../components/form/Dialog";
import { useLoading } from "../../hooks/useLoading";
import { isValidURL } from "../../types/utils";
import { CopyIcon } from "lucide-react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";

interface QueryParam {
  key: string;
  value: string;
}

const APIDocs = () => {
  const { setToast } = useGlobalContext();
  const [apiUrl, setApiUrl] = useState<string>("");
  const [apiContent, setApiContent] = useState<any[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.title = API_DOCS.label;
  }, []);

  const toggleGroup = (index: number) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(index)) {
      newExpandedGroups.delete(index);
    } else {
      newExpandedGroups.add(index);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const formatQueryParams = (
    query: QueryParam[] | Record<string, any>
  ): string => {
    if (!Array.isArray(query)) return JSON.stringify(query, null, 2);

    return query
      .map((param) => {
        const isRequired = param.value.includes("required: true");
        return `- ${param.key}: ${isRequired ? param.value : param.value}`;
      })
      .join("\n");
  };

  const fetchAndConvert = async () => {
    if (!apiUrl.trim() || !isValidURL(apiUrl)) {
      setToast("Please enter a valid API URL", TOAST.ERROR);
      return;
    }
    setApiContent([]);
    showLoading();
    try {
      const data = await convertJson(apiUrl);
      setApiContent(data);
    } catch (err) {
      setToast(
        err instanceof Error ? err.message : "An error occurred",
        TOAST.ERROR
      );
    } finally {
      hideLoading();
    }
  };

  const getMethodColor = (method: string): string => {
    const colors: Record<string, string> = {
      get: "text-green-500",
      post: "text-yellow-400",
      put: "text-blue-500",
      delete: "text-red-500",
    };
    return colors[method.toLowerCase()] || "text-gray-500";
  };

  const getMethodColorNative = (method: string): string => {
    const colors: Record<string, string> = {
      get: "#38a169",
      post: "#b45309",
      put: "#3b82f6",
      delete: "#ef4444",
    };
    return colors[method.toLowerCase()] || "#6b7280";
  };

  const handleCopy = (endpoint: any) => {
    const isQuery = Boolean(endpoint.query);
    const payloadContent = isQuery
      ? formatQueryParams(endpoint.query)
      : endpoint.body
      ? JSON.stringify(endpoint.body, null, 2)
      : null;

    const payload = payloadContent
      ? `
    <strong>Payload ${isQuery ? "(Query)" : "(Body)"}:</strong>
    <pre>${payloadContent}</pre>`
      : "";

    const content = `
    <div>
      <strong>Endpoint:</strong> ${endpoint.url}<br>
      <strong>Method: <span style="color: ${getMethodColorNative(
        endpoint.method
      )}">${endpoint.method}</span></strong><br>
      ${payload}
      <strong>Description:</strong> <em>${endpoint.description}</em><br>
      <strong>Response:</strong><pre>${JSON.stringify(
        endpoint.response,
        null,
        2
      )}</pre>
    </div>
  `;

    navigator.clipboard
      .write([
        new ClipboardItem({
          "text/html": new Blob([content], { type: "text/html" }),
        }),
      ])
      .then(() => {
        setToast("Request copied to clipboard", TOAST.SUCCESS);
      });
  };

  return (
    <Sidebar
      activeItem={TOOLS.name}
      breadcrumbs={[
        { label: TOOLS.label, path: TOOLS.path },
        { label: API_DOCS.label },
      ]}
      renderContent={
        <>
          <LoadingDialog isVisible={isLoading} />
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-700 max-w-4xl w-full mx-auto mb-4">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 8H17M7 12H11M7 16H9"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="2"
                      y1="4"
                      x2="22"
                      y2="20"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
                API Documentation
              </h1>
              <p className="text-gray-400">
                Fetch and convert API documentation from any URL
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg opacity-30 blur"></div>
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => {
                      setApiContent([]);
                      setApiUrl(e.target.value);
                    }}
                    placeholder="Enter API documentation URL"
                    className="text-gray-100 placeholder-gray-500 bg-gray-700 w-full p-4 pl-12 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                </div>

                <button
                  onClick={fetchAndConvert}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 shadow-lg flex items-center justify-center whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      FETCH
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Supports Swagger, OpenAPI, and other REST API documentation
              formats
            </div>
          </div>

          <div className="space-y-4 max-w-4xl w-full mx-auto">
            {apiContent.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="bg-gray-900 rounded-lg shadow-sm p-4 text-[17px]"
                style={{ WebkitUserSelect: "text", userSelect: "text" }}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleGroup(groupIndex)}
                >
                  <h2 className="text-xl font-bold text-slate-200">
                    {group.name}
                  </h2>
                  <span className="text-slate-200">
                    {expandedGroups.has(groupIndex) ? "▲" : "▼"}
                  </span>
                </div>

                {expandedGroups.has(groupIndex) && (
                  <div className="space-y-4 [&_*]:font-['Times_New_Roman'] mt-3">
                    {group.item.map((endpoint: any, endpointIndex: any) => (
                      <div
                        key={endpointIndex}
                        className="relative rounded-lg p-4 bg-gray-700"
                      >
                        <button
                          onClick={() => handleCopy(endpoint)}
                          className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-gray-100 font-bold p-3 rounded-lg text-base"
                        >
                          <CopyIcon size={16} />
                        </button>

                        <p className="text-gray-200">
                          <b>Endpoint:</b> {endpoint.url}
                        </p>
                        <p className="text-gray-200">
                          <b>Method:</b>{" "}
                          <span
                            className={`font-semibold ${getMethodColor(
                              endpoint.method
                            )}`}
                          >
                            {endpoint.method}
                          </span>
                        </p>

                        {(endpoint.query || endpoint.body) && (
                          <>
                            <p className="text-gray-200">
                              <b>
                                Payload {endpoint.query ? "(Query)" : "(Body)"}:
                              </b>
                            </p>
                            <pre
                              className="m-2 p-4 rounded-md overflow-auto whitespace-pre-wrap bg-gray-600 text-gray-200"
                              style={{
                                fontFamily: "Times New Roman",
                                WebkitUserSelect: "text",
                                userSelect: "text",
                              }}
                            >
                              {endpoint.query
                                ? formatQueryParams(endpoint.query)
                                : JSON.stringify(endpoint.body, null, 2)}
                            </pre>
                          </>
                        )}

                        <p className="text-gray-200">
                          <b>Description:</b> <em>{endpoint.description}</em>
                        </p>
                        <p className="text-gray-200">
                          <b>Response:</b>
                        </p>
                        <pre
                          className="m-2 p-2 rounded-md overflow-auto whitespace-pre-wrap bg-gray-600 text-gray-200"
                          style={{
                            fontFamily: "Times New Roman",
                            WebkitUserSelect: "text",
                            userSelect: "text",
                          }}
                        >
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      }
    />
  );
};

export default APIDocs;
