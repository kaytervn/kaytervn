/* eslint-disable react-hooks/exhaustive-deps */
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import Sidebar2 from "../../components/main/Sidebar2";
import {
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import {
  ActionSection,
  FormCard,
  HrefLink,
} from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton } from "../../components/form/Button";
import { BUTTON_TEXT, TOAST } from "../../types/constant";
import useModal from "../../hooks/useModal";
import { useRef } from "react";
import { removeSessionCache } from "../../services/storages";
import { USER_CONFIG } from "../../components/config/PageConfigDetails";
import ChangePin from "./ChangePin";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, dataBackup, loading } = useApi();
  const { profile, setToast } = useGlobalContext();
  const { form } = useForm(
    { username: profile?.username || "", email: profile?.email || "" },
    () => {}
  );
  const handleNavigateBack = () => {
    navigate(PAGE_CONFIG.PLATFORM.path);
  };
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const {
    isModalVisible: changePasswordFormVisible,
    showModal: showChangePasswordForm,
    hideModal: hideChangePasswordForm,
    formConfig: changePasswordFormConfig,
  } = useModal();
  const {
    isModalVisible: changePinFormVisible,
    showModal: showChangePinForm,
    hideModal: hideChangePinForm,
    formConfig: changePinFormConfig,
  } = useModal();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isTxtFile =
      file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    if (!isTxtFile) {
      setToast("Invalid file type", TOAST.ERROR);
      return;
    }
    const res = await dataBackup.upload(file);
    if (res.result) {
      setToast("Upload data backup successfully", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangePassword = () => {
    showChangePasswordForm({
      title: BUTTON_TEXT.CHANGE_PASSWORD,
      hideModal: hideChangePasswordForm,
    });
  };

  const handleChangePin = () => {
    showChangePinForm({
      title: BUTTON_TEXT.CHANGE_PIN,
      hideModal: hideChangePinForm,
    });
  };

  const handleUploadDataBackup = () => {
    fileInputRef.current?.click();
  };

  const handleClearSystemKey = async () => {
    showModal({
      title: BUTTON_TEXT.CLEAR_SYSTEM_KEY,
      message: "You want to clear system key?",
      confirmText: BUTTON_TEXT.SUBMIT,
      color: "crimson",
      onConfirm: async () => {
        hideModal();
        const res = await user.clearSystemKey();
        if (res.result) {
          setToast("System key has been cleared", TOAST.SUCCESS);
          removeSessionCache();
          window.location.href = USER_CONFIG.LOGIN.path;
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleDownloadDataBackup = async () => {
    showModal({
      title: BUTTON_TEXT.DOWNLOAD_DATA_BACKUP,
      message: "You want to download data backup?",
      confirmText: BUTTON_TEXT.DOWNLOAD,
      color: "mediumseagreen",
      onConfirm: async () => {
        hideModal();
        const res = await dataBackup.download();
        if (res.result) {
          setToast("File downloaded successfully", TOAST.SUCCESS);
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PROFILE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PROFILE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={isModalVisible}
            formConfig={formConfig}
          />
          <ChangePassword
            isVisible={changePasswordFormVisible}
            formConfig={changePasswordFormConfig}
          />
          <ChangePin
            isVisible={changePinFormVisible}
            formConfig={changePinFormConfig}
          />
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <FormCard
            title={PAGE_CONFIG.PROFILE.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    disabled={true}
                    title="Username"
                    value={form.username}
                  />
                  <InputField2
                    disabled={true}
                    title="Email"
                    value={form.email}
                  />
                </div>
                <div className="flex flex-row space-x-4 text-sm text-blue-600">
                  <div className="flex flex-col space-y-2">
                    <HrefLink
                      label={BUTTON_TEXT.DOWNLOAD_DATA_BACKUP}
                      onClick={handleDownloadDataBackup}
                    />
                    <HrefLink
                      label={BUTTON_TEXT.UPLOAD_DATA_BACKUP}
                      onClick={handleUploadDataBackup}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <HrefLink
                      label={BUTTON_TEXT.CHANGE_PASSWORD}
                      onClick={handleChangePassword}
                    />
                    <HrefLink
                      label={BUTTON_TEXT.CHANGE_PIN}
                      onClick={handleChangePin}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <HrefLink
                      label={BUTTON_TEXT.CLEAR_SYSTEM_KEY}
                      onClick={handleClearSystemKey}
                    />
                  </div>
                </div>
                <ActionSection
                  children={
                    <>
                      <CancelButton
                        text={BUTTON_TEXT.BACK}
                        onClick={handleNavigateBack}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default Profile;
