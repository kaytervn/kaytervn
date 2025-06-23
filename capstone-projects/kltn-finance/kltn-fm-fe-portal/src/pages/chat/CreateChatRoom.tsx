import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CheckboxField, InputField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  CHAT_ROOM_KIND_MAP,
  TOAST,
} from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  MultiSelectField,
  SelectField,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import { ImageUploadField } from "../../components/form/OtherField";
import { LoadingDialog } from "../../components/page/Dialog";

const CreateChatRoom = ({ isVisible, formConfig }: any) => {
  const { chatRoom, loading } = useApi();
  const { employee } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.kind) {
      newErrors.kind = "Loại không hợp lệ";
    }
    if (form.kind === CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value) {
      if (!form.accountId) {
        newErrors.accountId = "Tài khoản không hợp lệ";
      }
    } else if (form.kind === CHAT_ROOM_KIND_MAP.GROUP.value) {
      if (!form.name.trim()) {
        newErrors.name = "Tên nhóm không hợp lệ";
      }
      if (form.memberIds.length < 2) {
        newErrors.memberIds = "Vui lòng chọn ít nhất 2 thành viên";
      }
    }
    return newErrors;
  };

  const { form, errors, setErrors, resetForm, handleChange, isValidForm } =
    useForm(
      {
        accountId: "",
        avatar: "",
        name: "",
        memberIds: [],
        allow_send_messages: true,
        allow_update_chat_room: true,
        allow_invite_members: true,
      },
      validate
    );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      let res;
      if (form.kind === CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value) {
        res = await chatRoom.createDirectMessage(form);
      } else {
        res = await chatRoom.createGroup({
          avatar: form.avatar,
          name: form.name,
          memberIds: form.memberIds,
          settings: JSON.stringify({
            member_permissions: {
              allow_send_messages: form.allow_send_messages,
              allow_update_chat_room: form.allow_update_chat_room,
              allow_invite_members: form.allow_invite_members,
            },
          }),
        });
      }
      if (res.result) {
        setToast(res.message, TOAST.SUCCESS);
      } else {
        setToast(res.message, TOAST.ERROR);
      }
      await formConfig.onButtonClick();
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleKindChange = (value: any) => {
    setErrors({});
    resetForm();
    handleChange("kind", value);
  };

  const renderChatRoomKindFields = () => {
    if (form?.kind === CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value) {
      return (
        <>
          <SelectField
            title="Tài khoản"
            isRequired={true}
            fetchListApi={employee.autoComplete}
            queryParams={{
              ignoreCurrentUser: 1,
              ignoreDirectMessageChatRoom: 1,
            }}
            placeholder="Chọn tài khoản"
            labelKey="fullName"
            value={form.accountId}
            onChange={(value: any) => handleChange("accountId", value)}
            error={errors.accountId}
          />
        </>
      );
    } else if (form?.kind === CHAT_ROOM_KIND_MAP.GROUP.value) {
      return (
        <>
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
          <MultiSelectField
            title="Các thành viên"
            isRequired={true}
            fetchListApi={employee.autoComplete}
            placeholder="Chọn các thành viên"
            labelKey="fullName"
            queryParams={{
              ignoreCurrentUser: 1,
            }}
            value={form?.memberIds}
            onChange={(value: any) => handleChange("memberIds", value)}
            error={errors?.memberIds}
          />
          <div className="flex-1 items-center">
            <label className="text-base font-semibold text-gray-200 mb-2 text-left flex items-center">
              {"Cài đặt nhóm"}
            </label>
            <div className="flex-col space-y-1">
              <CheckboxField
                title={"Cho phép thành viên gửi tin nhắn"}
                checked={form.allow_send_messages}
                onChange={(value: any) =>
                  handleChange("allow_send_messages", value)
                }
              />
              <CheckboxField
                title={"Cho phép thành viên cập nhật thông tin nhóm"}
                checked={form.allow_update_chat_room}
                onChange={(value: any) =>
                  handleChange("allow_update_chat_room", value)
                }
              />
              <CheckboxField
                title={"Cho phép thành viên mời thêm thành viên"}
                checked={form.allow_invite_members}
                onChange={(value: any) =>
                  handleChange("allow_invite_members", value)
                }
              />
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  if (!isVisible) return null;
  return (
    <ModalForm
      isVisible={isVisible}
      onClose={formConfig.hideModal}
      title={formConfig.title}
      children={
        <>
          <LoadingDialog isVisible={loading} />
          <div className="flex flex-col space-y-4">
            <StaticSelectField
              title="Loại trò chuyện"
              isRequired={true}
              placeholder="Chọn loại trò chuyện"
              dataMap={CHAT_ROOM_KIND_MAP}
              value={form.kind}
              onChange={handleKindChange}
              error={errors.kind}
            />
            {renderChatRoomKindFields()}
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.CREATE}
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

export default CreateChatRoom;
