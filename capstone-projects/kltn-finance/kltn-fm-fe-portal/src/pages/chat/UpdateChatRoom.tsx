import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  CHAT_ROOM_DEFAULT_SETTINGS,
  SETTING_KEYS,
  TOAST,
} from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { ImageUploadField } from "../../components/form/OtherField";
import { CheckboxField, InputField } from "../../components/form/InputField";
import { LoadingDialog } from "../../components/page/Dialog";
import useApi from "../../hooks/useApi";
import { getNestedValue } from "../../services/utils";

const UpdateChatRoom = ({ isVisible, formConfig }: any) => {
  const settings = formConfig?.settings;
  const ownerPermission = settings?.isOwner;

  const { chatRoom, loading } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên nhóm không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await chatRoom.get(formConfig.initForm.id);
      if (res.result) {
        const data = res.data;
        const settings = getGroupSettings(data?.settings);
        let formData: any = {
          id: data.id,
          name: data.name,
          avatar: data.avatar,
        };
        if (ownerPermission) {
          formData.allow_send_messages = getNestedValue(
            settings,
            SETTING_KEYS.ALLOW_SEND_MESSAGES
          );
          formData.allow_update_chat_room = getNestedValue(
            settings,
            SETTING_KEYS.ALLOW_UPDATE_CHAT_ROOM
          );
          formData.allow_invite_members = getNestedValue(
            settings,
            SETTING_KEYS.ALLOW_INVITE_MEMBERS
          );
        }
        setForm(formData);
      } else {
        formConfig?.hideModal();
      }
    };

    if (formConfig?.initForm?.id) {
      fetchData();
    }
  }, [formConfig]);

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      formConfig.hideModal();
      let formData: any = {
        id: form.id,
        avatar: form.avatar,
        name: form.name,
      };
      if (ownerPermission) {
        formData.settings = JSON.stringify({
          member_permissions: {
            allow_send_messages: form.allow_send_messages,
            allow_update_chat_room: form.allow_update_chat_room,
            allow_invite_members: form.allow_invite_members,
          },
        });
      }
      await formConfig.onButtonClick(formData);
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const getGroupSettings = (settingsStr: any) => {
    try {
      return JSON.parse(settingsStr) || CHAT_ROOM_DEFAULT_SETTINGS;
    } catch {
      return CHAT_ROOM_DEFAULT_SETTINGS;
    }
  };

  if (!isVisible) return null;
  return (
    <ModalForm
      zIndex={50}
      isVisible={isVisible}
      onClose={formConfig.hideModal}
      title={formConfig.title}
      children={
        <>
          <LoadingDialog isVisible={loading} />
          <div className="flex flex-col space-y-4">
            <ImageUploadField
              title="Ảnh nhóm"
              value={form?.avatar}
              onChange={(value: any) => handleChange("avatar", value)}
            />
            <InputField
              title="Tên nhóm"
              isRequired={true}
              placeholder="Nhập tên nhóm"
              value={form?.name}
              onChangeText={(value: any) => handleChange("name", value)}
              error={errors?.name}
            />
            {ownerPermission && (
              <div className="flex-1 items-center">
                <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
                  {"Cài đặt nhóm"}
                </label>
                <div className="flex-col space-y-1">
                  <CheckboxField
                    title={"Cho phép thành viên gửi tin nhắn"}
                    checked={form?.allow_send_messages}
                    onChange={(value: any) =>
                      handleChange("allow_send_messages", value)
                    }
                  />
                  <CheckboxField
                    title={"Cho phép thành viên cập nhật thông tin nhóm"}
                    checked={form?.allow_update_chat_room}
                    onChange={(value: any) =>
                      handleChange("allow_update_chat_room", value)
                    }
                  />
                  <CheckboxField
                    title={"Cho phép thành viên mời thêm thành viên"}
                    checked={form?.allow_invite_members}
                    onChange={(value: any) =>
                      handleChange("allow_invite_members", value)
                    }
                  />
                </div>
              </div>
            )}
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.UPDATE}
                    onClick={handleSubmit}
                  />
                </>
              }
            />
          </div>
        </>
      }
    />
  );
};

export default UpdateChatRoom;
