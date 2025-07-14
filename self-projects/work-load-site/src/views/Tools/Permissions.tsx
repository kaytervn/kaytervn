import { useEffect, useState } from "react";
import Sidebar from "../../components/main/Sidebar";
import { PERMISSIONS_GENERATOR, TOOLS } from "../../types/pageConfig";
import { useLoading } from "../../hooks/useLoading";
import { isValidURL, normalizeVietnamese } from "../../types/utils";
import { convertJsonPermissions } from "../../types/permissions";
import { LoadingDialog } from "../../components/form/Dialog";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";

const Permissions = () => {
  const { setToast } = useGlobalContext();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [apiUrl, setApiUrl] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [prefixLength, setPrefixLength] = useState<any>({});
  const [expandedGroups, setExpandedGroups] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = PERMISSIONS_GENERATOR.label;
  }, []);

  const fetchAndConvert = async () => {
    if (!apiUrl.trim() || !isValidURL(apiUrl)) {
      setToast("Please enter a valid API URL", TOAST.ERROR);
      return;
    }
    setData([]);
    showLoading();
    try {
      const data = await convertJsonPermissions(apiUrl);
      setData(data.permissions);
    } catch (err) {
      setToast(
        err instanceof Error ? err.message : "An error occurred",
        TOAST.ERROR
      );
    } finally {
      hideLoading();
    }
  };

  const groupBy = (array: any, key: any) => {
    return array.reduce((result: any, item: any) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  };

  const getPrefix = (group: any, length: any) => {
    const firstWord = group.split(" ")[0];
    const maxLength = Math.min(length, firstWord.length);
    return firstWord.slice(0, maxLength).toUpperCase() + "_";
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    setToast(`Copied to clipboard`, TOAST.SUCCESS);
  };

  const generateCSV = (groupData: any, groupName: any) => {
    const prefix = getPrefix(groupName, prefixLength[groupName] || 2);
    const headers = "action,name,group,permissionCode\n";
    const rows = groupData
      .map(
        (item: any) =>
          `${item.action},${item.name},${
            item.group
          },${prefix}${item.permissionCode.split("_").slice(1).join("_")}`
      )
      .join("\n");
    return headers + rows;
  };

  const toggleGroup = (groupName: any) => {
    setExpandedGroups((prev: any) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const expandAllGroups = () => {
    const allExpanded = Object.keys(groupedData).reduce(
      (acc: any, groupName: any) => {
        acc[groupName] = true;
        return acc;
      },
      {}
    );
    setExpandedGroups(allExpanded);
  };

  const collapseAllGroups = () => {
    setExpandedGroups({});
  };

  const filteredData = searchTerm
    ? data.filter(
        (item) =>
          normalizeVietnamese(item.action).includes(
            normalizeVietnamese(searchTerm)
          ) ||
          normalizeVietnamese(item.name).includes(
            normalizeVietnamese(searchTerm)
          ) ||
          normalizeVietnamese(item.group).includes(
            normalizeVietnamese(searchTerm)
          ) ||
          normalizeVietnamese(item.permissionCode).includes(
            normalizeVietnamese(searchTerm)
          )
      )
    : data;

  const groupedData: any = groupBy(filteredData, "group");

  return (
    <Sidebar
      activeItem={TOOLS.name}
      breadcrumbs={[
        { label: TOOLS.label, path: TOOLS.path },
        { label: PERMISSIONS_GENERATOR.label },
      ]}
      renderContent={
        <>
          <LoadingDialog isVisible={isLoading} />
          <div className="max-w-6xl w-full mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <svg
                  className="w-6 h-6 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Permissions Generator
                </h1>
              </div>
              <p className="text-gray-400 ml-8 mb-6">
                Generate and manage API permission codes with ease
              </p>

              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => {
                        setData([]);
                        setApiUrl(e.target.value);
                      }}
                      placeholder="Enter API documentation URL"
                      className="w-full pl-10 p-4 rounded-lg text-gray-100 placeholder-gray-500 bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={fetchAndConvert}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[120px] shadow-lg disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                          />
                        </svg>
                        <span>FETCH</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {data.length > 0 && (
              <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search permissions..."
                    className="w-full pl-10 p-3 rounded-lg text-gray-100 placeholder-gray-500 bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={expandAllGroups}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllGroups}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    Collapse All
                  </button>
                </div>
              </div>
            )}

            {Object.keys(groupedData).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedData).map(
                  ([groupName, groupData]: any) => (
                    <div
                      key={groupName}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-md"
                    >
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-700 border-l-4 border-blue-500"
                        onClick={() => toggleGroup(groupName)}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-100 mr-2">
                            {expandedGroups[groupName] ? (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            )}
                          </span>
                          <h2 className="text-xl font-semibold text-gray-100">
                            {groupName}
                            <span className="ml-2 text-sm bg-blue-500 text-gray-100 px-2 py-1 rounded-full">
                              {groupData.length}
                            </span>
                          </h2>
                        </div>
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center bg-gray-700 rounded-lg px-2 py-1">
                            <span className="text-xs text-gray-400 mr-2">
                              Prefix Length:
                            </span>
                            <select
                              value={prefixLength[groupName] || 2}
                              onChange={(e) =>
                                setPrefixLength({
                                  ...prefixLength,
                                  [groupName]: parseInt(e.target.value),
                                })
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="bg-gray-600 text-gray-100 py-1 px-2 rounded border border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                generateCSV(groupData, groupName)
                              );
                            }}
                            className="bg-green-600 hover:bg-green-700 text-gray-100 px-3 py-1 rounded-lg transition-colors flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                            CSV
                          </button>
                        </div>
                      </div>

                      {expandedGroups[groupName] && (
                        <div className="p-4 overflow-x-auto">
                          <table className="w-full text-gray-100 border-collapse">
                            <thead>
                              <tr className="bg-gray-700 text-left">
                                <th className="p-3 rounded-tl-lg">Action</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Group</th>
                                <th className="p-3 rounded-tr-lg">
                                  Permission Code
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupData.map((item: any, index: any) => {
                                const prefix = getPrefix(
                                  groupName,
                                  prefixLength[groupName] || 2
                                );
                                const fullPermissionCode = `${prefix}${item.permissionCode
                                  .split("_")
                                  .slice(1)
                                  .join("_")}`;
                                return (
                                  <tr
                                    key={index}
                                    className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                                      index === groupData.length - 1
                                        ? "border-b-0"
                                        : ""
                                    }`}
                                  >
                                    <td className="p-3">
                                      <span
                                        onClick={() =>
                                          copyToClipboard(item.action)
                                        }
                                        className="cursor-pointer hover:text-blue-400 flex items-center transition-colors"
                                      >
                                        <span>{item.action}</span>
                                        <svg
                                          className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span
                                        onClick={() =>
                                          copyToClipboard(item.name)
                                        }
                                        className="cursor-pointer hover:text-blue-400 transition-colors"
                                      >
                                        {item.name}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span
                                        onClick={() =>
                                          copyToClipboard(item.group)
                                        }
                                        className="cursor-pointer hover:text-blue-400 transition-colors"
                                      >
                                        {item.group}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span
                                        onClick={() =>
                                          copyToClipboard(fullPermissionCode)
                                        }
                                        className="cursor-pointer bg-gray-700 text-blue-400 px-2 py-1 rounded font-mono text-sm hover:bg-gray-600 transition-colors"
                                      >
                                        {fullPermissionCode}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              data.length > 0 && (
                <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-gray-400 text-lg">
                    No permissions match your search criteria
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Clear Search
                  </button>
                </div>
              )
            )}

            {data.length === 0 && !isLoading && (
              <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
                <svg
                  className="w-16 h-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-gray-300 text-xl font-medium mb-2">
                  No Permissions Yet
                </h3>
                <p className="text-gray-400">
                  Enter an API URL and click "FETCH" to generate permissions
                </p>
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default Permissions;
