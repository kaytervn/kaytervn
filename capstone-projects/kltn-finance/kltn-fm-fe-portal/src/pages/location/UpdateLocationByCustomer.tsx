import { SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField } from "../../components/form/InputField";
import { ImageUploadField } from "../../components/form/OtherField";
import { LoadingDialog } from "../../components/page/Dialog";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  STATUS_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { useEffect } from "react";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { StaticSelectField } from "../../components/form/SelectField";
import { truncateToDDMMYYYY } from "../../services/utils";

const UpdateLocationByCustomer = () => {
  const { setTenantInfo, setToast, hasRoles } = useGlobalContext();
  const { auth, loading } = useApi();
  const canUpdate = hasRoles("LO_U_B_C");

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên khu vực không hợp lệ";
    }
    if (form.hotline && !VALID_PATTERN.PHONE.test(form.hotline)) {
      newErrors.hotline = "Đường dây nóng không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm({ logoPath: "", name: "", hotline: "" }, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await auth.myLocation();
      if (res.result) {
        const data = res.data;
        setForm({
          logoPath: data.logoPath,
          name: data.name,
          tenantId: data.tenantId,
          hotline: data.hotline,
          status: data.status,
          startDate: data.startDate,
          expiredDate: data.expiredDate,
        });
      } else {
        window.location.href = "/";
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!isValidForm()) {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
      return;
    }
    const res = await auth.updateLocationByCustomer(form);
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    const locationInfo = await auth.myLocation();
    if (locationInfo.result) {
      setTenantInfo(locationInfo.data);
      setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
    } else {
      setToast(locationInfo.message, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.LOCATION.label,
        },
      ]}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.LOCATION.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  disabled={!canUpdate}
                  title="Biểu trưng"
                  value={form.logoPath}
                  onChange={(value: any) => handleChange("logoPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={!canUpdate}
                    title="Tên khu vực"
                    isRequired={true}
                    placeholder="Nhập tên khu vực"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <InputField
                    title="Mã thuê bao"
                    isRequired={true}
                    disabled={true}
                    value={form.tenantId}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Đường dây nóng"
                    disabled={!canUpdate}
                    placeholder="Nhập đường dây nóng"
                    value={form.hotline}
                    onChangeText={(value: any) =>
                      handleChange("hotline", value)
                    }
                    error={errors.hotline}
                  />
                  <StaticSelectField
                    title="Trạng thái"
                    isRequired={true}
                    disabled={true}
                    dataMap={STATUS_MAP}
                    value={form.status}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Ngày bắt đầu"
                    isRequired={true}
                    disabled={true}
                    value={truncateToDDMMYYYY(form.startDate)}
                  />
                  <InputField
                    title="Ngày hết hạn"
                    isRequired={true}
                    disabled={true}
                    value={truncateToDDMMYYYY(form.expiredDate)}
                  />
                </div>
                {canUpdate && (
                  <ActionSection
                    children={
                      <>
                        <SubmitButton
                          text={BUTTON_TEXT.UPDATE}
                          onClick={handleSubmit}
                        />
                      </>
                    }
                  />
                )}
              </div>
            }
          />
        </>
      }
    />
  );
};

export default UpdateLocationByCustomer;
