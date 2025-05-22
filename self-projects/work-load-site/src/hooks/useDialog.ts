import { useState } from "react";

const useDialog = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<any>({
    title: "",
    message: "",
    color: "green",
    confirmText: "Accept",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showDialog = (config: any) => {
    setDialogConfig({
      ...dialogConfig,
      ...config,
    });
    setIsDialogVisible(true);
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  return {
    isDialogVisible,
    showDialog,
    hideDialog,
    dialogConfig,
  };
};

export default useDialog;
