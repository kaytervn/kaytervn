import { useState } from "react";

const useDialog = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const showDialog = () => {
    if (!isDialogVisible) {
      setIsDialogVisible(true);
      return true;
    }
    return false;
  };

  const hideDialog = () => setIsDialogVisible(false);

  return {
    isDialogVisible,
    showDialog,
    hideDialog,
  };
};

export default useDialog;
