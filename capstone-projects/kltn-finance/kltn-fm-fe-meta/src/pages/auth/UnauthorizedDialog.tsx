import { useEffect } from "react";
import { useGlobalContext } from "../../components/GlobalProvider";
import { ConfirmationDialog } from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { SOCKET_CMD } from "../../services/constant";

const UnauthorizedDialog = () => {
  const { isUnauthorized, setIsUnauthorized, message } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  useEffect(() => {
    if (
      message?.responseCode === 400 ||
      message?.cmd === SOCKET_CMD.CMD_LOCK_DEVICE
    ) {
      setIsUnauthorized(true);
    }
  }, [message]);

  useEffect(() => {
    if (!isUnauthorized) {
      return;
    }
    removeSessionCache();
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
  }, [isUnauthorized]);

  return (
    <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
  );
};

export default UnauthorizedDialog;
