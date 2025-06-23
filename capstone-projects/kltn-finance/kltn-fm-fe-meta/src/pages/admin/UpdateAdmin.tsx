import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  GROUP_KIND_MAP,
  STATUS_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useForm from "../../hooks/useForm";
import { PAGE_CONFIG } from "../../components/PageConfig";
import Sidebar from "../../components/page/Sidebar";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { ImageUploadField } from "../../components/form/OtherField";
import { InputField } from "../../components/form/InputField";
import {
  SelectField,
  StaticSelectField,
} from "../../components/form/SelectField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import { useEffect, useState } from "react";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/GlobalProvider";

const UpdateAdmin = () => {
  const { id } = useParams();
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ADMIN.path,
  });
  const { admin, loading } = useApi();
  const { role } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.fullName)) {
      newErrors.fullName = "Họ và tên không hợp lệ";
    }
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!VALID_PATTERN.PHONE.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!form.groupId) {
      newErrors.groupId = "Vai trò không hợp lệ";
    }
    if (form.status != 0 && !form.status) {
      newErrors.status = "Trạng thái không hợp lệ";
    }
    if (form.password || form.confirmPassword) {
      if (!VALID_PATTERN.PASSWORD.test(form.password)) {
        newErrors.password = "Mật khẩu không hợp lệ";
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
      }
    }
    return newErrors;
  };
  const [adminData, setAdminData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        avatarPath: "",
        groupId: "",
        status: 1,
        confirmPassword: "",
      },
      validate
    );

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      resetForm();
      const res = await admin.get(id);
      if (res.result) {
        const data = res.data;
        setAdminData(data);
        setForm({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          phone: data.phone,
          avatarPath: data.avatarPath,
          status: data.status,
          groupId: data.group?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await admin.update({ id, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${adminData?.fullName}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_ADMIN.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ADMIN.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_ADMIN.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Ảnh đại diện"
                  value={form.avatarPath}
                  onChange={(value: any) => handleChange("avatarPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Họ và tên"
                    isRequired={true}
                    placeholder="Nhập họ và tên"
                    value={form.fullName}
                    onChangeText={(value: any) =>
                      handleChange("fullName", value)
                    }
                    error={errors.fullName}
                  />
                  <InputField
                    title="Tên tài khoản"
                    disabled={true}
                    isRequired={true}
                    placeholder="Nhập tên tài khoản"
                    value={form.username}
                    onChangeText={(value: any) =>
                      handleChange("username", value)
                    }
                    error={errors.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Địa chỉ email"
                    isRequired={true}
                    placeholder="Nhập địa chỉ email"
                    value={form.email}
                    onChangeText={(value: any) => handleChange("email", value)}
                    error={errors.email}
                  />
                  <InputField
                    title="Số điện thoại"
                    isRequired={true}
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    onChangeText={(value: any) => handleChange("phone", value)}
                    error={errors.phone}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Mật khẩu mới"
                    placeholder="Nhập mật khẩu"
                    value={form.password}
                    onChangeText={(value: any) =>
                      handleChange("password", value)
                    }
                    type="password"
                    error={errors.password}
                  />
                  <InputField
                    title="Xác nhận mật khẩu mới"
                    placeholder="Nhập mật khẩu xác nhận"
                    value={form.confirmPassword}
                    onChangeText={(value: any) =>
                      handleChange("confirmPassword", value)
                    }
                    type="password"
                    error={errors.confirmPassword}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectField
                    title="Vai trò"
                    isRequired={true}
                    fetchListApi={role.list}
                    queryParams={{
                      kind: GROUP_KIND_MAP.ADMIN.value,
                    }}
                    placeholder="Chọn vai trò"
                    value={form.groupId}
                    onChange={(value: any) => handleChange("groupId", value)}
                    error={errors.groupId}
                  />
                  <StaticSelectField
                    title="Trạng thái"
                    isRequired={true}
                    placeholder="Chọn trạng thái"
                    dataMap={STATUS_MAP}
                    value={form.status}
                    onChange={(value: any) => handleChange("status", value)}
                    error={errors.status}
                  />
                </div>
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
                        onClick={handleSubmit}
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

export default UpdateAdmin;
