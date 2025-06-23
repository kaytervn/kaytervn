import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { ConfirmationDialog } from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { SOCKET_CMD } from "../../services/constant";
import { removeSessionCache } from "../../services/storages";

const UnauthorizedDialog = () => {
  const { isUnauthorized, setIsUnauthorized, message } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  useEffect(() => {
    if (
      message?.responseCode === 400 ||
      message?.cmd === SOCKET_CMD.CMD_LOCK_DEVICE
    ) {
      removeSessionCache();
      setIsUnauthorized(true);
    }
  }, [message]);

  useEffect(() => {
    if (isUnauthorized) {
      showModal({
        title: "Phiên đăng nhập hết hạn",
        message: "Vui lòng đăng nhập lại để tiếp tục",
        confirmText: "Đồng ý",
        color: "goldenrod",
        onConfirm: () => {
          hideModal();
          window.location.href = "/";
        },
      });
    }
  }, [isUnauthorized]);

  return (
    <ConfirmationDialog
      zIndex={1100}
      isVisible={isModalVisible}
      formConfig={formConfig}
    />
  );
};

export default UnauthorizedDialog;
