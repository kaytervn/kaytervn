import { useRef } from "react";
import { useGlobalContext } from "../config/GlobalProvider";
import { BUTTON_TEXT, TOAST } from "../../services/constant";
import { UploadIcon } from "lucide-react";

const ImportExcelButton = ({ role, fetchApi, onFileUploaded }: any) => {
  const { hasRoles, setToast } = useGlobalContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (role && !hasRoles(role)) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setToast("Định dạng tệp không hợp lệ", TOAST.ERROR);
      return;
    }

    try {
      const res = await fetchApi(file);
      if (res.result) {
        await onFileUploaded?.();
        setToast("Tệp Excel đã được tải lên thành công", TOAST.SUCCESS);
      }
    } catch (error) {
      setToast("Lỗi khi tải file Excel lên", TOAST.ERROR);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="ml-2 whitespace-nowrap bg-blue-700 hover:bg-blue-800 text-white text-sm p-2 rounded-lg flex items-center transition-colors duration-200"
      >
        <UploadIcon size={16} className="mr-1" />
        {BUTTON_TEXT.IMPORT_EXCEL}
      </button>
    </>
  );
};

export default ImportExcelButton;
