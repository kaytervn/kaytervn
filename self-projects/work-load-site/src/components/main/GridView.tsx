import { getNestedValue } from "../../types/utils";
import { useGlobalContext } from "../config/GlobalProvider";
import { NoData2 } from "../NoData";
import Pagination from "../Pagination";

const ActionButton = ({
  onClick,
  Icon,
  color,
  role,
  title = "Sample",
}: any) => {
  const { hasRoles } = useGlobalContext();

  if (role && !hasRoles(role)) {
    return null;
  }

  return (
    <button
      className={`p-1 hover:opacity-90`}
      onClick={onClick}
      title={title}
      style={{ color }}
    >
      <Icon size={16} />
    </button>
  );
};

const GridViewLoading = ({ loading }: any) => {
  if (!loading) return null;

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 -m-2 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
      </div>
    </div>
  );
};

const GridView = ({
  data,
  columns,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: any) => {
  const filteredColumns = columns.filter(Boolean);

  if (isLoading) {
    return <GridViewLoading loading={isLoading} />;
  }

  return (
    <div className="w-full">
      {!data || data?.length === 0 ? (
        <NoData2 />
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              <table className="w-full bg-gray-800 shadow-lg rounded-lg">
                <thead className="bg-gray-700 text-gray-200">
                  <tr className="text-sm leading-normal">
                    <th className="py-3 px-2 text-left rounded-tl-lg">#</th>
                    {filteredColumns.map((col: any, index: number) => (
                      <th
                        key={col.accessor}
                        className={`py-3 px-2 text-${
                          col.align
                        } whitespace-nowrap font-semibold ${
                          index === filteredColumns.length - 1
                            ? "rounded-tr-lg"
                            : ""
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-300 text-sm">
                  {data.map((item: any, index: any) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150"
                    >
                      <td className="p-2 text-left">
                        {index + 1 + currentPage * itemsPerPage}
                      </td>
                      {filteredColumns.map((col: any) => (
                        <td
                          key={col.accessor}
                          className={`p-2 text-${col.align} whitespace-nowrap`}
                        >
                          {col.render
                            ? col.render(item)
                            : getNestedValue(item, col.accessor)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { GridView, ActionButton };
