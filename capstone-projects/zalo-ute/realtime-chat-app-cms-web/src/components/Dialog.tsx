const ModalForm = ({ children, isVisible, color, title, message }: any) => {
  if (!isVisible) return null;
  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2" style={{ color }}>
          {title}
        </h2>
        <p className="text-base text-gray-600 mb-6">{message}</p>
        <div className="flex-grow flex items-center justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfimationDialog = ({
  isVisible,
  title,
  message,
  color = "green",
  onConfirm,
  confirmText = "Đồng ý",
  onCancel,
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      title={title}
      message={message}
      color={color}
    >
      <div className="flex gap-2 w-full">
        <button
          onClick={onCancel}
          className="p-3 rounded-md bg-gray-200 w-full text-gray-800 text-center text-lg font-semibold"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="p-3 rounded-md w-full text-white text-center text-lg font-semibold"
          style={{ backgroundColor: color }}
        >
          {confirmText}
        </button>
      </div>
    </ModalForm>
  );
};

const AlertDialog = ({
  isVisible,
  title = "Thông báo",
  message,
  color = "green",
  onAccept,
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      title={title}
      message={message}
      color={color}
    >
      <div className="flex">
        <button
          onClick={onAccept}
          className="p-3 rounded-md flex-1 text-white text-center text-lg font-semibold"
          style={{ backgroundColor: color }}
        >
          OK
        </button>
      </div>
    </ModalForm>
  );
};

const LoadingDialog = ({
  isVisible,
  title = "Đang xử lý",
  message = "Vui lòng chờ trong giây lát...",
  color = "royalblue",
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      color={color}
      title={title}
      message={message}
    >
      <div className="bg-white rounded-lg items-center">
        <div className="w-10 h-10 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    </ModalForm>
  );
};

export { ConfimationDialog, AlertDialog, LoadingDialog };
