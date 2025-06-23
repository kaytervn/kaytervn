import { useEffect, useRef, useState } from "react";
import {
  FileIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  FileTextIcon,
  MusicIcon,
} from "lucide-react";
import useApi from "../../hooks/useApi";
import { getMediaImage } from "../../services/utils";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  MIME_TYPES,
  TOAST,
} from "../../services/constant";
import {
  configDeleteFileDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../page/Dialog";
import { useGlobalContext } from "../config/GlobalProvider";
import useModal from "../../hooks/useModal";

const DocumentsField = ({
  title = "",
  value = "[]",
  onChange,
  disabled = false,
}: any) => {
  const { setToast } = useGlobalContext();
  const { media, loading } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();

  useEffect(() => {
    try {
      const parsedFiles = JSON.parse(value);
      if (Array.isArray(parsedFiles)) {
        setFiles(parsedFiles);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Error parsing value:", error);
      setFiles([]);
    }
  }, [value]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await media.upload(file);
      const filePath = res.data.filePath;
      if (filePath) {
        const newFile = { name: file.name, url: filePath };
        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        onChange(JSON.stringify(updatedFiles));
        setToast("Tệp đã được tải lên thành công", TOAST.SUCCESS);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setToast("Lỗi khi tải tệp lên!", TOAST.ERROR);
    }
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteFileDialog({
        label: "Xóa tệp",
        onConfirm: () => handleDelete(id),
        hideModal: hideDeleteDialog,
      })
    );
  };

  const handleDelete = (index: number) => {
    hideDeleteDialog();
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(JSON.stringify(updatedFiles));
    setToast(BASIC_MESSAGES.DELETED, TOAST.SUCCESS);
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(getMediaImage(url), "_blank");
  };

  const getFileIcon = (fileName: string) => {
    const extension = `.${fileName.split(".").pop()?.toLowerCase()}`;
    const mimeType =
      MIME_TYPES[extension as keyof typeof MIME_TYPES] ||
      "application/octet-stream";

    if (mimeType.startsWith("image/")) {
      return <ImageIcon size={20} className="text-blue-400" />;
    } else if (mimeType.startsWith("video/")) {
      return <VideoIcon size={20} className="text-purple-400" />;
    } else if (mimeType.startsWith("audio/")) {
      return <MusicIcon size={20} className="text-green-400" />;
    } else if (mimeType === "application/pdf") {
      return <FileTextIcon size={20} className="text-red-400" />;
    } else if (
      [
        "text/plain",
        "text/csv",
        "application/json",
        "application/xml",
        "text/markdown",
        "text/html",
      ].includes(mimeType)
    ) {
      return <FileTextIcon size={20} className="text-gray-400" />;
    }
    return <FileIcon size={20} className="text-gray-400" />;
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ConfirmationDialog
        isVisible={deleteDialogVisible}
        formConfig={deleteDialogConfig}
      />
      <div className="flex-1 items-center">
        <div className="flex items-center mb-2">
          {title && (
            <label className="text-base font-semibold text-gray-200 text-left flex items-center">
              {title}
            </label>
          )}
          {!disabled && (
            <div className="ml-2">
              <input
                type="file"
                accept="*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                title="Tải tệp lên"
                onClick={() => fileInputRef.current?.click()}
                className="font-bold flex rounded-full items-center p-2 bg-blue-700 text-white hover:bg-blue-600 transition-colors"
              >
                <UploadIcon size={12} />
              </button>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-800 border border-gray-600 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.name)}
                  <span
                    onClick={() => handleOpenInNewTab(file.url)}
                    className="text-gray-200 truncate cursor-pointer hover:underline"
                  >
                    {file.name}
                  </span>
                </div>
                {!disabled && (
                  <button
                    title={BUTTON_TEXT.DELETE}
                    onClick={() => onDeleteButtonClick(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2Icon size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentsField;
