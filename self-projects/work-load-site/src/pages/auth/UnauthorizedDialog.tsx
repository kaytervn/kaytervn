/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { BUTTON_TEXT, SOCKET_CMD } from "../../types/constant";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import { ConfirmationDialog } from "../../components/form/Dialog";

const UnauthorizedDialog = () => {
  const { isUnauthorized, setIsUnauthorized, message } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  useEffect(() => {
    if (
      message?.responseCode == 400 ||
      message?.cmd == SOCKET_CMD.CMD_LOCK_DEVICE
    ) {
      removeSessionCache();
      setIsUnauthorized(true);
    }
  }, [message]);

  useEffect(() => {
    if (isUnauthorized) {
      showModal({
        title: "Session Timed Out",
        message: `Your session has expired due to our security policy.\nPlease log in again to continue.`,
        confirmText: BUTTON_TEXT.ACCEPT,
        color: "goldenrod",
        onConfirm: () => {
          hideModal();
          window.location.href = AUTH_CONFIG.LOGIN.path;
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
