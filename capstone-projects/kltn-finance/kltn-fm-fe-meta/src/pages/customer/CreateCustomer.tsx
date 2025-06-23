import { InputField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { ImageUploadField } from "../../components/form/OtherField";
import {
  SelectField,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  STATUS_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/GlobalProvider";

const CreateCustomer = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.CUSTOMER.path,
  });
  const { branch } = useApi();
  const { customer, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.fullName)) {
      newErrors.fullName = "Họ và tên không hợp lệ";
    }
    if (!VALID_PATTERN.USERNAME.test(form.username)) {
      newErrors.username = "Tên tài khoản không hợp lệ";
    }
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!VALID_PATTERN.PHONE.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Mật khẩu không hợp lệ";
    }
    if (form.status != 0 && !form.status) {
      newErrors.status = "Trạng thái không hợp lệ";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    if (!form.branchId) {
      newErrors.branchId = "Chi nhánh không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      avatarPath: "",
      status: 1,
      confirmPassword: "",
      branchId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await customer.create(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
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
          label: PAGE_CONFIG.CUSTOMER.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_CUSTOMER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_CUSTOMER.label}
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
                    title="Mật khẩu"
                    isRequired={true}
                    placeholder="Nhập mật khẩu"
                    value={form.password}
                    onChangeText={(value: any) =>
                      handleChange("password", value)
                    }
                    type="password"
                    error={errors.password}
                  />
                  <InputField
                    title="Xác nhận mật khẩu"
                    isRequired={true}
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
                    title="Chi nhánh"
                    isRequired={true}
                    fetchListApi={branch.autoComplete}
                    placeholder="Chọn chi nhánh"
                    value={form.branchId}
                    onChange={(value: any) => handleChange("branchId", value)}
                    error={errors.branchId}
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
                        text={BUTTON_TEXT.CREATE}
                        color="royalblue"
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

export default CreateCustomer;
