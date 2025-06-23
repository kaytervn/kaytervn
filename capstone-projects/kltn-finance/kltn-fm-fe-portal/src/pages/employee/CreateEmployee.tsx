import { InputField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import {
  DatePickerField,
  ImageUploadField,
} from "../../components/form/OtherField";
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
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { parseDate, validateDateTime } from "../../services/utils";

const CreateEmployee = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.EMPLOYEE.path,
  });
  const { employee, loading } = useApi();
  const { role, department } = useApi();
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
    if (!form.groupId) {
      newErrors.groupId = "Vai trò không hợp lệ";
    }
    if (!form.departmentId) {
      newErrors.departmentId = "Phòng ban không hợp lệ";
    }
    if (form.status != 0 && !form.status) {
      newErrors.status = "Trạng thái không hợp lệ";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    const birthDate = parseDate(form.birthDate);
    if (birthDate && birthDate >= new Date()) {
      newErrors.birthDate = "Ngày sinh không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      address: "",
      birthDate: "",
      departmentId: "",
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

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await employee.create({
        ...form,
        birthDate: validateDateTime(form.birthDate),
      });
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
          label: PAGE_CONFIG.EMPLOYEE.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_EMPLOYEE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.EMPLOYEE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_EMPLOYEE.label}
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
                    title="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    value={form.address}
                    onChangeText={(value: any) =>
                      handleChange("address", value)
                    }
                    error={errors.address}
                  />
                  <DatePickerField
                    title="Ngày sinh"
                    placeholder="Chọn ngày sinh"
                    value={form.birthDate}
                    onChange={(value: any) => handleChange("birthDate", value)}
                    error={errors.birthDate}
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
                    title="Vai trò"
                    isRequired={true}
                    fetchListApi={role.list}
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
                <div className="flex flex-row space-x-2">
                  <SelectField
                    title="Phòng ban"
                    isRequired={true}
                    fetchListApi={department.autoComplete}
                    placeholder="Chọn phòng ban"
                    value={form.departmentId}
                    onChange={(value: any) =>
                      handleChange("departmentId", value)
                    }
                    error={errors.departmentId}
                  />
                  <span className="flex-1" />
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

export default CreateEmployee;
