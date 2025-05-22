import { PencilIcon, TrashIcon } from "lucide-react";
import useDialog from "../../../hooks/useDialog";
import { ConfirmationDialog } from "../../form/Dialog";

const TableRowComponentHeader = ({
  handleEdit,
  handleRemove,
  headers,
  columns,
}: any) => {
  const { isDialogVisible, showDialog, hideDialog, dialogConfig } = useDialog();

  const handleDeleteDialog = (index: any) => {
    showDialog({
      title: "Delete Header",
      message: "Are you sure you want to delete this header?",
      confirmText: "Delete",
      color: "red",
      onConfirm: () => {
        handleRemove(index);
        hideDialog();
      },
      onCancel: hideDialog,
    });
  };

  return (
    <>
      <table className="w-full rounded-lg text-gray-200">
        <tbody className="text-gray-300 text-base outline-none">
          {headers.map((item: any, index: any) => (
            <tr
              key={index}
              className="border-gray-700 border-t hover:bg-gray-800 transition-colors duration-200"
            >
              {columns.map((col: any) => (
                <td key={col.accessor} className={`p-2 text-${col.align}`}>
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
              <td className="py-1 text-end pr-1">
                <div className="flex justify-end space-x-1">
                  <button
                    className={`p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-blue-900/40 transition duration-200 ease-in-out flex items-center justify-center`}
                    onClick={() => handleEdit(index, headers[index])}
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button
                    className={`p-2 mr-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/40 transition duration-200 ease-in-out flex items-center justify-center`}
                    onClick={() => handleDeleteDialog(index)}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationDialog
        isVisible={isDialogVisible}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={dialogConfig.onConfirm}
        onCancel={dialogConfig.onCancel}
        confirmText={dialogConfig.confirmText}
        color={dialogConfig.color}
      />
    </>
  );
};

export default TableRowComponentHeader;
